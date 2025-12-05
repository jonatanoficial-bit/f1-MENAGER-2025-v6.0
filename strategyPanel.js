/* ===============================================================
   STRATEGY PANEL — ESCOLHA DE PNEUS E PARADAS
   ✔ Antes de QUALIFICAÇÃO ou CORRIDA
   ✔ Salva a estratégia no save
   ✔ Influencia IA e pitStopSystem
================================================================*/

// Tipos de pneus e suas características
const PNEUS = {
    SOFT:   { grip: 1.15, desgaste: 1.8 },
    MEDIUM: { grip: 1.05, desgaste: 1.1 },
    HARD:   { grip: 0.95, desgaste: 0.7 },
    WET:    { grip: 0.80, desgaste: 2.5 }
};

/* ===============================================================
   ABRIR PAINEL DE ESTRATÉGIA
================================================================ */
function abrirPainelEstrategia() {

    tela("tela-gp").classList.add("hidden");
    tela("tela-setup").classList.remove("hidden");

    renderFormularioEstrategia();
}


/* ===============================================================
   FORM DE ESTRATÉGIA
================================================================ */
function renderFormularioEstrategia() {

    const gp = CALENDARIO[save.gpAtual].nome;
    const estrategia = save.setupsPorGP[gp] || {};

    const tipoInicial = estrategia.pneuInicial || "SOFT";
    const paradas = estrategia.paradas || 1;

    let html = `
        <h2>Estratégia para ${gp}</h2>

        <div class="setup-row">
            <label>Pneu inicial:</label>
            <select id="sel-pneu-inicial">
                <option value="SOFT" ${tipoInicial==="SOFT"?"selected":""}>Soft (Rápido)</option>
                <option value="MEDIUM" ${tipoInicial==="MEDIUM"?"selected":""}>Medium (Equilibrado)</option>
                <option value="HARD" ${tipoInicial==="HARD"?"selected":""}>Hard (Resistente)</option>
                <option value="WET" ${tipoInicial==="WET"?"selected":""}>Wet (Chuva)</option>
            </select>
        </div>

        <div class="setup-row">
            <label>Paradas planejadas:</label>
            <input type="number" id="input-paradas" min="0" max="3" value="${paradas}">
        </div>

        <p class="setup-info">
            🏁 Isso influencia o comportamento dos pilotos e da IA.<br>
            ⛽ Se o clima virar chuva → automático para WET.
        </p>

        <button class="btn-setup-save" onclick="salvarEstrategia()">Salvar estratégia</button>
        <button class="btn-back" onclick="voltarGP()">Voltar</button>
    `;

    document.getElementById("setup-content").innerHTML = html;
}


/* ===============================================================
   SALVAR ESTRATÉGIA
================================================================ */
function salvarEstrategia() {

    const pneuInicial = document.getElementById("sel-pneu-inicial").value;
    const paradas = parseInt(document.getElementById("input-paradas").value);

    const gp = CALENDARIO[save.gpAtual].nome;

    save.setupsPorGP[gp] = {
        pneuInicial,
        paradas,
        data: Date.now()
    };

    salvarSave();

    alert("Estratégia salva para " + gp);

    voltarGP();
}


/* ===============================================================
   FORNECER DADOS PARA RACE SYSTEM
================================================================ */
function obterEstrategiaAtual() {
    const gp = CALENDARIO[save.gpAtual].nome;
    return save.setupsPorGP[gp] || {
        pneuInicial: "SOFT",
        paradas: 1
    };
}


/* ===============================================================
   APLICAR ESTRATÉGIA NOS CARROS
   → CHAMADO PELO raceSystem.js ao criar os carros
================================================================ */
function aplicarEstrategiaNosCarros(carros) {

    const estrategia = obterEstrategiaAtual();

    carros.forEach(c => {
        // Tipo de pneu inicial
        c.tyres.tipo = estrategia.pneuInicial;

        // Prepara para paradas (IA)
        c.paradasPlanejadas = estrategia.paradas;

        // grip básico
        const dataPneu = PNEUS[c.tyres.tipo];
        if (dataPneu) {
            c.speed *= dataPneu.grip;
        }
    });
}
