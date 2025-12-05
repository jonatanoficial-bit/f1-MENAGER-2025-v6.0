/* ===============================================================
   F1 MANAGER 2025 — SCRIPT PRINCIPAL
   Controle de telas, temporada, sessões, save, classificações,
   setup, estratégia, contratos.
================================================================ */

/* ===============================================================
   GLOBAL SAVE STATE
================================================================ */
let save = {
    gerente: null,
    equipe: null,
    gpAtual: 0,
    resultados: [],
    pilotosPontos: {},
    equipesPontos: {},
    setupsPorGP: {},
    funcionarios: {
        pilotos: [],
        mecanicos: [],
        engenheiros: [],
        marketing: []
    },
    contratos: [],
    dinheiro: 0,
    scoreManager: 0,
    sprintResults: {}
};


/* ===============================================================
   TOOLS
================================================================ */
const tela = id => document.getElementById(id);


/* ===============================================================
   MENU PRINCIPAL
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
        setupsPorGP: {},
        funcionarios: {
            pilotos: [],
            mecanicos: [],
            engenheiros: [],
            marketing: []
        },
        contratos: [],
        dinheiro: 0,
        scoreManager: 0,
        sprintResults: {}
    };

    salvarSave();

    tela("tela-menu").classList.add("hidden");
    tela("tela-gerente").classList.remove("hidden");

    renderGerentes();
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
   SAVE & LOAD
================================================================ */
function salvarSave() {
    localStorage.setItem("f1manager2025save", JSON.stringify(save));
}

function carregarSave() {
    const dados = localStorage.getItem("f1manager2025save");
    if (!dados) return;

    try {
        const obj = JSON.parse(dados);
        save = Object.assign({}, save, obj);
        document.getElementById("btn-continuar").style.display = "inline-block";
    } catch (e) {
        console.error("Erro ao carregar save:", e);
    }
}


/* ===============================================================
   GERENTES
================================================================ */
function renderGerentes() {
    let html = "";
    for (let i = 1; i <= 6; i++) {
        html += `
        <div class="card-gerente" onclick="selecionarGerente(${i})">
            <img src="assets/managers/m${i}.png">
            <p>Gerente ${i}</p>
        </div>`;
    }
    tela("lista-gerentes").innerHTML = html;
}

function selecionarGerente(id) {
    save.gerente = "Gerente " + id;
    save.scoreManager = 0;

    salvarSave();

    tela("tela-gerente").classList.add("hidden");
    tela("tela-equipe").classList.remove("hidden");

    renderEquipes();
}


/* ===============================================================
   EQUIPES
================================================================ */
function renderEquipes() {
    let html = "";
    EQUIPES.forEach(eq => {
        html += `
        <div class="card-equipe" onclick="selecionarEquipe('${eq.id}')">
            <img src="${eq.logo}" class="logo-equipe">
            <p>${eq.nome}</p>
        </div>`;
    });
    tela("lista-equipes").innerHTML = html;
}

function selecionarEquipe(id) {
    save.equipe = id;

    // contrato inicial
    save.contratos.push({
        equipe: id,
        salarioMensal: 100000,
        inicio: Date.now(),
        ativo: true
    });

    salvarSave();

    tela("tela-equipe").classList.add("hidden");
    abrirTemporada();
}


/* ===============================================================
   TEMPORADA
================================================================ */
function abrirTemporada() {

    tela("tela-temporada").classList.remove("hidden");

    tela("tela-gp").classList.add("hidden");
    tela("tela-setup").classList.add("hidden");
    tela("tela-corrida").classList.add("hidden");
    tela("podium-screen").classList.add("hidden");
    tela("tela-eliminados").classList.add("hidden");
    tela("tela-contratos").classList.add("hidden");

    renderCalendario();
    atualizarPainelProximoGP();
}


/* ===============================================================
   CALENDÁRIO DOS GPs
================================================================ */
function renderCalendario() {
    let html = "";

    CALENDARIO.forEach((gp, idx) => {

        const status =
            idx < save.gpAtual ? "concluido" :
            idx === save.gpAtual ? "atual" : "futuro";

        const icon =
            status === "concluido" ? "✓" :
            status === "atual" ? "▶" : "🔒";

        html += `
        <div class="card-gp ${status}" onclick="clicarGP(${idx})">
            <div class="gp-flag">${gp.nome.split(" ")[0]}</div>
            <div class="gp-nome">${gp.nome}</div>
            <img src="assets/tracks/${gp.pista}" class="gp-mini-track">
            <div class="gp-status">${icon}</div>
        </div>`;
    });

    tela("grid-calendario").innerHTML = html;
}

function clicarGP(index) {
    if (index > save.gpAtual) return;
    save.gpAtual = index;
    salvarSave();
    atualizarPainelProximoGP();
}


/* ===============================================================
   PAINEL - PRÓXIMO GP
================================================================ */
function atualizarPainelProximoGP() {
    const gp = CALENDARIO[save.gpAtual];

    document.getElementById("titulo-proximo-gp").innerText = "Próximo GP: " + gp.nome;

    tela("painel-pista-info").innerHTML = `
        <img src="assets/tracks/${gp.pista}" class="painel-track">
    `;
}


