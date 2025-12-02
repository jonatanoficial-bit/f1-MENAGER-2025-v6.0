// F1 Manager 2025 – Versão 6.0
//
// Módulo de eventos aleatórios. Gera acidentes, quebras de motor,
// falhas inesperadas, punições e decide acionar Safety Car ou VSC.
// Deve ser chamado pelo raceEngine a cada volta para avaliar novas
// ocorrências.

import { REGRAS } from '../data/regras.js';

export class EventEngine {
  constructor() {
    this.events = [];
  }

  // Avalia a ocorrência de novos eventos. Recebe a lista de drivers
  // vivos e o estado atual da pista (chuva). Retorna um objeto com
  // flags que podem acionar Safety Car ou VSC e uma lista de eventos.
  avaliar(lapNumber, drivers, rainLevel) {
    this.events = [];
    let acionaSC = false;
    let acionaVSC = false;
    // Probabilidade de acidente aumenta na chuva
    const probAcidente = REGRAS.eventos.probAcidenteGrave + rainLevel * 0.05;
    if (Math.random() < probAcidente) {
      // Seleciona um piloto aleatório entre vivos
      const vivos = drivers.filter(d => !d.abandonou);
      if (vivos.length > 0) {
        const piloto = vivos[Math.floor(Math.random() * vivos.length)];
        piloto.abandonou = true;
        this.events.push({ tipo: 'acidente', piloto: piloto.nome, volta: lapNumber });
        acionaSC = true;
      }
    }
    // Checa falha mecânica aleatória
    const probFalha = 0.01 + rainLevel * 0.02;
    drivers.forEach(d => {
      if (!d.abandonou && Math.random() < probFalha) {
        d.abandonou = true;
        this.events.push({ tipo: 'falha', piloto: d.nome, volta: lapNumber });
        acionaVSC = true;
      }
    });
    return { acionaSC, acionaVSC, eventos: this.events };
  }
}