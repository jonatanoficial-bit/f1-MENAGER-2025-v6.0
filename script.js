/* ===============================================================
   F1 MANAGER 2025 — SCRIPT PRINCIPAL
   Controle de telas, temporada, GP, savegame e fluxo geral
================================================================ */

/* ===============================================================
   ESTADO GLOBAL DO JOGO
================================================================ */
let save = {
    gerente: null,
    equipe: null,
    gpAtual: 0,            // índice atual no CALENDARIO
    resultados: [],        // resultados de cada GP (podemos expandir depois)
    pilotosPontos: {},     // pontuação dos pilotos
    equipesPontos: {},     // pontuação das equipes
    setup: {}              // setup por GP
};

/* Helper rápido para pegar elementos */
function $(id) {
    return document.getElementById(id);
}

/* Mostrar/ocultar telas */
function mostrarTela(id) {
    document.querySelectorAll(".tela").forEach(t => t.classList.add("hidden"));
    const tela = $(id);
    if (tela) tela.classList.remove("hidden");
}

/* ===============================================================
   SAVE EM LOCALSTORAGE
================================================================ */
function carregarSave() {
    try {
        const dados = localStorage.getItem("F1_MANAGER_2025_SAVE");
        if (!dados) return;
        const obj = JSON.parse(dados);
        if (!obj || typeof obj !== "object") return;

        save.gerente       = obj.gerente       ?? null;
        save.equipe        = obj.equipe        ?? null;
        save.gpAtual       = obj.gpAtual       ?? 0;
        save.resultados    = obj.resultados    ?? [];
        save.pilotosPontos = obj.pilotosPontos ?? {};
        save.equipesPontos = obj.equipesPontos ?? {};
        save.setup         = obj.setup         ?? {};
    } catch (e) {
        console.error("Erro ao carregar save:", e);
    }
}

function salvarSave() {
    try {
        localStorage.setItem("F1_MANAGER_2025_SAVE", JSON.stringify(save));
    } catch (e) {
        console.error("Erro ao salvar save:", e);
    }
}

/* Atualiza visibilidade do botão CONTINUAR */
function atualizarBotaoContinuar() {
    const btn = $("btn-continuar");
    if (!btn) return;
    btn.style.display = save.equipe ? "inline-block" : "none";
}

/* ===============================================================
   FLUXO INICIAL
================================================================ */
function irMenu() {
    // Chamado ao clicar na capa
    carregarSave();
    atualizarBotaoContinuar();
    mostrarTela("tela-menu");
}

/* ===============================================================
   MENU PRINCIPAL
================================================================ */
function novaCarreira() {
    save = {
        gerente: null,
        equipe: null,
        gpAtual: 0,
        resultados: [],
        pilotosPontos: {},
        equipesPontos: {},
        setup: {}
    };
    salvarSave();
    mostrarTela("tela-gerente");
    renderGerentes();
}

function continuarCarreira() {
    carregarSave();
    if (!save.equipe) {
        alert("Nenhuma carreira salva encontrada. Crie uma nova carreira.");
        return;
    }
    abrirTemporada();
}

function mostrarCreditos() {
    alert("F1 Manager 2025\nProtótipo de simulação desenvolvido por Jonatan + IA.");
}

/* ===============================================================
   GERENTES
================================================================ */
function renderGerentes() {
    const container = $("lista-gerentes");
    if (!container) return;

    const gerentes = [
        { id: 1, nome: "Gerente 1", img: "assets/managers/manager_ethnic_01.png" },
        { id: 2, nome: "Gerente 2", img: "assets/managers/manager_ethnic_02.png" },
        { id: 3, nome: "Gerente 3", img: "assets/managers/manager_ethnic_03.png" },
        { id: 4, nome: "Gerente 4", img: "assets/managers/manager_ethnic_04.png" },
        { id: 5, nome: "Gerente 5", img: "assets/managers/manager_ethnic_05.png" },
        { id: 6, nome: "Gerente 6", img: "assets/managers/manager_ethnic_06.png" }
    ];

    let html = "";
    gerentes.forEach(g => {
        html += `
            <div class="card-gerente" onclick="selecionarGerente(${g.id})">
                <img src="${g.img}" alt="${g.nome}">
                <span>${g.nome}</span>
            </div>
        `;
    });
    container.innerHTML = html;
}

function selecionarGerente(id) {
    save.gerente = "gerente_" + id;
    salvarSave();
    mostrarTela("tela-equipe");
    renderEquipes();
}

/* ===============================================================
   EQUIPES
================================================================ */
function renderEquipes() {
    const container = $("lista-equipes");
    if (!container) return;
    if (!window.EQUIPES || !Array.isArray(EQUIPES)) {
        console.error("EQUIPES não encontrado em data.js");
        return;
    }

    let html = "";
    EQUIPES.forEach(eq => {
        html += `
            <div class="card-equipe" onclick="selecionarEquipe('${eq.id}')">
                <img src="${eq.logo}" alt="${eq.nome}">
                <span>${eq.nome}</span>
            </div>
        `;
    });
    container.innerHTML = html;
}

function selecionarEquipe(idEquipe) {
    save.equipe = idEquipe;
    salvarSave();
    abrirTemporada();
}

