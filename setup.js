/* ============================================================
   SETUP DO CARRO — SLIDERS + SALVAMENTO + FEEDBACK
   ============================================================ */

/**
 * Parâmetros principais de acerto.
 * Valores de 0 a 10, onde 5 é o neutro.
 */
const PARAMETROS_SETUP = [
    { id: "asaFrente",    nome: "Asa Dianteira",      min: 0, max: 10 },
    { id: "asaTras",      nome: "Asa Traseira",       min: 0, max: 10 },
    { id: "suspensao",    nome: "Suspensão",          min: 0, max: 10 },
    { id: "altura",       nome: "Altura do Carro",    min: 0, max: 10 },
    { id: "motor",        nome: "Potência de Motor",  min: 0, max: 10 },
    { id: "diferencial",  nome: "Diferencial",        min: 0, max: 10 }
];


/* ============================================================
   FUNÇÃO: obterSetupAtualDoGP
   - Usa setup por GP (save.setupsPorGP[gpIndex])
   - Mantém compatibilidade com save.setup antigo
   ============================================================ */
function obterSetupAtualDoGP() {
    if (!window.save) return {};

    const gpIndex = save.gpAtual || 0;

    // Garante estrutura para setups por GP
    if (!save.setupsPorGP) {
        save.setupsPorGP = {};
    }

    // Se já existir setup para esse GP, usa
    if (save.setupsPorGP[gpIndex]) {
        return save.setupsPorGP[gpIndex];
    }

    // Se não existir, mas houver setup antigo global, usa como base
    if (save.setup && Object.keys(save.setup).length > 0) {
        save.setupsPorGP[gpIndex] = { ...save.setup };
        return save.setupsPorGP[gpIndex];
    }

    // Senão, cria neutro (5 em tudo)
    const base = {};
    PARAMETROS_SETUP.forEach(p => { base[p.id] = 5; });
    save.setupsPorGP[gpIndex] = base;
    return base;
}


/* ============================================================
   ABRIR TELA DE SETUP
   - Chamada pelo botão "Setup do Carro" na tela do GP
   ============================================================ */
function abrirSetup() {
    if (!window.save) return;

    const setupAtual = obterSetupAtualDoGP();
    const container  = document.getElementById("setup-container");

    // Troca de telas
    tela("tela-gp").classList.add("hidden");
    tela("tela-setup").classList.remove("hidden");

    // Render dos sliders
    container.innerHTML = "";

    PARAMETROS_SETUP.forEach(p => {
        const valor = (setupAtual[p.id] !== undefined) ? setupAtual[p.id] : 5;

        container.innerHTML += `
            <div class="setup-bloco">
                <label>${p.nome}</label>
                <input 
                    type="range" 
                    min="${p.min}" 
                    max="${p.max}" 
                    value="${valor}" 
                    class="setup-slider"
                    id="${p.id}"
                    oninput="atualizarValor('${p.id}')">

                <div class="setup-valor" id="val-${p.id}">
                    ${valor}
                </div>
            </div>
        `;
    });
}


/* ============================================================
   ATUALIZAR VALOR VISUAL DO SLIDER
   ============================================================ */
function atualizarValor(id) {
    const slider = document.getElementById(id);
    const span   = document.getElementById("val-" + id);
    if (!slider || !span) return;

    span.innerText = slider.value;
}


/* ============================================================
   SALVAR SETUP
   - Salva por GP em save.setupsPorGP[gpIndex]
   - Atualiza também save.setup (último usado) para compatibilidade
   ============================================================ */
function salvarSetup() {
    if (!window.save) return;

    const gpIndex = save.gpAtual || 0;

    if (!save.setupsPorGP) {
        save.setupsPorGP = {};
    }

    const novoSetup = {};
    PARAMETROS_SETUP.forEach(p => {
        const el = document.getElementById(p.id);
        novoSetup[p.id] = el ? parseInt(el.value) : 5;
    });

    // Salva por GP
    save.setupsPorGP[gpIndex] = novoSetup;

    // Mantém espelho global (compatível com raceSystem.js atual)
    save.setup = { ...novoSetup };

    if (typeof salvarSave === "function") {
        salvarSave();
    }

    alert("Setup salvo com sucesso!");

    // Volta para tela do GP
    voltarGP();
}


/* ============================================================
   FEEDBACK DO PILOTO (APÓS TREINO LIVRE)
   - Essa função será chamada ao final da sessão de treino
   ============================================================ */
function feedbackPiloto() {
    if (!window.save) return;

    const setupAtual = obterSetupAtualDoGP();
    let msg = "";

    // Asa traseira
    if (setupAtual.asaTras > 7) msg += "• Carro muito grudado no chão, pouca velocidade nas retas.\n";
    if (setupAtual.asaTras < 3) msg += "• Traseira solta em curvas rápidas, cuidado com escapadas.\n";

    // Asa dianteira
    if (setupAtual.asaFrente > 7) msg += "• Entrada de curva muito boa, frente bem presa.\n";
    if (setupAtual.asaFrente < 3) msg += "• Carro saindo de frente nas curvas, falta asa dianteira.\n";

    // Suspensão
    if (setupAtual.suspensao > 7) msg += "• Suspensão dura, carro quicando nas zebras.\n";
    if (setupAtual.suspensao < 3) msg += "• Suspensão mole demais, carro balançando muito.\n";

    // Altura
    if (setupAtual.altura < 3) msg += "• Altura muito baixa, risco de raspar no chão.\n";
    if (setupAtual.altura > 7) msg += "• Carro muito alto, perdendo eficiência aerodinâmica.\n";

    // Motor
    if (setupAtual.motor > 7) msg += "• Reta muito forte, ótima velocidade final.\n";
    if (setupAtual.motor < 3) msg += "• Falta potência nas retas, estamos perdendo tempo.\n";

    // Diferencial
    if (setupAtual.diferencial > 7) msg += "• Diferencial travado, carro sai bem de curva mas pode escorregar.\n";
    if (setupAtual.diferencial < 3) msg += "• Diferencial muito livre, carro mais seguro, mas sai lento das curvas.\n";

    if (msg === "") {
        msg = "Setup bem equilibrado, carro estável e competitivo!\nPodemos focar em pequenos ajustes finos.";
    }

    alert("FEEDBACK DO PILOTO (após treino livre):\n\n" + msg);
}
