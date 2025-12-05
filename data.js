/* ===========================================================
   F1 MANAGER 2025 — DATA PRINCIPAL
   EQUIPES • PILOTOS • CALENDÁRIO (24 GPs)
=========================================================== */

/* ===========================================================
   EQUIPES
=========================================================== */

const EQUIPES = [
    {
        id: "redbull",
        nome: "Red Bull Racing",
        logo: "assets/logos/redbull.png",
        cor: "#1E41FF"
    },
    {
        id: "ferrari",
        nome: "Scuderia Ferrari",
        logo: "assets/logos/ferrari.png",
        cor: "#E10600"
    },
    {
        id: "mercedes",
        nome: "Mercedes",
        logo: "assets/logos/mercedes.png",
        cor: "#00D2BE"
    },
    {
        id: "mclaren",
        nome: "McLaren",
        logo: "assets/logos/mclaren.png",
        cor: "#FF8700"
    },
    {
        id: "astonmartin",
        nome: "Aston Martin",
        logo: "assets/logos/astonmartin.png",
        cor: "#006F62"
    },
    {
        id: "alpine",
        nome: "Alpine",
        logo: "assets/logos/alpine.png",
        cor: "#0090FF"
    },
    {
        id: "williams",
        nome: "Williams",
        logo: "assets/logos/williams.png",
        cor: "#005AFF"
    },
    {
        id: "rb",
        nome: "RB",
        logo: "assets/logos/rb.png",
        cor: "#2B4562"
    },
    {
        id: "sauber",
        nome: "Sauber",
        logo: "assets/logos/sauber.png",
        cor: "#52E252"
    },
    {
        id: "haas",
        nome: "Haas",
        logo: "assets/logos/haas.png",
        cor: "#FFFFFF"
    }
];

/* ===========================================================
   PILOTOS
   rating: 0–100 (habilidade geral aproximada)
=========================================================== */

const PILOTOS = [
    // RED BULL
    { id: "max_verstappen", nome: "Max Verstappen", equipe: "redbull", rating: 96, avatar: "assets/faces/verstappen.png", pais: "nl" },
    { id: "perez",          nome: "Sergio Pérez",    equipe: "redbull", rating: 89, avatar: "assets/faces/perez.png",      pais: "mx" },

    // FERRARI
    { id: "leclerc", nome: "Charles Leclerc", equipe: "ferrari", rating: 92, avatar: "assets/faces/leclerc.png", pais: "mc" },
    { id: "sainz",   nome: "Carlos Sainz",    equipe: "ferrari", rating: 89, avatar: "assets/faces/sainz.png",   pais: "es" },

    // MERCEDES
    { id: "hamilton", nome: "Lewis Hamilton", equipe: "mercedes", rating: 94, avatar: "assets/faces/hamilton.png", pais: "gb" },
    { id: "russell",  nome: "George Russell", equipe: "mercedes", rating: 90, avatar: "assets/faces/russell.png",  pais: "gb" },

    // MCLAREN
    { id: "norris",   nome: "Lando Norris",   equipe: "mclaren", rating: 91, avatar: "assets/faces/norris.png",   pais: "gb" },
    { id: "piastri",  nome: "Oscar Piastri",  equipe: "mclaren", rating: 88, avatar: "assets/faces/piastri.png",  pais: "au" },

    // ASTON MARTIN
    { id: "alonso", nome: "Fernando Alonso", equipe: "astonmartin", rating: 92, avatar: "assets/faces/alonso.png", pais: "es" },
    { id: "stroll", nome: "Lance Stroll",   equipe: "astonmartin", rating: 84, avatar: "assets/faces/stroll.png", pais: "ca" },

    // ALPINE
    { id: "gasly", nome: "Pierre Gasly", equipe: "alpine", rating: 87, avatar: "assets/faces/gasly.png", pais: "fr" },
    { id: "ocon",  nome: "Esteban Ocon", equipe: "alpine", rating: 86, avatar: "assets/faces/ocon.png",  pais: "fr" },

    // WILLIAMS
    { id: "albon",    nome: "Alex Albon",     equipe: "williams", rating: 86, avatar: "assets/faces/albon.png",    pais: "th" },
    { id: "sargeant", nome: "Logan Sargeant", equipe: "williams", rating: 78, avatar: "assets/faces/sargeant.png", pais: "us" },

    // RB
    { id: "ricciardo", nome: "Daniel Ricciardo", equipe: "rb", rating: 85, avatar: "assets/faces/ricciardo.png", pais: "au" },
    { id: "tsunoda",   nome: "Yuki Tsunoda",    equipe: "rb", rating: 83, avatar: "assets/faces/tsunoda.png",   pais: "jp" },

    // SAUBER
    { id: "bottas", nome: "Valtteri Bottas", equipe: "sauber", rating: 85, avatar: "assets/faces/bottas.png", pais: "fi" },
    { id: "zhou",   nome: "Guanyu Zhou",     equipe: "sauber", rating: 80, avatar: "assets/faces/zhou.png",   pais: "cn" },

    // HAAS
    { id: "hulkenberg", nome: "Nico Hülkenberg", equipe: "haas", rating: 84, avatar: "assets/faces/hulkenberg.png", pais: "de" },
    { id: "magnussen",  nome: "Kevin Magnussen", equipe: "haas", rating: 82, avatar: "assets/faces/magnussen.png",  pais: "dk" }
];

/* ===========================================================
   CALENDÁRIO (24 GPs)
   pista: nome do arquivo SVG na pasta assets/tracks
=========================================================== */

const CALENDARIO = [
    { id: 1,  nome: "GP do Bahrein",          pista: "bahrain.svg" },
    { id: 2,  nome: "GP da Arábia Saudita",   pista: "jeddah.svg" },
    { id: 3,  nome: "GP da Austrália",        pista: "australia.svg" },
    { id: 4,  nome: "GP do Japão",            pista: "suzuka.svg" },
    { id: 5,  nome: "GP da China",            pista: "china.svg" },
    { id: 6,  nome: "GP de Miami",            pista: "miami.svg" },
    { id: 7,  nome: "GP da Emília-Romanha",   pista: "imola.svg" },
    { id: 8,  nome: "GP de Mônaco",           pista: "monaco.svg" },
    { id: 9,  nome: "GP do Canadá",           pista: "canada.svg" },
    { id: 10, nome: "GP da Espanha",          pista: "barcelona.svg" },
    { id: 11, nome: "GP da Áustria",          pista: "austria.svg" },
    { id: 12, nome: "GP da Grã-Bretanha",     pista: "silverstone.svg" },
    { id: 13, nome: "GP da Hungria",          pista: "hungaroring.svg" },
    { id: 14, nome: "GP da Bélgica",          pista: "spa.svg" },
    { id: 15, nome: "GP da Holanda",          pista: "zandvoort.svg" },
    { id: 16, nome: "GP da Itália",           pista: "monza.svg" },
    { id: 17, nome: "GP do Azerbaijão",       pista: "baku.svg" },
    { id: 18, nome: "GP de Singapura",        pista: "singapore.svg" },
    { id: 19, nome: "GP dos EUA (Austin)",    pista: "cota.svg" },
    { id: 20, nome: "GP do México",           pista: "mexico.svg" },
    { id: 21, nome: "GP de São Paulo",        pista: "interlagos.svg" },
    { id: 22, nome: "GP de Las Vegas",        pista: "lasvegas.svg" },
    { id: 23, nome: "GP do Qatar",            pista: "qatar.svg" },
    { id: 24, nome: "GP de Abu Dhabi",        pista: "abudhabi.svg" }
];