/* ===============================================================
   ENTRAR NO GP
================================================================ */
function entrarGP() {
    tela("tela-temporada").classList.add("hidden");
    tela("tela-gp").classList.remove("hidden");

    document.getElementById("nome-gp-atual").innerText = CALENDARIO[save.gpAtual].nome;
}


/* ===============================================================
   VOLTAR
================================================================ */
function voltarTemporada() {
    tela("tela-gp").classList.add("hidden");
    abrirTemporada();
}

function voltarGP() {
    tela("tela-setup").classList.add("hidden");
    tela("tela-gp").classList.remove("hidden");
}


/* ===============================================================
   ESTRATÉGIA
================================================================ */
function abrirPainelEstrategia() {
    tela("tela-gp").classList.add("hidden");
    tela("tela-setup").classList.remove("hidden");
    renderFormularioEstrategia();
}


/* ===============================================================
   TREINO / CLASSIFICAÇÃO / CORRIDA
================================================================ */
function inicioTreino() {
    tela("tela-gp").classList.add("hidden");
    tela("tela-corrida").classList.remove("hidden");

    iniciarSessao("TREINO", onSessaoFinalizada);
}

function inicioClassificacao() {
    tela("tela-gp").classList.add("hidden");
    tela("tela-corrida").classList.remove("hidden");

    iniciarSessao("Q1", onSessaoFinalizada);
}

function inicioCorrida() {
    tela("tela-gp").classList.add("hidden");
    tela("tela-corrida").classList.remove("hidden");

    iniciarSessao("CORRIDA", onSessaoFinalizada);
}


/* ===============================================================
   RESULTADOS
================================================================ */
let eliminadosQ1 = [];
let eliminadosQ2 = [];
let gridCorrida = [];


/* ===============================================================
   CALLBACK DE SESSÃO
================================================================ */
function onSessaoFinalizada(result) {

    // TREINO
    if (result.tipo === "TREINO") {
        tela("tela-corrida").classList.add("hidden");
        tela("tela-gp").classList.remove("hidden");
        alert("Feedback dos pilotos: ajuste o setup conforme recomendado!");
        return;
    }

    // CLASSIFICAÇÃO
    if (["Q1","Q2","Q3"].includes(result.fase)) {
        tratarClassificacao(result);
        return;
    }

    // CORRIDA
    if (result.tipo === "CORRIDA") {
        tratarCorrida(result);
        return;
    }
}


/* ===============================================================
   CLASSIFICAÇÃO
================================================================ */
function tratarClassificacao(result) {

    // Armazena eliminados
    if (result.fase === "Q1") {
        eliminadosQ1 = result.eliminados;
        mostrarEliminados("Eliminados no Q1", eliminadosQ1);
        return;
    }

    if (result.fase === "Q2") {
        eliminadosQ2 = result.eliminados;
        mostrarEliminados("Eliminados no Q2", eliminadosQ2);
        return;
    }

    // Q3 final
    if (result.fase === "Q3") {
        gridCorrida = result.gridFinal;
        tela("tela-corrida").classList.add("hidden");
        tela("tela-gp").classList.remove("hidden");
        alert("Pole Position: " + gridCorrida[0].nome);
    }
}


/* ===============================================================
   TELA ELIMINADOS
================================================================ */
function mostrarEliminados(titulo, lista) {
    tela("tela-corrida").classList.add("hidden");
    tela("tela-eliminados").classList.remove("hidden");

    document.getElementById("titulo-eliminados").innerText = titulo;

    const box = document.getElementById("grid-eliminados");
    box.innerHTML = "";

    lista.forEach(p => {
        box.innerHTML += `
        <div class="podio-card eliminado">
            <img src="${p.avatar}">
            <div>${p.nome}</div>
            <img src="assets/flags/${p.pais}.png" class="podio-bandeira">
            <img src="${p.logoEquipe}" class="podio-logo">
        </div>`;
    });
}


/* ===============================================================
   PROXIMA FASE CLASSIFICAÇÃO
================================================================ */
function continuarClassificacao() {

    tela("tela-eliminados").classList.add("hidden");
    tela("tela-corrida").classList.remove("hidden");

    if (faseClassificacao === "Q1") {
        iniciarSessao("Q2", onSessaoFinalizada);
    } else if (faseClassificacao === "Q2") {
        iniciarSessao("Q3", onSessaoFinalizada);
    }
}


/* ===============================================================
   CORRIDA PÓDIO
================================================================ */
const PONTOS_FIA = [25,18,15,12,10,8,6,4,2,1];

