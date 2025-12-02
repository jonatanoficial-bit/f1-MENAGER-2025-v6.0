// F1 Manager 2025 – Versão 6.0
//
// Módulo de física simplificada. Responsável por calcular o tempo
// necessário para percorrer cada setor da pista, considerando o
// desempenho do piloto e do carro, desgaste de pneus, condições de
// clima, modo de motor e influência do ERS. A física detalhada de
// dinâmica veicular é simplificada por razões de performance e legibilidade.

import { REGRAS } from '../data/regras.js';

// Calcula o tempo de um setor (em segundos). Recebe o piloto, o tipo de
// setor (straight, slow, medium, fast), a pista (que contém tempos base
// para cada setor), o resultado do pneu (penalidade), o boost de ERS
// (redução de tempo em segundos), o modo de motor e condições de clima.
export function computeSectorTime(driver, sectorType, pista, tyrePenalty, ersBoost, motorMode, weather, safetyCarMult) {
  // Base time according to track definition (fallback to 30s)
  const baseTime = (pista.sectorTimes && pista.sectorTimes[sectorType]) || 30;
  // Rating do piloto (0–100). Quanto maior, melhor.
  const rating = driver.rating || 80;
  const carPerf = driver.equipe?.carBase || 0.8;
  // Modo de motor. influi na potência e no consumo
  const m = REGRAS.motorModes.find(m => m.key === motorMode) || REGRAS.motorModes[1];
  // Clima: chuva reduz aderência.
  const rainMult = weather.rainLevel > 0 ? (1 + weather.rainLevel * 0.3) : 1;
  // Temperatura da pista: muito frio ou quente prejudica aderência
  const tempDiff = Math.abs(weather.trackTemp - 25);
  const tempMult = 1 + (tempDiff / 25) * 0.05;
  // Cálculo base: tempo base dividido por performance do piloto e do carro
  let time = baseTime * rainMult * tempMult;
  // Ajusta por habilidade (piloto) e performance do carro
  const perfFactor = (1.0 / ((rating / 100) * carPerf)) * (1.1 - m.potencia * 0.1);
  time *= perfFactor;
  // Aplica penalidade do pneu
  time += tyrePenalty;
  // Aplica boost do ERS (negativo = redução do tempo)
  time -= ersBoost;
  // Aplica multiplicador do Safety Car se ativo
  time *= safetyCarMult;
  // Aleatoriedade leve para evitar tempos idênticos
  time *= (1 + (Math.random() - 0.5) * 0.01);
  return time;
}