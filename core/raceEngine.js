// F1 Manager 2025 – Versão 6.0
//
// Módulo central do motor de corrida. Integra todos os subsistemas
// (física, pneus, ERS, IA, clima, safety car, eventos) para simular uma
// corrida completa. Esta implementação é uma simplificação focada em
// demonstrar a arquitetura da versão 6.0; ajustes finos e novas
// funcionalidades podem ser adicionados posteriormente.

import { computeSectorTime } from './physicsEngine.js';
import { updateTyreForSector } from './tyreSystem.js';
import { ErsSystem } from './ersSystem.js';
import { AiDriverBrain } from './aiDriverBrain.js';
import { WeatherEngine } from './weatherEngine.js';
import { SafetyCarSystem } from './safetyCar.js';
import { EventEngine } from './eventEngine.js';
import { performPitStop } from './pitSystem.js';
import { REGRAS } from '../data/regras.js';

// Função utilitária para clonar um array de pontos (x, y)
function clonePath(path) {
  return path.map(p => [p[0], p[1]]);
}

export class RaceEngine {
  constructor(pista, drivers, uiCallbacks) {
    this.pista = pista;
    this.drivers = drivers;
    this.ui = uiCallbacks || {};
    // Resoluções da pista para renderização (mapa)
    this.path = pista.path || [];
    this.pitPath = pista.pitPath || [];
    // Dividir o traçado em tipos de setor (straight, slow, medium, fast)
    this.sectorTypes = pista.sectorTypes || ['straight','medium','slow','fast'];
    this.weather = new WeatherEngine();
    this.safetyCar = new SafetyCarSystem();
    this.eventEngine = new EventEngine();
    // Inicializar cada driver
    this.drivers.forEach((d, idx) => {
      d.id = idx;
      d.progress = 0; // posição no caminho (0–1)
      d.lap = 0;
      d.totalTime = 0;
      d.sectorIndex = 0;
      d.tyre = d.tyre || null;
      d.ersSystem = new ErsSystem();
      d.aiBrain = new AiDriverBrain(d);
      d.abandonou = false;
      d.stintAtual = 0;
      d.compUsados = new Set();
      d.danos = { motor: 0, aero: 0 };
      d.asaDianteira = 0;
      d.fuel = 1.0;
      // se não tiver pneu atribuído, cria médio por padrão
      if (!d.tyre) {
        d.tyre = { compound: 'medium', nome: 'Médio', cor: 'yellow', desgaste: 0, temperatura: 100, baseDeg: 0.0025, tempIdeal: 100, tempRange: 10 };
      }
    });
    this.totalVoltas = pista.voltas || 50;
    this.timer = null;
    this.tickInterval = 800; // ms
    this.onFinished = null;
  }

  // Inicia a simulação da corrida. Recebe callback para avisar quando
  // terminar. O UI callback é atualizado a cada tick para redesenhar
  // mapa e placar.
  start(onFinished) {
    this.onFinished = onFinished;
    // Atualiza UI com clima inicial
    if (this.ui.updateWeather) {
      this.ui.updateWeather({ trackTemp: this.weather.trackTemp, rainLevel: this.weather.rainLevel });
    }
    this.timer = setInterval(() => this.update(), this.tickInterval);
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }

