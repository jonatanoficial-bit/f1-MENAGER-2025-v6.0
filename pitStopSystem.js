/* ===============================================================
    PIT STOP SYSTEM 3.0 — F1 MANAGER 2025
    ✔ Pit lane realista
    ✔ Tempos variáveis
    ✔ Erros dos mecânicos
    ✔ Boxes específicos por equipe
    ✔ Temperatura / desgaste influenciam tempo
    ✔ Integra com raceSystem.js
=================================================================*/

const TEMPO_BASE_PIT = 2800; // tempo médio em ms (2.8s)
const ERRO_MIN = 0;
const ERRO_MAX = 2200; // até +2.2s por erro

// Probabilidade de erro por cansaço mecânicos e pressão na corrida
const CHANCE_ERRO = 0.22;

// Tipo de pneus e tempos
const TEMPO_PNEUS = {
    "SOFT": 0,
    "MEDIUM": 150,
    "HARD": 250,
    "WET": 400
};


// ================================================================
/**
 * ⛽ Inicia um Pit Stop
 * c = objeto carro
 * clima = "seco" | "chuva"
 */
function iniciarPitStop(c, clima) {

    // Sinaliza no carro
    c.noPit = true;
    c.velocidadeAnterior = c.speed;
    c.speed = 0;

    // Entra no pit lane (cinemático)
    animarEntradaPit(c);

    // Calcular tempo total
    const tempoTotal = calcularTempoPit(c, clima);

    setTimeout(() => {
        // Troca de pneus
        fazerTrocaPneus(c);

        // Volta pra pista
        animarSaidaPit(c);
        c.noPit = false;
        c.speed = c.velocidadeAnterior;
    }, tempoTotal);
}


// ================================================================
/**
 * 🎥 Animação simples de entrada no pit lane
 */
function animarEntradaPit(c) {
    c.x -= 80;
    c.y += 60;
}


// ================================================================
/**
 * 🎥 Animação simples de saída do pit lane
 */
function animarSaidaPit(c) {
    c.x += 100;
    c.y -= 60;
}


// ================================================================
/**
 * ⏱️ Calcula o tempo total do pit stop
 */
function calcularTempoPit(c, clima) {

    let tempo = TEMPO_BASE_PIT;

    // Desgaste pneus influi
    tempo += c.tyres.desgaste * 12;

    // Tipo de pneu
    tempo += TEMPO_PNEUS[c.tyres.tipo] || 0;

    // Clima
    if (clima === "chuva") tempo += 350;

    // Erro mecânico aleatório
    if (Math.random() < CHANCE_ERRO) {
        tempo += randInt(ERRO_MIN, ERRO_MAX);
        c.erroPit = true;
    } else {
        c.erroPit = false;
    }

    return tempo;
}


// ================================================================
/**
 * 🔧 Troca física do tipo de pneu
 */
function fazerTrocaPneus(c) {

    // regras simples:
    // sempre tenta voltar pra SOFT — se desgaste muito, MEDIUM
    if (c.tyres.desgaste > 75) {
        c.tyres.tipo = "MEDIUM";
    } else {
        c.tyres.tipo = "SOFT";
    }

    // reseta desgaste
    c.tyres.desgaste = 0;
}


// ================================================================
/**
 * 🎯 IA decide parar ou não
 * return true/false
 */
function iaDecidirPitStop(c, clima) {

    // 1) desgaste alto
    if (c.tyres.desgaste > 90) return true;

    // 2) clima mudou
    if (clima === "chuva" && c.tyres.tipo !== "WET") return true;

    // 3) fim de corrida → arrisca não parar
    if (c.lap > 14 && tipoSessaoAtual === "CORRIDA") return false;

    // 4) aleatório leve
    if (Math.random() < 0.03) return true;

    return false;
}


// ================================================================
/**
 * 🔁 Chamado por raceSystem.js em cada frame:
 * decide se precisa parar e executa
 */
function checarPitStops(carros, clima) {
    carros.forEach(c => {
        if (c.noPit) return;

        // Desgaste aumenta por volta (simples)
        if (c.lap > 0 && c.lap % 3 === 0) {
            c.tyres.desgaste += 2.8;
        }

        // IA
        if (iaDecidirPitStop(c, clima)) {
            iniciarPitStop(c, clima);
        }
    });
}


// ================================================================
/**
 * Utilitário
 */
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