function tratarCorrida(result) {

    const lista = result.resultadosCorrida || gridCorrida;

    // Pontos
    lista.forEach((p, idx) => {
        const pts = PONTOS_FIA[idx] || 0;

        // Pilotos
        if (!save.pilotosPontos[p.nome]) save.pilotosPontos[p.nome] = 0;
        save.pilotosPontos[p.nome] += pts;

        // Equipes
        if (!save.equipesPontos[p.equipe]) save.equipesPontos[p.equipe] = 0;
        save.equipesPontos[p.equipe] += pts;
    })

    salvarSave();

    // Mostrar pódio
    tela("tela-corrida").classList.add("hidden");
    tela("podium-screen").classList.remove("hidden");

    const top3 = lista.slice(0,3);

    const box = document.getElementById("podio-container");
    box.innerHTML = "";

    top3.forEach(p => {
        box.innerHTML += `
        <div class="podio-card">
            <img src="${p.avatar}">
            <div>${p.nome}</div>
            <img src="assets/flags/${p.pais}.png" class="podio-bandeira">
            <img src="${p.logoEquipe}" class="podio-logo">
        </div>`;
    });
}


/* ===============================================================
   FINAL PÓDIO
================================================================ */
function finalizarPodio() {
    save.gpAtual++;

    if (save.gpAtual >= CALENDARIO.length) {
        abrirMercadoContratos();
        return;
    }

    salvarSave();
    abrirTemporada();
}


/* ===============================================================
   CONTRATOS (FINAL TEMPORADA)
================================================================ */
function abrirMercadoContratos() {
    tela("podium-screen").classList.add("hidden");
    tela("tela-contratos").classList.remove("hidden");

    document.getElementById("lista-contratos").innerHTML = `
        <p>Mercado de contratos será liberado ao fim da 1ª temporada.</p>
    `;
}

function finalizarMercado() {
    save.gpAtual = 0;
    salvarSave();
    tela("tela-contratos").classList.add("hidden");
    abrirTemporada();
}


/* ===============================================================
   CLASSIFICAÇÃO PILOTOS / EQUIPES
================================================================ */
function abrirClassificacao() {

    let msg = "CLASSIFICAÇÃO DE PILOTOS:\n\n";

    const p = Object.entries(save.pilotosPontos)
        .sort((a,b)=>b[1] - a[1]);

    p.forEach(([nome,pts], idx)=>{
        msg += `${idx+1}. ${nome} — ${pts} pts\n`;
    });

    msg += "\nCLASSIFICAÇÃO DE EQUIPES:\n\n";

    const e = Object.entries(save.equipesPontos)
        .sort((a,b)=>b[1] - a[1]);

    e.forEach(([id,pts], idx)=>{
        const eq = EQUIPES.find(x=>x.id===id);
        msg += `${idx+1}. ${eq ? eq.nome : id} — ${pts} pts\n`;
    });

    alert(msg);
}


/* ===============================================================
   FINALIZAR SESSÃO
================================================================ */
function finalizarSessao() {
    tela("tela-corrida").classList.add("hidden");
    tela("tela-gp").classList.remove("hidden");
}


/* ===============================================================
   CRÉDITOS
================================================================ */
function mostrarCreditos() {
    alert("F1 Manager 2025\nCriado por Jonatan Vale + IA");
}
/* ===============================================================
   FUNCIONÁRIOS — PILOTOS / MECÂNICOS / ENGENHEIROS / MARKETING
================================================================ */

function mostrarFuncionarios() {

    tela("tela-temporada").classList.add("hidden");
    tela("tela-funcionarios").classList.remove("hidden");

    selecionarFuncTab('pilotos');
}


/* Tabs */
let tabAtual = "pilotos";

function selecionarFuncTab(tab) {
    tabAtual = tab;

    document.querySelectorAll(".func-tabs .tab").forEach(btn => btn.classList.remove("active"));
    document.querySelector(`.func-tabs .tab[onclick="selecionarFuncTab('${tab}')"]`).classList.add("active");

    renderFuncionarios();
}


function renderFuncionarios() {

    const box = document.getElementById("func-content");
    box.innerHTML = "";

    const lista = FUNCIONARIOS_DATA[tabAtual];
    const contratados = save.funcionarios[tabAtual];

    lista.forEach(item => {

        const contratado = contratados.includes(item.id);
        const textoBotao = contratado ? "Demitir" : "Contratar";
        const classeBotao = contratado ? "btn-dem" : "btn-add";

        box.innerHTML += `
        <div class="func-card">
            <img src="${item.foto}">
            <h4>${item.nome}</h4>
            <div class="score">⭐ ${item.score}</div>
            <div class="salario">$ ${item.salario}/GP</div>
            <button onclick="acaoFuncionario('${tabAtual}','${item.id}')">${textoBotao}</button>
        </div>`;
    });

    document.getElementById("dinheiro-func").innerText = "$ " + save.dinheiro.toLocaleString();
}



/* ===============================================================
   CONTRATAR / DEMITIR
================================================================ */
function acaoFuncionario(tipo, id) {

    const lista = save.funcionarios[tipo];
    const idx = lista.indexOf(id);

    if (idx >= 0) {
        // demitir
        lista.splice(idx,1);
    } else {
        // contratar
        const item = FUNCIONARIOS_DATA[tipo].find(x=>x.id===id);
        if (!item) return;

        // precisa dinheiro
        if (save.dinheiro < item.salario) {
            alert("Dinheiro insuficiente!");
            return;
        }

        save.dinheiro -= item.salario;
        lista.push(id);
    }

    salvarSave();
    renderFuncionarios();
}