  update() {
    // Se corrida já acabou, não faz nada
    if (!this.drivers.some(d => d.lap < this.totalVoltas && !d.abandonou)) {
      this.stop();
      if (this.onFinished) this.onFinished(this.drivers);
      return;
    }
    // Atualiza clima e eventos
    const clima = this.weather.update(this.tickInterval / 1000, this.drivers[0].lap);
    // Avalia eventos (acidentes e falhas)
    const eventos = this.eventEngine.avaliar(this.drivers[0].lap, this.drivers, clima.rainLevel);
    if (eventos.acionaSC && !this.safetyCar.ativo) {
      this.safetyCar.acionar('SC', this.drivers[0].lap);
    }
    if (eventos.acionaVSC && !this.safetyCar.ativo) {
      this.safetyCar.acionar('VSC', this.drivers[0].lap);
    }
    // Atualiza Safety Car se ativo
    this.safetyCar.atualizar(this.drivers[0].lap);
    const scMult = this.safetyCar.obterMultiplicador();
    // Processa cada piloto
    this.drivers.forEach(d => {
      if (d.abandonou) return;
      // Se em pit-stop (progress negativo), reduz tempo e atualiza progress
      if (d.emPit) {
        d.pitTimer -= this.tickInterval / 1000;
        if (d.pitTimer <= 0) {
          d.emPit = false;
          // volta para pista na saída do pit
          d.progress = d.pitExitProgress || 0;
        }
        d.totalTime += this.tickInterval / 1000;
        return;
      }
      // Se está atrás do Safety Car, não avança progress (velocidade reduzida)
      // mas ainda percorre a pista lentamente
      const sectorType = this.pista.sectorTypes[d.sectorIndex % this.pista.sectorTypes.length];
      // Atualiza pneu e calcula penalidade
      const estiloPiloto = 0.8 + (d.agressividade || 0.5) * 0.6; // base 0.8–1.4
      const penalty = updateTyreForSector(d.tyre, sectorType, estiloPiloto, clima.trackTemp, clima.rainLevel);
      // Atualiza ERS e obtém boost
      const ersBoost = d.ersSystem.updateForSector(this.tickInterval / 1000, true);
      // Decide modo de motor e ERS (IA). Jogador não implementado, usa Standard
      const modoMotor = d.aiBrain.decideMotorMode(d.lap, this.totalVoltas);
      const modoERS = d.aiBrain.decideErsMode(clima);
      d.ersSystem.setModo(modoERS);
      // Calcula tempo do setor
      const timeSec = computeSectorTime(d, sectorType, this.pista, penalty, ersBoost, modoMotor, clima, scMult);
      d.totalTime += timeSec;
      // Atualiza progresso na pista (aproximação: progress avança proporcional ao tempo do setor e ao tamanho do setor)
      const sectorProgress = 1 / this.pista.sectorTypes.length;
      // Se Safety Car ou VSC, avanço reduzido
      d.progress += (sectorProgress * (this.tickInterval / 1000)) / timeSec;
      d.sectorIndex++;
      // Pit-stop: se AI decidir parar ou se pneu acabou
      const deveParar = d.aiBrain.decidePit(d.lap, this.totalVoltas, clima);
      if (deveParar && !this.safetyCar.ativo && !d.emPit) {
        // Entra no pit
        const nextCompound = d.aiBrain.escolherProximoComposto(clima);
        const { tempoPit, mensagem } = performPitStop(d, nextCompound, 0, false);
        d.emPit = true;
        d.pitTimer = tempoPit;
        // Calcula progress de entrada e saída. Entrará na posição 0 (início do pit) e retornará onde parou + sectorProgress/2
        d.pitExitProgress = d.progress + sectorProgress / 2;
        d.pitExitProgress = d.pitExitProgress % 1;
        if (this.ui.pitMessage) this.ui.pitMessage(d, mensagem);
        return;
      }
      // Checa se completou uma volta
      if (d.progress >= 1) {
        d.progress -= 1;
        d.lap++;
        d.sectorIndex = 0;
        // gasta combustível
        d.fuel = Math.max(0, d.fuel - 1 / this.totalVoltas);
      }
    });
    // Atualiza ordem e posições
    const vivos = this.drivers.filter(d => !d.abandonou);
    vivos.sort((a, b) => {
      // Maior volta primeiro, menor totalTime depois
      if (a.lap !== b.lap) return b.lap - a.lap;
      return a.totalTime - b.totalTime;
    });
    vivos.forEach((d, i) => {
      d.posicao = i + 1;
    });
    // Atualiza UI
    if (this.ui.updateDriverPositions) {
      this.ui.updateDriverPositions(this.drivers);
    }
    if (this.ui.updateWeather) {
      this.ui.updateWeather(clima);
    }
    // Se ocorreram eventos, notifica UI
    if (eventos.eventos.length && this.ui.showEvents) {
      this.ui.showEvents(eventos.eventos);
    }
  }
}

// Função auxiliar para construir um objeto de pista a partir de
// propriedades básicas. Cada pista deve definir quantas voltas, o
// traçado principal (path), a rota do pit (pitPath), os tipos de
// setores e tempos base por tipo.
export function criarPista(config) {
  return {
    nome: config.nome || 'Autódromo',
    voltas: config.voltas || 50,
    path: clonePath(config.path || []),
    pitPath: clonePath(config.pitPath || []),
    sectorTypes: config.sectorTypes || ['straight','medium','slow','fast'],
    sectorTimes: config.sectorTimes || { straight: 25, medium: 30, slow: 35, fast: 28 },
  };
}