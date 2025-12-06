// ================================================
// BASE DE DADOS F1 MANAGER 2025 – VALE EDITION
// ================================================

// -------- EQUIPES (10) --------------------------------
const EQUIPES = [
  {
    id: "RED",
    nome: "Oracle Red Bull Racing",
    logo: "assets/logos/redbull.png",
    cor: "#1E5BC6",
    carroImg: "assets/cars/redbull.png"
  },
  {
    id: "FER",
    nome: "Scuderia Ferrari",
    logo: "assets/logos/ferrari.png",
    cor: "#DC0000",
    carroImg: "assets/cars/ferrari.png"
  },
  {
    id: "MER",
    nome: "Mercedes-AMG F1",
    logo: "assets/logos/mercedes.png",
    cor: "#00D2BE",
    carroImg: "assets/cars/mercedes.png"
  },
  {
    id: "MCL",
    nome: "McLaren",
    logo: "assets/logos/mclaren.png",
    cor: "#FF8700",
    carroImg: "assets/cars/mclaren.png"
  },
  {
    id: "AST",
    nome: "Aston Martin",
    logo: "assets/logos/aston_martin.png",
    cor: "#006F62",
    carroImg: "assets/cars/aston_martin.png"
  },
  {
    id: "ALP",
    nome: "Alpine",
    logo: "assets/logos/alpine.png",
    cor: "#0090FF",
    carroImg: "assets/cars/alpine.png"
  },
  {
    id: "WIL",
    nome: "Williams",
    logo: "assets/logos/williams.png",
    cor: "#005AFF",
    carroImg: "assets/cars/williams.png"
  },
  {
    id: "RB",
    nome: "Visa Cash App RB",
    logo: "assets/logos/rb.png",
    cor: "#2B4562",
    carroImg: "assets/cars/rb.png"
  },
  {
    id: "SAU",
    nome: "Stake F1 Team Sauber",
    logo: "assets/logos/sauber.png",
    cor: "#00E701",
    carroImg: "assets/cars/sauber.png"
  },
  {
    id: "HAA",
    nome: "Haas F1 Team",
    logo: "assets/logos/haas.png",
    cor: "#B6BABD",
    carroImg: "assets/cars/haas.png"
  }
];

// -------- PILOTOS (20) -------------------------------
// campos usados no jogo: id, nome, equipe, pais, avatar, rating
const PILOTOS = [
  { id: "VER", nome: "Max Verstappen",      equipe: "RED", pais: "nl", avatar: "assets/faces/verstappen.png", rating: 98 },
  { id: "PER", nome: "Sergio Pérez",        equipe: "RED", pais: "mx", avatar: "assets/faces/perez.png",       rating: 93 },

  { id: "LEC", nome: "Charles Leclerc",     equipe: "FER", pais: "mc", avatar: "assets/faces/leclerc.png",    rating: 94 },
  { id: "SAI", nome: "Carlos Sainz",        equipe: "FER", pais: "es", avatar: "assets/faces/sainz.png",      rating: 92 },

  { id: "HAM", nome: "Lewis Hamilton",      equipe: "MER", pais: "gb", avatar: "assets/faces/hamilton.png",   rating: 96 },
  { id: "RUS", nome: "George Russell",      equipe: "MER", pais: "gb", avatar: "assets/faces/russell.png",    rating: 93 },

  { id: "NOR", nome: "Lando Norris",        equipe: "MCL", pais: "gb", avatar: "assets/faces/norris.png",     rating: 94 },
  { id: "PIA", nome: "Oscar Piastri",       equipe: "MCL", pais: "au", avatar: "assets/faces/piastri.png",    rating: 91 },

  { id: "ALO", nome: "Fernando Alonso",     equipe: "AST", pais: "es", avatar: "assets/faces/alonso.png",     rating: 93 },
  { id: "STR", nome: "Lance Stroll",        equipe: "AST", pais: "ca", avatar: "assets/faces/stroll.png",     rating: 87 },

  { id: "GAS", nome: "Pierre Gasly",        equipe: "ALP", pais: "fr", avatar: "assets/faces/gasly.png",      rating: 89 },
  { id: "OCO", nome: "Esteban Ocon",        equipe: "ALP", pais: "fr", avatar: "assets/faces/ocon.png",       rating: 89 },

  { id: "ALB", nome: "Alexander Albon",     equipe: "WIL", pais: "th", avatar: "assets/faces/albon.png",      rating: 90 },
  { id: "SAR", nome: "Logan Sargeant",      equipe: "WIL", pais: "us", avatar: "assets/faces/sargeant.png",   rating: 82 },

  { id: "TSU", nome: "Yuki Tsunoda",        equipe: "RB",  pais: "jp", avatar: "assets/faces/tsunoda.png",    rating: 88 },
  { id: "LAW", nome: "Liam Lawson",         equipe: "RB",  pais: "nz", avatar: "assets/faces/lawson.png",     rating: 86 },

  { id: "BOT", nome: "Valtteri Bottas",     equipe: "SAU", pais: "fi", avatar: "assets/faces/bottas.png",     rating: 88 },
  { id: "ZHO", nome: "Guanyu Zhou",         equipe: "SAU", pais: "cn", avatar: "assets/faces/zhou.png",       rating: 84 },

  { id: "HUL", nome: "Nico Hülkenberg",     equipe: "HAA", pais: "de", avatar: "assets/faces/hulkenberg.png", rating: 87 },
  { id: "MAG", nome: "Kevin Magnussen",     equipe: "HAA", pais: "dk", avatar: "assets/faces/magnussen.png",  rating: 86 }
];

