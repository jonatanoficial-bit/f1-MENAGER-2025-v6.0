/* ============================================================
   SISTEMA DE CORRIDA — VISUAL REAL F1 MANAGER 2025
   - Renderização 60 FPS
   - Mapa SVG
   - Carros dinâmicos
   - Voltas simuladas
   - Pit stop
   - HUD com posição/delta/pneu/temperatura
   ============================================================ */

/* ===========================
   CONFIGURAÇÃO PADRÃO
=========================== */

let race = {
    totalLaps: 20,
    currentLap: 1,
    speed: 1,
    running: false,
    cars: [],
    fpsInterval: 1000 / 60,
    lastFrameTime: 0,
    trackName: "",
};

/* ===========================
   INICIAR CORRIDA
=========================== */

function iniciarCorridaEngine(gpIndex) {

    const gp = CALENDARIO[gpIndex];
    race.trackName = gp.pista;

    // CARREGA O SVG
    document.getElementById("trackMap").src = "assets/tracks/" + race.trackName;

    // CRIA OS CARROS
    race.cars = criarGridInicial();

    // INICIA LOOP
    race.running = true;
    race.currentLap = 1;
    atualizarHUD();

    window.requestAnimationFrame(loopCorrida);
}

/* ===========================
   GRID INICIAL (ordem real)
=========================== */
function criarGridInicial() {

    let grid = [];

    let pilotosFiltrados = PILOTOS.sort((a, b) => b.rating - a.rating);

    pilotosFiltrados.forEach((p, index) => {
        grid.push({
            nome: p.nome,
            id: p.id,
            x: 50,
            y: 50 + index * 12,
            speed: 0.7 + Math.random() * 0.4,
            laps: 0,
            delta: 0,
            tire: 100,
            temp: 75 + Math.random() * 10,
            pos: index + 1
        });
    });

    return grid;
}

/* ===========================
   LOOP DA CORRIDA 60 FPS
=========================== */
function loopCorrida(timestamp) {

    if (!race.running) return;

    if (timestamp - race.lastFrameTime < race.fpsInterval) {
        requestAnimationFrame(loopCorrida);
        return;
    }

    race.lastFrameTime = timestamp;

    atualizarCarros();
    desenharCarros();
    atualizarHUD();

    requestAnimationFrame(loopCorrida);
}

/* ===========================
   MOVIMENTO DOS CARROS
=========================== */
function atualizarCarros() {

    race.cars.forEach(car => {

        // velocidade básica
        let base = car.speed * race.speed;

        // desgaste pneu
        car.tire -= 0.03 * race.speed;
        if (car.tire < 5) car.tire = 5;

        // temperatura
        car.temp += 0.01 * race.speed;
        if (car.temp > 95) car.temp = 95;

        // delta
        car.delta = ((Math.random() - 0.5) * 0.05 * race.speed);

        // mover
        car.x += base;
        car.y += Math.sin(car.x / 40) * 0.6;

        // final da volta
        if (car.x > 900) {
            car.x = 0;
            if (car === race.cars[0]) {
                race.currentLap++;
                if (race.currentLap > race.totalLaps) {
                    terminarCorrida();
                }
            }
        }
    });

    // recalcular posições
    race.cars.sort((a, b) => b.x - a.x);
    race.cars.forEach((c, i) => c.pos = i + 1);
}

/* ===========================
   DESENHAR CARROS NO MAPA
=========================== */
function desenharCarros() {

    const layer = document.getElementById("carsLayer");
    layer.innerHTML = "";

    race.cars.forEach(car => {

        let div = document.createElement("div");
        div.className = "carIcon";
        div.style.left = car.x + "px";
        div.style.top = car.y + "px";

        div.innerHTML = `<img src="assets/cars/${car.equipe || "redbull"}.png">`;

        layer.appendChild(div);
    });
}

/* ===========================
   ATUALIZAR HUD
=========================== */
function atualizarHUD() {

    document.getElementById("lapInfo").innerText =
        race.currentLap + " / " + race.totalLaps;

    document.getElementById("posInfo").innerText =
        "P" + race.cars[0].pos;

    document.getElementById("deltaInfo").innerText =
        race.cars[0].delta.toFixed(3);

    document.getElementById("tireInfo").innerText =
        race.cars[0].tire.toFixed(0) + "%";

    document.getElementById("tempInfo").innerText =
        race.cars[0].temp.toFixed(0) + "°C";
}

/* ===========================
   CONTROLE DE VELOCIDADE
=========================== */
function setSpeed(val) {
    race.speed = val;
}

/* ===========================
   FINALIZAR CORRIDA
=========================== */
function terminarCorrida() {
    race.running = false;

    // resultado final
    const podium = race.cars.slice(0, 3);

    localStorage.setItem("ultimoPodio", JSON.stringify(podium));

    // troca de tela
    window.location.href = "podium.html";
}

/* ===========================
   BOTÃO ENCERRAR
=========================== */
function finishRace() {
    terminarCorrida();
}
