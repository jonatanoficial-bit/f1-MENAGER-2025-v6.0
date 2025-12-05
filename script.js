/* ===============================================================
   F1 MANAGER 2025 — SCRIPT PRINCIPAL
   Controle de telas, temporada, GP, savegame e fluxo geral
================================================================ */

/* ===============================================================
   VARIÁVEIS GLOBAIS
================================================================ */
let save = {
    gerente: null,
    equipe: null,
    gpAtual: 0,            // índice do CALENDARIO
    resultados: [],        // resultados de cada GP
    pilotosPontos: {},     // pontuação total dos pilotos
    equipesPontos: {},     // construtores
    setup: {}              // setup salvo por GP
};

const tela = (id) => document.getElementById(id);
const gridCalendario = document.getElementById("grid-calendario");
const painelProximoGP = document.getElementById("painel-pista-info");


/* ===============================================================
   INICIAR JOGO (CAPA → MENU)
================================================================ */
function irMenu() {
    tela("tela-capa").classList.add("hidden");
    tela("tela-menu").classList.remove("hidden");
    carregarSave();
}


/* ===============================================================
   NOVA CARREIRA
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

    tela("tela-menu").classList.add("hidden");
    tela("tela-gerente").classList.remove("hidden");
    renderGerentes();
}


/* ===============================================================
   CARREGAR / SALVAR SAVE
================================================================ */
function carregarSave() {
    const dados = localStorage.getItem("f1manager2025save");
    if (dados) {
        try {
            const parsed = JSON.parse(dados);
            if (parsed && typeof parsed === "object") {
                save = {
                    gerente: parsed.gerente ?? null,
                    equipe: parsed.equipe ?? null,
                    gpAtual: parsed.gpAtual ?? 0,
                    resultados: parsed.resultados ?? [],
                    pilotosPontos: parsed.pilotosPontos ?? {},
                    equipesPontos: parsed.equipesPontos ?? {},
                    setup: parsed.setup ?? {}
                };
            }
        } catch (e) {
            console.error("Erro ao carregar save:", e);
        }
    }

    const btnContinuar = document.getElementById("btn-continuar");
    if (btnContinuar) {
        btnContinuar.style.display = save.gerente ? "inline-block" : "none";
    }
}

function salvarSave() {
    localStorage.setItem("f1manager2025save", JSON.stringify(save));
}


/* ===============================================================
   CONTINUAR CARREIRA
================================================================ */
function continuarCarreira() {
    if (!save.gerente) return;
    tela("tela-menu").classList.add("hidden");
    abrirTemporada();
}


/* ===============================================================
   CRÉDITOS
================================================================ */
function mostrarCreditos() {
    alert("F1 MANAGER 2025\n\nProtótipo criado por Jonatan + IA.\nVersão demo com sistema de temporada, corrida e pódio.");
}


/* ===============================================================
   RENDERIZAÇÃO DE GERENTES
   (usa assets/managers/manager_ethnic_01..06.png)
================================================================ */
function renderGerentes() {
    const gerentes = [
        { id: 1, nome: "Gerente 1", img: "assets/managers/manager_ethnic_01.png" },
        { id: 2, nome: "Gerente 2", img: "assets/managers/manager_ethnic_02.png" },
        { id: 3, nome: "Gerente 3", img: "assets/managers/manager_ethnic_03.png" },
        { id: 4, nome: "Gerente 4", img: "assets/managers/manager_ethnic_04.png" },
        { id: 5, nome: "Gerente 5", img: "assets/managers/manager_ethnic_05.png" },
        { id: 6, nome: "Gerente 6", img: "assets/managers/manager_ethnic_06.png" }
    ];

    let html = "";
    gerentes.forEach((g) => {
        html += `
            <div class="card-gerente" onclick="selecionarGerente(${g.id})">
                <img src="${g.img}" alt="${g.nome}">
                <p>${g.nome}</p>
            </div>
        `;
    });

    const box = document.getElementById("lista-gerentes");
    if (box) box.innerHTML = html;
}