// -------- CALENDÁRIO (24 GPS) ------------------------
const CALENDARIO = [
  { id: "BH",  nome: "🇧🇭 GP do Bahrein",                pista: "bahrain.svg",        voltas: 57 },
  { id: "SA",  nome: "🇸🇦 GP da Arábia Saudita",         pista: "saudi_arabia.svg",   voltas: 50 },
  { id: "AU",  nome: "🇦🇺 GP da Austrália",              pista: "australia.svg",      voltas: 58 },
  { id: "JP",  nome: "🇯🇵 GP do Japão (Suzuka)",         pista: "suzuka.svg",         voltas: 53 },
  { id: "CN",  nome: "🇨🇳 GP da China",                  pista: "china.svg",          voltas: 56 },
  { id: "USM", nome: "🇺🇸 GP de Miami",                  pista: "miami.svg",          voltas: 57 },
  { id: "ITM", nome: "🇮🇹 GP da Emília-Romanha (Imola)", pista: "imola.svg",          voltas: 63 },
  { id: "MC",  nome: "🇲🇨 GP de Mônaco",                 pista: "monaco.svg",         voltas: 78 },
  { id: "CA",  nome: "🇨🇦 GP do Canadá",                 pista: "canada.svg",         voltas: 70 },
  { id: "ES",  nome: "🇪🇸 GP da Espanha",                pista: "espanha.svg",        voltas: 66 },
  { id: "AT",  nome: "🇦🇹 GP da Áustria",                pista: "austria.svg",        voltas: 71 },
  { id: "GB",  nome: "🇬🇧 GP da Inglaterra (Silverstone)", pista: "silverstone.svg",  voltas: 52 },
  { id: "HU",  nome: "🇭🇺 GP da Hungria",                pista: "hungria.svg",        voltas: 70 },
  { id: "BE",  nome: "🇧🇪 GP da Bélgica (Spa)",          pista: "spa.svg",            voltas: 44 },
  { id: "NL",  nome: "🇳🇱 GP da Holanda (Zandvoort)",    pista: "zandvoort.svg",      voltas: 72 },
  { id: "IT",  nome: "🇮🇹 GP da Itália (Monza)",         pista: "monza.svg",          voltas: 53 },
  { id: "AZ",  nome: "🇦🇿 GP do Azerbaijão (Baku)",      pista: "baku.svg",           voltas: 51 },
  { id: "SG",  nome: "🇸🇬 GP de Singapura",              pista: "singapura.svg",      voltas: 62 },
  { id: "USA", nome: "🇺🇸 GP dos EUA (Austin)",          pista: "austin.svg",         voltas: 56 },
  { id: "MX",  nome: "🇲🇽 GP do México",                 pista: "mexico.svg",         voltas: 71 },
  { id: "BR",  nome: "🇧🇷 GP do Brasil (Interlagos)",    pista: "interlagos.svg",     voltas: 71 },
  { id: "LV",  nome: "🇺🇸 GP de Las Vegas",              pista: "lasvegas.svg",       voltas: 50 },
  { id: "QA",  nome: "🇶🇦 GP do Catar",                  pista: "qatar.svg",          voltas: 57 },
  { id: "AD",  nome: "🇦🇪 GP de Abu Dhabi",              pista: "abudhabi.svg",       voltas: 58 }
];

// -----------------------------------------------------
// Fim do data.js
// -----------------------------------------------------
