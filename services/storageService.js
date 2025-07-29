// services/storageService.js
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "smart_alarms";

export const StorageService = {
  // Salvar alarmes
  async saveAlarms(alarms) {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(alarms));
      return true;
    } catch (error) {
      console.error("Erro ao salvar alarmes:", error);
      return false;
    }
  },

  // Carregar alarmes
  async loadAlarms() {
    try {
      const savedAlarms = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedAlarms) {
        return JSON.parse(savedAlarms);
      }
      return [];
    } catch (error) {
      console.error("Erro ao carregar alarmes:", error);
      return [];
    }
  },

  // Limpar todos os alarmes
  async clearAlarms() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      console.error("Erro ao limpar alarmes:", error);
      return false;
    }
  },

  // Salvar configurações do app
  async saveSettings(settings) {
    try {
      await AsyncStorage.setItem("app_settings", JSON.stringify(settings));
      return true;
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      return false;
    }
  },

  // Carregar configurações do app
  async loadSettings() {
    try {
      const settings = await AsyncStorage.getItem("app_settings");
      if (settings) {
        return JSON.parse(settings);
      }
      return {};
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
      return {};
    }
  },
};
