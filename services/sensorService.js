// services/sensorService.js
import { Accelerometer } from "expo-sensors";
import { ACCELEROMETER_CONFIG } from "../types/alarmTypes";

export const SensorService = {
  subscription: null,

  // Iniciar monitoramento do acelerômetro
  startShakeDetection(onShakeDetected) {
    try {
      Accelerometer.setUpdateInterval(ACCELEROMETER_CONFIG.UPDATE_INTERVAL);

      this.subscription = Accelerometer.addListener((accelerometerData) => {
        const { x, y, z } = accelerometerData;
        const acceleration = Math.sqrt(x * x + y * y + z * z);

        if (acceleration > ACCELEROMETER_CONFIG.SHAKE_THRESHOLD) {
          onShakeDetected();
        }
      });

      return true;
    } catch (error) {
      console.error("Erro ao iniciar detecção de chacoalhada:", error);
      return false;
    }
  },

  // Parar monitoramento do acelerômetro
  stopShakeDetection() {
    try {
      if (this.subscription) {
        this.subscription.remove();
        this.subscription = null;
      }
      return true;
    } catch (error) {
      console.error("Erro ao parar detecção de chacoalhada:", error);
      return false;
    }
  },

  // Verificar se o acelerômetro está disponível
  async isAccelerometerAvailable() {
    try {
      return await Accelerometer.isAvailableAsync();
    } catch (error) {
      console.error(
        "Erro ao verificar disponibilidade do acelerômetro:",
        error
      );
      return false;
    }
  },

  // Configurar sensibilidade do acelerômetro
  setSensitivity(threshold) {
    ACCELEROMETER_CONFIG.SHAKE_THRESHOLD = threshold;
  },

  // Obter configuração atual
  getCurrentConfig() {
    return { ...ACCELEROMETER_CONFIG };
  },
};
