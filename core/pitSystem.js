// F1 Manager 2025 – Versão 6.0
//
// Módulo de pit-stop. Responsável por simular paradas nos boxes,
// incluindo troca de pneus, ajuste de asa dianteira, reparos de
// componentes e tempos de execução. Também calcula falhas em paradas e
// retorna mensagens apropriadas para o HUD.

import { createTyreSet } from './tyreSystem.js';

export function performPitStop(driver, newCompoundKey, frontWingAdjust = 0, repair = false) {
  // Tempo base de pit em segundos. As equipes mais fortes são mais
  // eficientes, então aplicamos um multiplicador baseado na equipe.
  let tempoBase = 2.4;
  // Multiplicador por equipe (0.9 rápido, 1.1 lento)
  const equipeMult = driver.equipe && driver.equipe.pitMult ? driver.equipe.pitMult : 1.0;
  let tempoPit = tempoBase * equipeMult;
  let mensagem = '';
  // Ajuste de asa dianteira adiciona tempo se diferente de zero.
  if (frontWingAdjust !== 0) {
    tempoPit += Math.abs(frontWingAdjust) * 0.2;
  }
  // Reparos aumentam significativamente o tempo.
  if (repair) {
    tempoPit += 5.0;
    mensagem += 'Reparo realizado. ';
    // Conserta dano do motor ou aerodinâmica se existir
    driver.danos.motor = 0;
    driver.danos.aero = 0;
  }
  // Possibilidade de erro no pit: 8% de chance.
  const erroRnd = Math.random();
  if (erroRnd < 0.08) {
    // Adiciona tempo extra entre 2–5s
    const extra = 2 + Math.random() * 3;
    tempoPit += extra;
    mensagem += 'Erro no pit! Parafuso preso adicionou ' + extra.toFixed(1) + 's. ';
  }
  // Troca de pneu
  const novoPneu = createTyreSet(newCompoundKey);
  driver.tyre = novoPneu;
  driver.stintAtual += 1;
  driver.compUsados.add(newCompoundKey);
  // Ajuste da asa anterior
  driver.asaDianteira += frontWingAdjust;
  // Adiciona tempo final a ser aplicado no raceEngine.
  return { tempoPit, mensagem: mensagem.trim() };
}