function selecionarGerente(id) {
    save.gerente = "gerente" + id;
    salvarSave();
    tela("tela-gerente").classList.add("hidden");
    tela("tela-equipe").classList.remove("hidden");
    renderEquipes();
}


/* ===============================================================
   RENDERIZAÇÃO DE EQUIPES
================================================================ */
function renderEquipes() {
    if (!EQUIPES || !Array.isArray(EQUIPES)) return;

    let html = "";
    EQUIPES.forEach((eq) => {
        html += `
            <div class="card-equipe" onclick="selecionarEquipe('${eq.id}')">
                <img src="${eq.logo}" class="logo-equipe" alt="${eq.nome}">
                <p>${eq.nome}</p>
            </div>
        `;
    });

    const box = document.getElementById("lista-equipes");
    if (box) box.innerHTML = html;
}

function selecionarEquipe(id) {
    save.equipe = id;
    salvarSave();

    tela("tela-equipe").classList.add("hidden");
    abrirTemporada();
}


/* ===============================================================
   ABRIR TELA DE TEMPORADA (GRADE NETFLIX)
================================================================ */
function abrirTemporada() {
    esconderTodasTelas();
    tela("tela-temporada").classList.remove("hidden");

    renderCalendario();
    atualizarPainelProximoGP();
}

function esconderTodasTelas() {
    document.querySelectorAll(".tela").forEach((t) =>
        t.classList.add("hidden")
    );
}


/* ===============================================================
   RENDERIZAR CALENDÁRIO COMPLETO DOS 24 GPs
================================================================ */
function renderCalendario() {
    if (!CALENDARIO || !Array.isArray(CALENDARIO)) return;
    if (!gridCalendario) return;

    let html = "";

    CALENDARIO.forEach((gp, index) => {
        let statusClasse = "";
        let statusLabel = "";

        if (index < save.gpAtual) {
            statusClasse = "gp-concluido";
            statusLabel = "Concluído";
        } else if (index === save.gpAtual) {
            statusClasse = "gp-atual";
            statusLabel = "GP Atual";
        } else {
            statusClasse = "gp-bloqueado";
            statusLabel = "Bloqueado";
        }

        html += `
            <div class="card-gp ${statusClasse}" onclick="clicarGP(${index})">
                <div class="gp-titulo">${gp.nome}</div>
                <div class="gp-status">${statusLabel}</div>
            </div>
        `;
    });

    gridCalendario.innerHTML = html;
}


/* ===============================================================
   CLIQUE EM UM GP NO CALENDÁRIO
================================================================ */
function clicarGP(index) {
    // Só permite selecionar o GP atual ou anteriores
    if (index > save.gpAtual) return;

    save.gpAtual = index;
    salvarSave();
    atualizarPainelProximoGP();
}


/* ===============================================================
   ATUALIZAR PAINEL “PRÓXIMO GP”
================================================================ */
function atualizarPainelProximoGP() {
    if (!CALENDARIO || CALENDARIO.length === 0) return;

    // Garante índice válido
    if (save.gpAtual < 0) save.gpAtual = 0;
    if (save.gpAtual >= CALENDARIO.length) save.gpAtual = CALENDARIO.length - 1;

    const gp = CALENDARIO[save.gpAtual];

    const titulo = document.getElementById("titulo-proximo-gp");
    if (titulo) {
        titulo.innerText = "Próximo GP: " + gp.nome;
    }

    if (painelProximoGP) {
        painelProximoGP.innerHTML = `
            <div class="painel-track-wrapper">
                <img src="assets/tracks/${gp.pista}" class="painel-track" alt="${gp.nome}">
            </div>
            <p class="painel-track-nome">${gp.nome}</p>
        `;
    }
}


