// F1 Manager 2025 – Versão 6.0
//
// Script principal. Carrega dados, prepara a UI e inicia a corrida
// rápida. O modo carreira será adicionado posteriormente.

import { PILOTOS } from './data/pilotos.js';
import { ESCUDERIAS } from './data/equipes.js';
import { CALENDARIO } from './data/pistas.js';
import { criarPista, RaceEngine } from './core/raceEngine.js';

// Elementos DOM
const splash = document.getElementById('splash');
const raceView = document.getElementById('raceView');
const btnQuickRace = document.getElementById('btnQuickRace');
const standingsBody = document.getElementById('standingsBody');
const carsLayer = document.getElementById('carsLayer');
const trackImage = document.getElementById('trackImage');
const weatherInfo = document.getElementById('weatherInfo');
const eventLog = document.getElementById('eventLog');
const hudTyre = document.getElementById('hudTyre');
const hudWear = document.getElementById('hudWear');
const hudTemp = document.getElementById('hudTemp');
const hudErs = document.getElementById('hudErs');
const hudDelta = document.getElementById('hudDelta');
const btnBox = document.getElementById('btnBox');

let currentRaceEngine = null;
let playerDriver = null;

btnQuickRace.addEventListener('click', () => {
  splash.classList.add('hidden');
  raceView.classList.remove('hidden');
  iniciarCorridaRapida();
});

// Função utilitária: gera uma path circular normalizada (raio ~0.45)
function generateCircularPath(totalPoints = 100) {
  const path = [];
  const centerX = 0.5;
  const centerY = 0.5;
  const radius = 0.42;
  for (let i = 0; i < totalPoints; i++) {
    const angle = (i / totalPoints) * 2 * Math.PI;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    path.push([x, y]);
  }
  return path;
}
// Gera um pit-lane circular menor
function generateInnerPath(totalPoints = 30) {
  const path = [];
  const centerX = 0.5;
  const centerY = 0.5;
  const radius = 0.30;
  for (let i = 0; i < totalPoints; i++) {
    const angle = (i / totalPoints) * 2 * Math.PI;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    path.push([x, y]);
  }
  return path;
}

function iniciarCorridaRapida() {
  // Seleciona a primeira pista do calendário
  const gp = CALENDARIO[0];
  // Cria uma pista genérica com 30 voltas e caminhos circulares
  const pista = criarPista({
    nome: gp.local || gp.name,
    voltas: gp.voltas || 30,
    path: generateCircularPath(120),
    pitPath: generateInnerPath(40),
    sectorTypes: ['straight','medium','slow','fast'],
    sectorTimes: { straight: 24, medium: 28, slow: 32, fast: 26 },
  });
  // Define imagem de fundo da pista, se existir no assets/tracks
  // Tenta carregar a imagem png com base na localização
  const key = gp.local?.toLowerCase().replace(/\s+/g, '_') || 'monaco';
  let imgSrc = `assets/tracks/${key}.png`;
  // verifica se arquivo existe? deixamos a url e, se não carregar, apenas ignora
  trackImage.src = imgSrc;
  // Seleciona 10 pilotos: primeiro será o jogador
  const selectedDrivers = PILOTOS.slice(0, 10).map((p, idx) => {
    return {
      id: idx,
      nome: p.nome,
      equipe: ESCUDERIAS[p.equipe],
      rating: p.nivel,
      agressividade: p.agressividade,
      chuva: p.chuva,
    };
  });
  playerDriver = selectedDrivers[0];
  // Cria RaceEngine
  currentRaceEngine = new RaceEngine(pista, selectedDrivers, {
    updateDriverPositions: updateUIPositions,
    updateWeather: updateWeatherInfo,
    showEvents: showEvents,
    pitMessage: showPitMessage,
  });
  // Configura botão BOX
  btnBox.onclick = () => {
    // Marcar que jogador quer parar (set flag no driver)
    playerDriver.aiBrain.targetPitLap = currentRaceEngine.drivers[0].lap; // força parada imediata
  };
  // Iniciar a corrida
  currentRaceEngine.start();
}

