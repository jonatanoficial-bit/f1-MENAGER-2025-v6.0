/* ===============================================================
   F1 MANAGER 2025 — MOTOR DE CORRIDA / QUALI / TREINO
================================================================ */

/* Canvas */
const canvas = document.getElementById("raceCanvas");
const ctx = canvas.getContext("2d");

let raceLoop = null;
let speedFactor = 1; // 1x, 2x, 4x

/* Ajuste canvas */
function ajustarCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.onresize = ajustarCanvas;
ajustarCanvas();

/* Estado da sessão */
let tipoSessaoAtual = null; // TREINO, Q1, Q2, Q3, CORRIDA
let faseClassificacao = null;

/* ===============================================================
   VELOCIDADE BASE POR SESSÃO
================================================================ */
const SPEED_BASE = {
    TREINO: 1.1,
    Q1: 1.3,
    Q2: 1.4,
    Q3: 1.5,
    CORRIDA: 1.6
};


/* ===============================================================
   INICIAR SESSÃO
================================================================ */
function iniciarSessao(tipo, callbackFinal, extras = {}) {

    cancelarLoop();

    tipoSessaoAtual = tipo;
    faseClassificacao = tipo; // "Q1", "Q2", "Q3"

    let clima = gerarClima();

    // Cria grid inicial para a sessão
    let carros = criarCarrosDoGrid(extras.grid);

    // Aplica estratégia definida no painel
    aplicarEstrategiaNosCarros(carros);

    // HUD inicial
    atualizarHUD(carros);

    let laps = 0;
    let maxLaps = tipo === "CORRIDA" ? 50 : 15;
    let tempoSessao = 0;
    let tempoMaximo = 10 * 60 * 1000; // 10 minutos

    /* ===========================================================
       LOOP PRINCIPAL
    =========================================================== */
    function step(timestamp) {

        tempoSessao += (16 * speedFactor);

        if (tempoSessao >= tempoMaximo) {
            finalizar();
            return;
        }

        // Atualiza física
        atualizarCarros(carros, clima);

        // Checa pit stops
        checarPitStops(carros, clima);

        // Atualiza HUD
        atualizarHUD(carros);

        // Render
        desenharPista(clima);
        desenharCarros(carros);

        // Contagem de voltas
        if (carros[0] && carros[0].lap > laps) {
            laps = carros[0].lap;
        }

        // Limite de voltas jogáveis
        if (laps >= (tipo === "CORRIDA" ? 20 : 8)) {
            finalizar();
            return;
        }

        raceLoop = requestAnimationFrame(step);
    }

    /* ===========================================================
       FINALIZAÇÃO
    =========================================================== */
    function finalizar() {
        cancelarLoop();
        carros.sort((a,b) => a.totalTime - b.totalTime);

        // CLASSIFICAÇÃO
        if (tipo.startsWith("Q")) {
            const result = processarClassificacao(faseClassificacao, carros);
            callbackFinal(result);
            return;
        }

        // CORRIDA
        if (tipo === "CORRIDA") {
            callbackFinal({
                tipo: "CORRIDA",
                resultadosCorrida: carros
            });
            return;
        }

        // TREINO
        callbackFinal({ tipo: "TREINO" });
    }

    step();
}


/* ===============================================================
   CANCELAR LOOP
================================================================ */
function cancelarLoop() {
    if (raceLoop) cancelAnimationFrame(raceLoop);
    raceLoop = null;
}


/* ===============================================================
   GRID / CARROS
================================================================ */
function criarCarrosDoGrid(grid) {

    let base = grid || [...PILOTOS].sort((a,b)=>b.rating - a.rating);

    return base.map((p, i) => {
        return {
            nome: p.nome,
            equipe: p.equipe,
            equipeNome: p.equipeNome,
            logoEquipe: p.logoEquipe,
            avatar: p.avatar,
            pais: p.pais,
            rating: p.rating,
            pos: i,
            x: 200 + i * 15,
            y: 200 + i * 8,
            speed: SPEED_BASE[tipoSessaoAtual],
            lap: 0,
            lapTime: 0,
            totalTime: 0,
            tyres: {
                tipo: "SOFT",
                desgaste: 0
            },
            setup: obterSetupAtualDoGP(), // pega do save/setup
            noPit: false,
            erroPit: false
        };
    });
}


