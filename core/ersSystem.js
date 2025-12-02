// F1 Manager 2025 – Versão 6.0
//
// Sistema de ERS – Energy Recovery System. Modela a bateria híbrida dos
// carros modernos da Fórmula 1. Permite modos de operação que aumentam
// o desempenho em troco de consumir energia elétrica. A bateria é
// recarregada em frenagens e curvas, simulando a função do MGU-K.

import { REGRAS } from '../data/regras.js';

export class ErsSystem {
  constructor() {
    this.modo = 'balanced';
    this.nivel = 1.0; // 0–1 representa a carga da bateria
  }

  // Altera o modo de ERS. Aceita keys definidas em REGRAS.ersModes.
  setModo(novoModo) {
    const mod = REGRAS.ersModes.find(m => m.key === novoModo);
    if (mod) {
      this.modo = novoModo;
    }
  }

  // Atualiza o estado da bateria num setor. Recebe tempo do setor (s) e
  // se o piloto está acelerando ou não (para decidir quando aplicar o
  // boost). Retorna o tempo extra retirado do setor graças ao ERS.
  updateForSector(setorTempo, aplicandoAceleracao) {
    const mod = REGRAS.ersModes.find(m => m.key === this.modo) || REGRAS.ersModes[1];
    // Se está aplicando boost e há nível de bateria, concede ganho de tempo.
    let ganho = 0;
    if (aplicandoAceleracao && this.nivel > 0.02) {
      ganho = mod.boost;
      this.nivel = Math.max(0, this.nivel + mod.recarga - Math.abs(mod.boost) * 0.02);
    } else {
      // Não aplicou boost ou bateria vazia; só recupera energia.
      this.nivel = Math.min(1, this.nivel + mod.recarga);
    }
    return ganho;
  }
}