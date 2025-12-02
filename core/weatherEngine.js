// F1 Manager 2025 – Versão 6.0
//
// Gerenciador de clima. Controla temperatura da pista e nível de chuva
// durante a corrida. Permite transições dinâmicas de tempo, tornando as
// corridas imprevisíveis. A chuva aumenta a probabilidade de Safety
// Car e influencia diretamente o desgaste dos pneus e a aderência.

export class WeatherEngine {
  constructor() {
    // temperatura inicial do asfalto (°C)
    this.trackTemp = 32;
    // Nível de chuva (0 = seco, 1 = tempestade). Varia ao longo do tempo.
    this.rainLevel = 0;
    // Cronômetro interno para decidir quando mudar o tempo.
    this._timer = 0;
  }
  // Atualiza o clima. deltaTime é o tempo em segundos desde a última
  // atualização. lapNumber é o número atual da volta (para gatilhos por
  // volta).
  update(deltaTime, lapNumber) {
    this._timer += deltaTime;
    // A cada 60 segundos ou a cada 5 voltas, há chance de mudança.
    const trigger = this._timer > 60 || lapNumber % 5 === 0;
    if (trigger) {
      this._timer = 0;
      // 20% de chance de mudança de tempo
      if (Math.random() < 0.2) {
        // A chuva pode começar ou parar gradualmente
        const change = (Math.random() - 0.5) * 0.4; // variação -0.2 a 0.2
        this.rainLevel = Math.max(0, Math.min(1, this.rainLevel + change));
      }
      // Temperatura oscila levemente ao longo da corrida
      const tempChange = (Math.random() - 0.5) * 2; // ±1°C
      this.trackTemp = Math.max(10, Math.min(50, this.trackTemp + tempChange));
    }
    return { trackTemp: this.trackTemp, rainLevel: this.rainLevel };
  }
}