/* ===============================================================
   ATUALIZAR CARROS (FÍSICA)
================================================================ */
function atualizarCarros(carros, clima) {

    carros.forEach(c => {

        let v = c.speed;

        // Setup influencia
        if (c.setup) {
            // asa traseira = curva
            v -= c.setup.asaTras * 0.08;

            // asa dianteira = grip
            v += c.setup.asaFrente * 0.05;

            // motor = reta
            v += c.setup.motor * 0.15;

            // suspensão = desgaste
            c.tyres.desgaste += c.setup.suspensao * 0.01;

            // diferencial = estabilidade
            v += c.setup.diferencial * 0.04;

            // altura = penalty
            if (c.setup.altura < 3) v -= 0.05;
        }

        // Clima
        if (clima === "chuva") {
            v *= 0.82;
            c.tyres.desgaste *= 1.3;
        }

        // Rating do piloto
        v += (c.rating - 80) * 0.01;

        // Velocidade geral
        v *= speedFactor;

        // Movimento
        c.x += v;
        c.y += v * 0.55;

        // Volta na pista
        if (c.x > canvas.width - 200) {
            c.x = 200;
            c.lap++;
        }

        // Tempo
        c.lapTime += 16 * speedFactor;
        c.totalTime += 16 * speedFactor;
    });

    // Ordenação
    carros.sort((a,b)=>a.totalTime - b.totalTime);
    carros.forEach((c, idx)=>c.pos = idx);
}


/* ===============================================================
   DESENHO DE PISTA
================================================================ */
function desenharPista(clima) {

    ctx.fillStyle = (clima === "chuva") ? "#111" : "#222";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    if (clima === "chuva") {
        ctx.fillStyle = "rgba(255,255,255,0.05)";
        for (let i = 0; i < 80; i++) {
            const x = Math.random()*canvas.width;
            const y = Math.random()*canvas.height;
            ctx.fillRect(x,y,2,18);
        }
    }
}


/* ===============================================================
   DESENHAR CARROS
================================================================ */
function desenharCarros(carros) {

    carros.forEach(c => {

        const img = new Image();
        img.src = `assets/cars/${c.equipe}.png`;

        const angle = Math.sin(c.x * 0.01) * 0.35;

        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(angle);

        const scale = (c.pos === 0) ? 1.12 : (c.pos < 5 ? 1.05 : 1.0);

        ctx.drawImage(img, -img.width*scale/2, -img.height*scale/2, img.width*scale, img.height*scale);

        ctx.restore();
    });
}


/* ===============================================================
   CLIMA
================================================================ */
function gerarClima() {
    const r = Math.random();
    if (r < 0.12) return "chuva";
    if (r < 0.35) return "nublado";
    return "seco";
}


/* ===============================================================
   HUD
================================================================ */
function atualizarHUD(carros) {

    // Ordenar visualmente
    const box = document.getElementById("hud-posicoes");
    box.innerHTML = "";

    carros.forEach(c => {
        box.innerHTML += `
        <div class="hud-pos-item ${c.pos===0?"highlight":""}">
            <span>${c.pos+1}.</span>
            <span>${c.nome}</span>
        </div>`;
    });

    // Info piloto líder
    const lider = carros[0];
    const info = document.getElementById("hud-info-piloto");
    info.innerHTML = `
        <img src="assets/flags/${lider.pais}.png">
        <span>${lider.nome}</span>
    `;

    // RPM BAR
    const rpm = document.querySelector(".hud-rpm-bar");
    if (rpm) {
        let pct = (Math.sin(Date.now()*0.004)+1) / 2;
        rpm.style.width = `${pct*100}%`;
        rpm.classList.toggle("rpm-flash", pct > 0.92);
    }

    // Gear
    const gear = document.querySelector(".hud-gear");
    if (gear) gear.innerText = Math.floor((Math.sin(Date.now()*0.002)+1)*3)+3;
}


/* ===============================================================
   CLASSIFICAÇÃO
================================================================ */
function processarClassificacao(fase, carros) {

    // Q3 define grid final
    if (fase === "Q3") {
        gridCorrida = carros;
        return {
            tipo: "CLASSIFICACAO",
            fase: "Q3",
            gridFinal: carros
        };
    }

    // Q1/Q2 eliminam 5
    let eliminados = carros.slice(-5);
    let classificados = carros.slice(0, carros.length - 5);

    gridCorrida = classificados;

    return {
        tipo: "CLASSIFICACAO",
        fase,
        eliminados,
        gridFinal: classificados
    };
}


/* ===============================================================
   VELOCIDADE BOTÕES
================================================================ */
function setSpeed(mult) {
    speedFactor = mult;
    document.querySelectorAll("#hud-velocidade button").forEach(btn => btn.classList.remove("ativo"));
    const map = {1:1,2:2,4:3};
    document.querySelector(`#hud-velocidade button:nth-child(${map[mult]})`).classList.add("ativo");
}
