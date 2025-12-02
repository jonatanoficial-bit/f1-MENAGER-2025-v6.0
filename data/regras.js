// F1 Manager 2025 – Versão 6.0
//
// Módulo de regras gerais da temporada e configurações base de corrida.
// Este arquivo centraliza parâmetros globais usados pelos módulos de física,
// evento e estratégia. Modifique estes valores com cuidado pois eles
// influenciam diretamente todas as simulações.

export const REGRAS = {
  // Número máximo de voltas em cada corrida. As pistas definem seus
  // próprios totais de voltas, mas este valor serve como limite superior.
  maxVoltas: 70,

  // Modo de motor disponível para todos os carros. Cada modo influencia
  // potência, consumo de combustível e desgaste do motor.
  motorModes: [
    {
      key: "economy",
      nome: "Economia",
      potencia: 0.90,
      consumo: 0.80,
      riscoQuebra: 0.5,
    },
    {
      key: "standard",
      nome: "Corrida",
      potencia: 1.0,
      consumo: 1.0,
      riscoQuebra: 1.0,
    },
    {
      key: "attack",
      nome: "Ataque",
      potencia: 1.1,
      consumo: 1.2,
      riscoQuebra: 1.3,
    },
    {
      key: "qualifying",
      nome: "Classificação",
      potencia: 1.2,
      consumo: 1.5,
      riscoQuebra: 1.6,
    },
  ],

  // Modos de ERS (Energy Recovery System). Controlam o fluxo de energia
  // elétrica disponível para impulsionar o carro.
  ersModes: [
    {
      key: "harvest",
      nome: "Recuperação",
      boost: -0.3,
      recarga: 0.25,
    },
    {
      key: "balanced",
      nome: "Balanceado",
      boost: 0.0,
      recarga: 0.05,
    },
    {
      key: "attack",
      nome: "Ataque",
      boost: 0.4,
      recarga: -0.08,
    },
    {
      key: "overtake",
      nome: "Ultrapassagem",
      boost: 0.7,
      recarga: -0.15,
    },
  ],

  // Parâmetros gerais de pneus. Cada composto é definido em tyreSystem.js,
  // mas aqui definimos limites globais e regras de uso.
  pneus: {
    // número mínimo de compostos diferentes a utilizar em corrida (pelo
    // regulamento da Fórmula 1).
    minCompUso: 2,
    // limite de stints sem uso de inter ou full wet durante chuva.
    stintMax: 3,
  },

  // Probabilidade de Safety Car e Virtual Safety Car para corridas padrão.
  eventos: {
    probSafetyCar: 0.05, // 5% de chance por corrida
    probVsc: 0.10,       // 10% de chance
    probAcidenteGrave: 0.02, // 2% de chance de acidente grande
  },

  // Duração mínima dos carros atrás do Safety Car. Garantimos que o
  // Safety Car permaneça na pista por ao menos 2 voltas antes de recolher.
  safetyCarMinLaps: 2,
};

export default REGRAS;