// Atualiza posição dos carros no mapa e tabela de classificação
function updateUIPositions(drivers) {
  // Atualiza scoreboard
  standingsBody.innerHTML = '';
  const leader = drivers.find(d => d.posicao === 1);
  drivers.forEach(d => {
    const tr = document.createElement('tr');
    if (d.id === playerDriver.id) tr.style.fontWeight = 'bold';
    const gap = leader && leader.totalTime ? (d.totalTime - leader.totalTime) : 0;
    tr.innerHTML = `<td>${d.posicao}</td><td>${d.nome}</td><td>${d.tyre.nome}</td><td>${d.lap}/${currentRaceEngine.totalVoltas}</td><td>${gap.toFixed(1)}s</td>`;
    standingsBody.appendChild(tr);
  });
  // Atualiza posição dos ícones
  carsLayer.innerHTML = '';
  drivers.forEach(d => {
    if (d.abandonou) return;
    const icon = document.createElement('img');
    icon.src = getCarIcon(d.equipe.chave);
    icon.classList.add('car-icon');
    // calcula coordenadas de pixel
    const { x, y } = progressToXY(d.progress, currentRaceEngine.pista.path);
    const containerRect = carsLayer.getBoundingClientRect();
    icon.style.left = `${x * 100}%`;
    icon.style.top = `${y * 100}%`;
    carsLayer.appendChild(icon);
  });
  // Atualiza HUD do jogador
  updateHud();
}

function updateWeatherInfo(clima) {
  const { trackTemp, rainLevel } = clima;
  const chuvaTxt = rainLevel > 0.7 ? 'Chuva forte' : rainLevel > 0.3 ? 'Chuva leve' : 'Seco';
  weatherInfo.textContent = `Pista: ${trackTemp.toFixed(1)}°C | ${chuvaTxt}`;
}

function showEvents(eventos) {
  // Exibe último evento por alguns segundos
  if (!eventos.length) return;
  const ev = eventos[eventos.length - 1];
  let msg = '';
  if (ev.tipo === 'acidente') {
    msg = `Acidente com ${ev.piloto} na volta ${ev.volta}!`;
  } else if (ev.tipo === 'falha') {
    msg = `Falha mecânica e abandono de ${ev.piloto} na volta ${ev.volta}!`;
  }
  eventLog.textContent = msg;
  // Limpa após 5 segundos
  setTimeout(() => { eventLog.textContent = ''; }, 5000);
}

function showPitMessage(driver, mensagem) {
  if (driver.id === playerDriver.id) {
    eventLog.textContent = mensagem;
    setTimeout(() => { eventLog.textContent = ''; }, 5000);
  }
}

function updateHud() {
  if (!playerDriver || playerDriver.abandonou) return;
  const tyre = playerDriver.tyre;
  hudTyre.textContent = tyre.nome;
  hudWear.textContent = (tyre.desgaste * 100).toFixed(0) + '%';
  hudTemp.textContent = tyre.temperatura.toFixed(0) + '°C';
  hudErs.textContent = (playerDriver.ersSystem.nivel * 100).toFixed(0) + '%';
  // delta
  const pos = playerDriver.posicao;
  if (pos === 1) {
    hudDelta.textContent = '--';
  } else {
    const driverAhead = currentRaceEngine.drivers.find(d => d.posicao === pos - 1);
    const delta = playerDriver.totalTime - driverAhead.totalTime;
    hudDelta.textContent = '+' + delta.toFixed(1) + 's';
  }
}

// Converte progress (0–1) para coordenadas x,y com base no path normalizado
function progressToXY(progress, path) {
  // progress * (length-1) ~ index
  const total = path.length;
  const idx = Math.floor(progress * total);
  const point = path[idx % total];
  return { x: point[0], y: point[1] };
}

// Devolve caminho do ícone do carro a partir da chave da equipe.
function getCarIcon(teamKey) {
  const key = teamKey.toLowerCase().replace(/\s+/g, '_');
  return `cars/${key}.png`;
}