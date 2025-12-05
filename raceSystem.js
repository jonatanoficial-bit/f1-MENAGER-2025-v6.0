/* ============================================================================
   F1 MANAGER 2025 — raceSystem.js
   Motor de Corrida simplificado (protótipo)
   - Usa o <canvas id="raceCanvas">
   - Simula carros girando em um traçado elíptico
   - Atualiza HUD via elementos do DOM
============================================================================ */

let raceState = {
    running: false,
    cars: [],
    gpIndex: 0,
    lap: 1,
    totalLaps: 20,
    lastTimestamp: 0,
    speedMultiplier: 1
};

let raceCanvas = null;
let raceCtx = null;

/* Inicializa tudo para um GP */
function iniciarCorridaEngine(gpIndex) {
    raceCanvas = document.getElementById("raceCanvas");
    if (!raceCanvas) {
        console.error("raceCanvas não encontrado no DOM.");
        return;
    }
    raceCtx = raceCanvas.getContext("2d");

    // Ajusta tamanho básico (responsivo simples)
    raceCanvas.width  = raceCanvas.clientWidth  || 960;
    raceCanvas.height = raceCanvas.clientHeight || 540;

    raceState.gpIndex = gpIndex;
    raceState.lap = 1;
    raceState.totalLaps = 20;
    raceState.running = true;
    raceState.lastTimestamp = 0;
    raceState.speedMultiplier = 1;

    criarCarrosParaCorrida();
    atualizarHUDCorrida();

    window.requestAnimationFrame(loopCorrida);
}

/* Cria 20 carros com posição angular em uma elipse */
function criarCarrosParaCorrida() {
    raceState.cars = [];

    const numCars = 20;
    const centroX = raceCanvas.width / 2;
    const centroY = raceCanvas.height / 2;
    const raioX = raceCanvas.width * 0.35;
    const raioY = raceCanvas.height * 0.25;

    for (let i = 0; i < numCars; i++) {
        let piloto = null;
        if (window.PILOTOS && Array.isArray(PILOTOS) && PILOTOS[i]) {
            piloto = PILOTOS[i];
        }

        raceState.cars.push({
            nome: piloto ? piloto.nome : `Carro ${i+1}`,
            angulo: (Math.PI * 2 * i) / numCars,
            vel: 0.0035 + Math.random() * 0.0015,
            x: centroX + Math.cos((Math.PI * 2 * i) / numCars) * raioX,
            y: centroY + Math.sin((Math.PI * 2 * i) / numCars) * raioY,
            cor: piloto ? (EQUIPES.find(e => e.id === piloto.equipe)?.cor || "#ffffff") : "#ffffff",
            volta: 0,
            ordem: i + 1
        });
    }
}

/* Loop principal da corrida */
function loopCorrida(timestamp) {
    if (!raceState.running) return;

    if (!raceState.lastTimestamp) {
        raceState.lastTimestamp = timestamp;
    }

    const delta = (timestamp - raceState.lastTimestamp) * raceState.speedMultiplier;
    raceState.lastTimestamp = timestamp;

    atualizarFisica(delta);
    desenharCena();
    atualizarHUDCorrida();

    window.requestAnimationFrame(loopCorrida);
}

/* Atualiza a posição dos carros em uma elipse e conta voltas */
function atualizarFisica(delta) {
    const centroX = raceCanvas.width / 2;
    const centroY = raceCanvas.height / 2;
    const raioX = raceCanvas.width * 0.35;
    const raioY = raceCanvas.height * 0.25;

    raceState.cars.forEach(car => {
        car.angulo += car.vel * delta;

        // Quando passa de 2π, conta volta
        if (car.angulo >= Math.PI * 2) {
            car.angulo -= Math.PI * 2;
            car.volta++;

            // Quando o "carro 0" completa, avança volta global
            if (car === raceState.cars[0]) {
                raceState.lap++;
                if (raceState.lap > raceState.totalLaps) {
                    encerrarCorrida();
                }
            }
        }

        car.x = centroX + Math.cos(car.angulo) * raioX;
        car.y = centroY + Math.sin(car.angulo) * raioY;
    });

    // Ordena pela volta e ângulo (quem está mais à frente no traçado)
    raceState.cars.sort((a, b) => {
        if (b.volta !== a.volta) return b.volta - a.volta;
        return b.angulo - a.angulo;
    });

    raceState.cars.forEach((car, idx) => {
        car.ordem = idx + 1;
    });
}

/* Desenha a pista (elipse) e os carros como círculos coloridos */
function desenharCena() {
    if (!raceCtx) return;

    const w = raceCanvas.width;
    const h = raceCanvas.height;
    raceCtx.clearRect(0, 0, w, h);

    const centroX = w / 2;
    const centroY = h / 2;
    const raioX = w * 0.35;
    const raioY = h * 0.25;

    // fundo
    raceCtx.fillStyle = "#111";
    raceCtx.fillRect(0, 0, w, h);

    // pista
    raceCtx.save();
    raceCtx.translate(centroX, centroY);
    raceCtx.strokeStyle = "#fff";
    raceCtx.lineWidth = 6;
    raceCtx.beginPath();
    raceCtx.ellipse(0, 0, raioX, raioY, 0, Math.PI * 2);
    raceCtx.stroke();
    raceCtx.restore();

    // carros
    raceState.cars.forEach(car => {
        raceCtx.beginPath();
        raceCtx.fillStyle = car.cor;
        raceCtx.arc(car.x, car.y, 8, 0, Math.PI * 2);
        raceCtx.fill();
    });
}

/* Atualiza HUD da corrida (volta / total, posição do líder etc.) */
function atualizarHUDCorrida() {
    const hudVoltas      = document.getElementById("hud-tempos");
    const hudPosicoes    = document.getElementById("hud-posicoes");
    const hudInfoPiloto  = document.getElementById("hud-info-piloto");
    const hudPneus       = document.getElementById("hud-pneus");

    if (!raceState.cars.length) return;

    const lider = raceState.cars[0];

    if (hudVoltas) {
        hudVoltas.textContent = `Volta ${raceState.lap} / ${raceState.totalLaps}`;
    }
    if (hudPosicoes) {
        hudPosicoes.textContent = `Líder: ${lider.nome} (P${lider.ordem})`;
    }
    if (hudInfoPiloto) {
        hudInfoPiloto.textContent = `Carros em pista: ${raceState.cars.length}`;
    }
    if (hudPneus) {
        hudPneus.textContent = `Modo corrida x${raceState.speedMultiplier}`;
    }
}

/* Muda multiplicador de velocidade (poderia ser ligado a botões no futuro) */
function setRaceSpeed(mult) {
    raceState.speedMultiplier = mult;
}

/* Encerra corrida e grava pódio simples no localStorage */
function encerrarCorrida() {
    raceState.running = false;

    const resultado = raceState.cars
        .map(car => ({
            nome: car.nome,
            posicao: car.ordem
        }))
        .sort((a, b) => a.posicao - b.posicao);

    try {
        localStorage.setItem("F1_MANAGER_2025_ULTIMO_PODIO", JSON.stringify(resultado));
    } catch (e) {
        console.error("Erro ao salvar resultado da corrida:", e);
    }
}
