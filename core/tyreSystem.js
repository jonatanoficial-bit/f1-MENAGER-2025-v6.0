// F1 Manager 2025 – Versão 6.0
//
// Módulo responsável pelo gerenciamento dos pneus. Define os diferentes
// compostos, controla o desgaste, temperatura e penalidades de performance.
// Esta versão foi expandida para levar em consideração diferentes tipos
// de setores (reta, curvas de baixa, média e alta), influências do
// piloto e condições climáticas.

import { REGRAS } from '../data/regras.js';

// Definição de compostos de pneus inspirados na Pirelli 2025. Os valores
// baseDeg são taxas de desgaste por setor (em %). tempIdeal é a
// temperatura ideal da borracha e tempRange define a janela antes de
// ocorrer perda de performance.
export const COMPOSTOS = {
  soft: {
    key: 'soft',
    nome: 'Macio',
    cor: 'red',
    baseDeg: 0.0035,
    tempIdeal: 105,
    tempRange: 10,
  },
  medium: {
    key: 'medium',
    nome: 'Médio',
    cor: 'yellow',
    baseDeg: 0.0025,
    tempIdeal: 100,
    tempRange: 10,
  },
  hard: {
    key: 'hard',
    nome: 'Duro',
    cor: 'white',
    baseDeg: 0.0018,
    tempIdeal: 95,
    tempRange: 8,
  },
  intermediate: {
    key: 'intermediate',
    nome: 'Intermediário',
    cor: 'green',
    baseDeg: 0.0045,
    tempIdeal: 70,
    tempRange: 15,
  },
  wet: {
    key: 'wet',
    nome: 'Chuva',
    cor: 'blue',
    baseDeg: 0.0050,
    tempIdeal: 60,
    tempRange: 20,
  },
};

// Cria o estado de um conjunto de pneus com base no composto selecionado.
export function createTyreSet(compoundKey) {
  const comp = COMPOSTOS[compoundKey] || COMPOSTOS.medium;
  return {
    compound: comp.key,
    nome: comp.nome,
    cor: comp.cor,
    desgaste: 0, // 0–1
    temperatura: comp.tempIdeal,
    baseDeg: comp.baseDeg,
    tempIdeal: comp.tempIdeal,
    tempRange: comp.tempRange,
  };
}

// Atualiza o estado do pneu para um setor completado. Considera tipo de
// setor, estilo do piloto (0.8 conservador – 1.2 agressivo), temperatura
// ambiente e nível de chuva (0–1). Retorna um modificador de performance
// que deve ser somado ao delta de tempo do setor (segundos).
export function updateTyreForSector(tyreSet, sectorType, estiloPiloto, trackTemp, rainLevel) {
  // Definir multiplicadores por tipo de setor. Reta desgasta menos,
  // curvas de alta desgastam mais.
  const sectorDeg = {
    straight: 0.6,
    slow: 1.2,
    medium: 1.0,
    fast: 1.4,
  };
  const mult = sectorDeg[sectorType] || 1.0;
  // Ajusta desgaste base por estilo do piloto e condições de pista.
  let desgasteInc = tyreSet.baseDeg * mult * estiloPiloto;
  // A chuva resfria os pneus e reduz desgaste, mas pode aumentar
  // degradação se o composto for slick (soft/medium/hard).
  if (rainLevel > 0.2) {
    if (tyreSet.compound === 'soft' || tyreSet.compound === 'medium' || tyreSet.compound === 'hard') {
      desgasteInc *= 1.5; // slick no molhado estraga rapidamente
    } else {
      desgasteInc *= 0.8; // inter/wet desgastam um pouco menos na chuva
    }
  }
  tyreSet.desgaste = Math.min(1, tyreSet.desgaste + desgasteInc);
  // Atualiza temperatura dos pneus considerando clima e estilo do piloto.
  const tempDelta = ((trackTemp - tyreSet.tempIdeal) / 20) * 2.0 + (estiloPiloto - 1.0) * 5;
  tyreSet.temperatura += tempDelta;
  // Penalidade de performance baseada em desgaste e temperatura.
  let performancePenalty = 0;
  // Penalidade pelo desgaste – aumenta exponencialmente após 60%.
  performancePenalty += Math.pow(tyreSet.desgaste, 1.5) * 3; // ~0 a 3 segundos
  // Penalidade se temperatura fora da faixa ideal.
  const tempDiff = Math.abs(tyreSet.temperatura - tyreSet.tempIdeal) - tyreSet.tempRange;
  if (tempDiff > 0) {
    performancePenalty += (tempDiff / 5) * 0.2; // ~0.2s por 5°C acima da faixa
  }
  return performancePenalty;
}

export function getCompoundName(key) {
  return COMPOSTOS[key]?.nome || key;
}