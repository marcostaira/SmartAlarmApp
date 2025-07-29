// services/audioService.js
import { Audio } from "expo-av";

export const AudioService = {
  sound: null,

  // Tocar som do alarme
  async playAlarmSound(
    soundUrl = "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
  ) {
    try {
      // Parar som anterior se estiver tocando
      await this.stopSound();

      // Carregar e tocar novo som
      const { sound } = await Audio.Audio.loadAsync({ uri: soundUrl });
      this.sound = sound;

      await sound.playAsync();
      await sound.setIsLoopingAsync(true);

      return true;
    } catch (error) {
      console.error("Erro ao tocar som do alarme:", error);
      return false;
    }
  },

  // Parar som
  async stopSound() {
    try {
      if (this.sound) {
        await this.sound.stopAsync();
        await this.sound.unloadAsync();
        this.sound = null;
      }
      return true;
    } catch (error) {
      console.error("Erro ao parar som:", error);
      return false;
    }
  },

  // Verificar se o som está tocando
  async isPlaying() {
    try {
      if (this.sound) {
        const status = await this.sound.getStatusAsync();
        return status.isPlaying;
      }
      return false;
    } catch (error) {
      console.error("Erro ao verificar status do som:", error);
      return false;
    }
  },

  // Ajustar volume
  async setVolume(volume = 1.0) {
    try {
      if (this.sound) {
        await this.sound.setVolumeAsync(volume);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro ao ajustar volume:", error);
      return false;
    }
  },
};
