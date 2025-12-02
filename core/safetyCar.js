// F1 Manager 2025 – Versão 6.0
//
// Controla o Safety Car e o Virtual Safety Car. Durante o Safety Car,
// os carros devem agrupar-se e reduzir drasticamente a velocidade.
// Este módulo controla a duração mínima em pista, velocidades reduzidas
// e o retorno à corrida normal.

import { REGRAS } from '../data/regras.js';

export class SafetyCarSystem {
  constructor() {
    this.ativo = false;
    this.tipo = null; // 'SC' ou 'VSC'
    this.voltaInicio = 0;
    this.contadorVoltas = 0;
  }

  // Aciona Safety Car ou VSC. Armazena a volta de início e tipo.
  acionar(tipo, voltaAtual) {
    this.ativo = true;
    this.tipo = tipo;
    this.voltaInicio = voltaAtual;
    this.contadorVoltas = 0;
  }

  // Atualiza o estado. Deve ser chamado a cada volta.
  atualizar(voltaAtual) {
    if (!this.ativo) return;
    this.contadorVoltas = voltaAtual - this.voltaInicio;
    // Desativa após número mínimo de voltas (definido em regras)
    if (this.tipo === 'SC' && this.contadorVoltas >= REGRAS.safetyCarMinLaps) {
      this.ativo = false;
      this.tipo = null;
    }
    // Para VSC, desativa após 1 volta
    if (this.tipo === 'VSC' && this.contadorVoltas >= 1) {
      this.ativo = false;
      this.tipo = null;
    }
  }

  // Retorna o multiplicador de velocidade para aplicar aos carros. No
  // Safety Car real, os carros ficam atrás do SC a ~70% da velocidade.
  obterMultiplicador() {
    if (!this.ativo) return 1.0;
    if (this.tipo === 'SC') return 0.6;
    if (this.tipo === 'VSC') return 0.7;
    return 1.0;
  }
}