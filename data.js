/* ===========================================================
   F1 MANAGER 2025 — DATA PRINCIPAL DO JOGO
   EQUIPES • PILOTOS • CALENDÁRIO COMPLETO (24 GPs)
=========================================================== */

/* ===========================================================
   EQUIPES (dados básicos)
=========================================================== */

const EQUIPES = [
    { nome: "Red Bull",       id: "redbull",     logo: "assets/logos/redbull.png",     carro: "assets/cars/redbull.png",     motor: "Honda RBPT", cor: "#1E1E3F" },
    { nome: "Ferrari",        id: "ferrari",     logo: "assets/logos/ferrari.png",     carro: "assets/cars/ferrari.png",     motor: "Ferrari",    cor: "#E10600" },
    { nome: "Mercedes",       id: "mercedes",    logo: "assets/logos/mercedes.png",    carro: "assets/cars/mercedes.png",    motor: "Mercedes",   cor: "#00D2BE" },
    { nome: "McLaren",        id: "mclaren",     logo: "assets/logos/mclaren.png",     carro: "assets/cars/mclaren.png",     motor: "Mercedes",   cor: "#FF8700" },
    { nome: "Aston Martin",   id: "astonmartin", logo: "assets/logos/astonmartin.png", carro: "assets/cars/astonmartin.png", motor: "Mercedes",   cor: "#005F52" },
    { nome: "Alpine",         id: "alpine",      logo: "assets/logos/alpine.png",      carro: "assets/cars/alpine.png",      motor: "Renault",    cor: "#0090FF" },
    { nome: "Williams",       id: "williams",    logo: "assets/logos/williams.png",    carro: "assets/cars/williams.png",    motor: "Mercedes",   cor: "#0055FF" },
    { nome: "RB",             id: "rb",          logo: "assets/logos/rb.png",          carro: "assets/cars/rb.png",          motor: "Honda RBPT", cor: "#002060" },
    { nome: "Sauber",         id: "sauber",      logo: "assets/logos/sauber.png",      carro: "assets/cars/sauber.png",      motor: "Ferrari",    cor: "#8A0000" },
    { nome: "Haas",           id: "haas",        logo: "assets/logos/haas.png",        carro: "assets/cars/haas.png",        motor: "Ferrari",    cor: "#E2E2E2" }
];

/* ===========================================================
   PILOTOS (ratings + avatares + país para bandeira)
=========================================================== */

const PILOTOS = [
    // RED BULL
    { nome: "Max Verstappen",   id: "verstappen", equipe: "redbull",   rating: 96, avatar: "assets/faces/verstappen.png", pais: "nl" },
    { nome: "Sergio Perez",     id: "perez",      equipe: "redbull",   rating: 89, avatar: "assets/faces/perez.png",      pais: "mx" },

    // FERRARI
    { nome: "Charles Leclerc",  id: "leclerc",    equipe: "ferrari",   rating: 92, avatar: "assets/faces/leclerc.png",    pais: "mc" },
    { nome: "Carlos Sainz",     id: "sainz",      equipe: "ferrari",   rating: 89, avatar: "assets/faces/sainz.png",      pais: "es" },

    // MERCEDES
    { nome: "Lewis Hamilton",   id: "hamilton",   equipe: "mercedes",  rating: 93, avatar: "assets/faces/hamilton.png",   pais: "gb" },
    { nome: "George Russell",   id: "russell",    equipe: "mercedes",  rating: 90, avatar: "assets/faces/russell.png",    pais: "gb" },

    // MCLAREN
    { nome: "Lando Norris",     id: "norris",     equipe: "mclaren",   rating: 91, avatar: "assets/faces/norris.png",     pais: "gb" },
    { nome: "Oscar Piastri",    id: "piastri",    equipe: "mclaren",   rating: 88, avatar: "assets/faces/piastri.png",    pais: "au" },

    // ASTON MARTIN
    { nome: "Fernando Alonso",  id: "alonso",     equipe: "astonmartin", rating: 92, avatar: "assets/faces/alonso.png",   pais: "es" },
    { nome: "Lance Stroll",     id: "stroll",     equipe: "astonmartin", rating: 84, avatar: "assets/faces/stroll.png",   pais: "ca" },

    // ALPINE
    { nome: "Pierre Gasly",     id: "gasly",      equipe: "alpine",    rating: 88, avatar: "assets/faces/gasly.png",      pais: "fr" },
    { nome: "Esteban Ocon",     id: "ocon",       equipe: "alpine",    rating: 87, avatar: "assets/faces/ocon.png",       pais: "fr" },

    // WILLIAMS
    { nome: "Alex Albon",       id: "albon",      equipe: "williams",  rating: 87, avatar: "assets/faces/albon.png",      pais: "th" },
    { nome: "Logan Sargeant",   id: "sargeant",   equipe: "williams",  rating: 78, avatar: "assets/faces/sargeant.png",   pais: "us" },

    // RB
    { nome: "Daniel Ricciardo", id: "ricciardo",  equipe: "rb",        rating: 85, avatar: "assets/faces/ricciardo.png",  pais: "au" },
    { nome: "Liam Lawson",      id: "lawson",     equipe: "rb",        rating: 83, avatar: "assets/faces/lawson.png",     pais: "nz" },

    // SAUBER
    { nome: "Valtteri Bottas",  id: "bottas",     equipe: "sauber",    rating: 85, avatar: "assets/faces/bottas.png",     pais: "fi" },
    { nome: "Guanyu Zhou",      id: "zhou",       equipe: "sauber",    rating: 82, avatar: "assets/faces/zhou.png",       pais: "cn" },

    // HAAS
    { nome: "Kevin Magnussen",  id: "magnussen",  equipe: "haas",      rating: 83, avatar: "assets/faces/magnussen.png",  pais: "dk" },
    { nome: "Nico Hulkenberg",  id: "hulkenberg", equipe: "haas",      rating: 84, avatar: "assets/faces/hulkenberg.png", pais: "de" }
];