/* ===============================================================
   BOTÃO: ENTRAR NO GP
================================================================ */
function entrarGP() {
    esconderTodasTelas();
    tela("tela-gp").classList.remove("hidden");

    const gp = CALENDARIO[save.gpAtual];
    const titulo = document.getElementById("nome-gp-atual");
    if (titulo && gp) {
        titulo.innerText = gp.nome;
    }
}


/* ===============================================================
   TREINO, CLASSIFICAÇÃO E CORRIDA
   (Treino/Classificação placeholders – corrida usa raceSystem.js)
================================================================ */
function inicioTreino() {
    alert("Treino Livre será implementado em detalhe (telemetria e feedback de pilotos).");
}

function inicioClassificacao() {
    alert("Classificação Q1 / Q2 / Q3 será implementada em detalhe.");
}

function inicioCorrida() {
    esconderTodasTelas();
    tela("tela-corrida").classList.remove("hidden");

    // Função definida em raceSystem.js
    if (typeof iniciarCorridaEngine === "function") {
        iniciarCorridaEngine(save.gpAtual);
    } else {
        console.error("iniciarCorridaEngine não encontrado (raceSystem.js).");
    }
}


/* ===============================================================
   SETUP DO CARRO (placeholder — setup real pode vir de outro JS)
================================================================ */
function salvarSetup() {
    // Aqui você poderia ler sliders/inputs de setup e salvar em save.setup[gp]
    // Exemplo (genérico):
    // const asaDianteira = Number(document.getElementById("setup-asa-d").value);
    // const asaTraseira = Number(document.getElementById("setup-asa-t").value);
    // save.setup[save.gpAtual] = { asaDianteira, asaTraseira, ... };

    salvarSave();
    alert("Setup salvo para o GP atual (placeholder).");
}


/* ===============================================================
   FINALIZAÇÃO DA CORRIDA → PÓDIO
   (chamado pelo botão “Finalizar Corrida”)
================================================================ */
function finalizarCorrida() {
    tela("tela-corrida").classList.add("hidden");
    tela("podium-screen").classList.remove("hidden");

    // Função que deve montar o pódio (definida em raceSystem.js)
    if (typeof gerarPodio === "function") {
        gerarPodio();
    } else {
        console.error("gerarPodio não encontrado (raceSystem.js).");
    }
}


/* ===============================================================
   FINALIZAR PÓDIO → AVANÇAR TEMPORADA
================================================================ */
function finalizarPodio() {
    // Avança para o próximo GP
    save.gpAtual++;

    // Fim da temporada → abre mercado de contratos
    if (save.gpAtual >= CALENDARIO.length) {
        abrirMercadoContratos();
        return;
    }

    salvarSave();
    tela("podium-screen").classList.add("hidden");
    abrirTemporada();
}


/* ===============================================================
   TELA DE MERCADO DE CONTRATOS (FINAL DA TEMPORADA)
================================================================ */
function abrirMercadoContratos() {
    tela("podium-screen").classList.add("hidden");
    tela("tela-contratos").classList.remove("hidden");

    const lista = document.getElementById("lista-contratos");
    if (lista) {
        lista.innerHTML = `
            <p>Sistema de contratos completo será habilitado após 24 GPs.</p>
            <p>Versão demo: ao finalizar, a temporada é reiniciada.</p>
        `;
    }
}

function finalizarMercado() {
    // Reinicia temporada
    save.gpAtual = 0;
    salvarSave();

    tela("tela-contratos").classList.add("hidden");
    abrirTemporada();
}


/* ===============================================================
   VOLTAR DE TELAS SECUNDÁRIAS (SETUP → GP)
================================================================ */
function voltarGP() {
    tela("tela-setup").classList.add("hidden");
    tela("tela-gp").classList.remove("hidden");
}


/* ===============================================================
   INICIALIZAÇÃO AO CARREGAR PÁGINA
================================================================ */
window.addEventListener("load", () => {
    carregarSave();
    // se já existir carreira, fica no menu; senão, mostra capa e espera clique
});
