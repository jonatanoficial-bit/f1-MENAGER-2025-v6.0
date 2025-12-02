// F1 Manager 2025 – Versão 6.0
//
// Cérebro da IA dos pilotos. Decide modos de ERS e motor,
// agressividade, momento de parar no box e escolha de compostos. O
// comportamento depende do estilo do piloto e das condições de pista.

import { REGRAS } from '../data/regras.js';

export class AiDriverBrain {
  constructor(driver) {
    this.driver = driver;
    this.targetPitLap = null;
  }

  // Decide o modo de ERS. Pilotos agressivos tendem a usar mais boost.
  decideErsMode(weather) {
    const { rainLevel } = weather;
    const agg = this.driver.agressividade || 0.5;
    if (rainLevel > 0.4) {
      return 'balanced';
    }
    // 50% base + agressividade → escolher attack ou balanced
    return Math.random() < agg ? 'attack' : 'balanced';
  }

  // Decide o modo de motor baseado em combustível restante e posição.
  decideMotorMode(volta, totalVoltas) {
    const fuelRatio = (this.driver.fuel || 1.0);
    const pos = this.driver.posicao || 1;
    // Nas últimas 5 voltas, usa ataque se estiver disputando posição
    if (totalVoltas - volta < 5 && pos > 1 && pos < 6) {
      return 'attack';
    }
    // Se combustível baixo, economiza
    if (fuelRatio < 0.3) return 'economy';
    // Escolha padrão
    return 'standard';
  }

  // Decide se deve parar no box nesta volta. Analisa desgaste do pneu,
  // stint atual, probabilidade de chuva e janela de pit.
  decidePit(volta, totalVoltas, weather) {
    const tyre = this.driver.tyre;
    // se já não definiu uma volta-alvo de pit, cria uma janela
    if (!this.targetPitLap) {
      // Stint de slick dura de 12 a 20 voltas; escolhe meta com base no composto
      let baseStint = 15;
      if (tyre.compound === 'soft') baseStint = 12;
      if (tyre.compound === 'hard') baseStint = 20;
      // Randomiza um pouco
      this.targetPitLap = Math.floor(baseStint * (0.8 + Math.random() * 0.4));
    }
    // Se volta atual maior ou igual à meta, e desgaste acima de 60%, pára
    const desgaste = tyre.desgaste;
    if (volta >= this.targetPitLap && desgaste > 0.6) {
      this.targetPitLap += 15; // define próxima meta para evitar repetição
      return true;
    }
    // Se chuva forte e pneus slick, pára imediatamente
    if (weather.rainLevel > 0.5 && ['soft','medium','hard'].includes(tyre.compound)) {
      return true;
    }
    return false;
  }

  // Escolhe o próximo composto de pneu para o pit.
  escolherProximoComposto(weather) {
    if (weather.rainLevel > 0.5) return 'wet';
    if (weather.rainLevel > 0.2) return 'intermediate';
    // Baseado em stint atual – alterna entre macio e médio/duro
    if (this.driver.stintAtual % 2 === 0) {
      return this.driver.tyre.compound === 'medium' ? 'soft' : 'medium';
    }
    return 'hard';
  }
}