/* ===========================================================
   CALENDÁRIO COMPLETO (24 GPs)
   — usa SVGs em assets/tracks/
=========================================================== */

const CALENDARIO = [
    { nome: "🇧🇭 GP do Bahrain",                pista: "bahrain.svg" },
    { nome: "🇸🇦 GP da Arábia Saudita",         pista: "jeddah.svg" },
    { nome: "🇦🇺 GP da Austrália",             pista: "australia.svg" },
    { nome: "🇯🇵 GP do Japão (Suzuka)",         pista: "suzuka.svg" },
    { nome: "🇨🇳 GP da China",                 pista: "china.svg" },
    { nome: "🇺🇸 GP de Miami",                 pista: "miami.svg" },
    { nome: "🇮🇹 GP da Emília-Romanha (Imola)", pista: "imola.svg" },
    { nome: "🇲🇨 GP de Mônaco",                pista: "monaco.svg" },
    { nome: "🇨🇦 GP do Canadá",                pista: "canada.svg" },
    { nome: "🇪🇸 GP da Espanha",               pista: "spain.svg" },
    { nome: "🇦🇹 GP da Áustria",               pista: "austria.svg" },
    { nome: "🇬🇧 GP da Inglaterra (Silverstone)", pista: "silverstone.svg" },
    { nome: "🇭🇺 GP da Hungria",               pista: "hungary.svg" },
    { nome: "🇧🇪 GP da Bélgica (Spa)",         pista: "spa.svg" },
    { nome: "🇳🇱 GP da Holanda (Zandvoort)",   pista: "zandvoort.svg" },
    { nome: "🇮🇹 GP da Itália (Monza)",        pista: "monza.svg" },
    { nome: "🇦🇿 GP do Azerbaijão (Baku)",     pista: "baku.svg" },
    { nome: "🇸🇬 GP de Singapura",             pista: "singapore.svg" },
    { nome: "🇺🇸 GP dos EUA (Austin)",         pista: "austin.svg" },
    { nome: "🇲🇽 GP do México",                pista: "mexico.svg" },
    { nome: "🇧🇷 GP do Brasil (Interlagos)",   pista: "interlagos.svg" },
    { nome: "🇺🇸 GP de Las Vegas",             pista: "lasvegas.svg" },
    { nome: "🇶🇦 GP do Catar",                 pista: "qatar.svg" },
    { nome: "🇦🇪 GP de Abu Dhabi",             pista: "abudhabi.svg" }
];

/* ===========================================================
   EXPORTAÇÃO GLOBAL
=========================================================== */

window.EQUIPES = EQUIPES;
window.PILOTOS = PILOTOS;
window.CALENDARIO = CALENDARIO;