/* ===============================================================
   TELA DE TEMPORADA
================================================================ */
function abrirTemporada() {
    mostrarTela("tela-temporada");
    atualizarBotaoContinuar();
    renderCalendario();
    atualizarPainelProximoGP();
}

/* Renderiza todos os 24 GPs */
function renderCalendario() {
    const container = $("grid-calendario");
    if (!container) return;
    if (!window.CALENDARIO || !Array.isArray(CALENDARIO)) {
        console.error("CALENDARIO não encontrado em data.js");
        return;
    }

    let html = "";
    CALENDARIO.forEach((gp, index) => {
        let classe = "gp-futuro";
        let status = "Futuro";

        if (index < save.gpAtual) {
            classe = "gp-concluido";
            status = "Concluído";
        } else if (index === save.gpAtual) {
            classe = "gp-atual";
            status = "GP Atual";
        }

        html += `
            <div class="card-gp ${classe}" onclick="selecionarGP(${index})">
                <div class="gp-nome">${gp.nome}</div>
                <div class="gp-status">${status}</div>
            </div>
        `;
    });

    container.innerHTML = html;
}

/* Ao clicar em um GP no calendário */
function selecionarGP(indice) {
    if (indice > save.gpAtual) {
        // Bloqueia GPs futuros: só pode clicar até o GP atual
        return;
    }
    save.gpAtual = indice;
    salvarSave();
    atualizarPainelProximoGP();
}

/* Atualiza painel do próximo GP (nome + imagem da pista) */
function atualizarPainelProximoGP() {
    if (!window.CALENDARIO || !CALENDARIO[save.gpAtual]) return;
    const gp = CALENDARIO[save.gpAtual];

    const titulo = $("titulo-proximo-gp");
    if (titulo) {
        titulo.textContent = "Próximo GP: " + gp.nome;
    }

    const painel = $("painel-pista-info");
    if (painel) {
        painel.innerHTML = `
            <img src="assets/tracks/${gp.pista}" class="img-pista" alt="${gp.nome}">
        `;
    }

    renderCalendario();
}

/* Entra na tela GP (Treino / Classificação / Corrida) */
function entrarGP() {
    if (!window.CALENDARIO || !CALENDARIO[save.gpAtual]) return;
    const gp = CALENDARIO[save.gpAtual];

    mostrarTela("tela-gp");

    const titulo = $("nome-gp-atual");
    if (titulo) {
        titulo.textContent = gp.nome;
    }
}

/* ===============================================================
   TREINO / CLASSIFICAÇÃO / CORRIDA
================================================================ */
function inicioTreino() {
    alert("Treino Livre: em versões futuras, aqui entram telemetria e feedback dos pilotos.");
}

function inicioClassificacao() {
    alert("Classificação Q1 / Q2 / Q3 será detalhada em versão posterior.\nPor enquanto, vá direto para a Corrida.");
}

function inicioCorrida() {
    mostrarTela("tela-corrida");

    // Chama o motor de corrida no raceSystem.js
    if (typeof iniciarCorridaEngine === "function") {
        iniciarCorridaEngine(save.gpAtual);
    } else {
        console.warn("iniciarCorridaEngine não encontrado. Mostrando placeholder.");
        const canvas = $("raceCanvas");
        if (canvas) {
            const ctx = canvas.getContext("2d");
            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#fff";
            ctx.font = "20px Arial";
            ctx.fillText("Motor de corrida não carregado.", 40, 60);
        }
    }
}

/* Chamado pelo botão 'Finalizar Corrida' na tela de corrida */
function finalizarCorrida() {
    const podioTela = $("podium-screen");
    if (!podioTela) {
        abrirTemporada();
        return;
    }

    // tenta ler um resultado salvo pelo raceSystem
    let resultado = null;
    try {
        const raw = localStorage.getItem("F1_MANAGER_2025_ULTIMO_PODIO");
        if (raw) resultado = JSON.parse(raw);
    } catch (e) {
        console.error("Erro ao ler pódio:", e);
    }

    const container = $("podio-container");
    if (container) {
        if (!resultado || !Array.isArray(resultado) || resultado.length === 0) {
            container.innerHTML = "<p>Nenhum resultado de corrida encontrado.</p>";
        } else {
            let html = '<div class="podium-grid">';
            resultado.slice(0, 3).forEach((piloto, idx) => {
                const pos = idx + 1;
                html += `
                    <div class="podium-slot podium-pos-${pos}">
                        <div class="podium-pos-label">${pos}º</div>
                        <div class="podium-pilot-name">${piloto.nome}</div>
                    </div>
                `;
            });
            html += "</div>";
            container.innerHTML = html;
        }
    }

    mostrarTela("podium-screen");
}

/* Botão "Voltar" do setup */
function voltarGP() {
    mostrarTela("tela-gp");
}

/* ===============================================================
   TELA DE CONTRATOS (placeholder)
================================================================ */
function abrirContratos() {
    mostrarTela("tela-contratos");
    const lista = $("lista-contratos");
    if (lista) {
        lista.innerHTML = "<p>Sistema de contratos será detalhado em uma próxima etapa.</p>";
    }
}

/* ===============================================================
   INICIALIZAÇÃO
================================================================ */
window.addEventListener("load", () => {
    carregarSave();
    atualizarBotaoContinuar();
    // Ao carregar, a tela inicial é a capa; o clique na capa chama irMenu()
});
