// utils/timeUtils.js

export const TimeUtils = {
  // Formatar horário para string HH:MM
  formatTime(date) {
    return `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  },

  // Calcular tempo restante até o próximo alarme
  getTimeUntilAlarm(timeString) {
    const [hours, minutes] = timeString.split(":").map(Number);
    const now = new Date();
    const alarmTime = new Date();
    alarmTime.setHours(hours, minutes, 0, 0);

    // Se o horário já passou hoje, agendar para amanhã
    if (alarmTime <= now) {
      alarmTime.setDate(alarmTime.getDate() + 1);
    }

    const timeDiff = alarmTime - now;
    const hoursLeft = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutesLeft = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    if (hoursLeft > 0) {
      return `${hoursLeft}h ${minutesLeft}min`;
    } else {
      return `${minutesLeft}min`;
    }
  },

  // Converter string de tempo para objeto Date
  timeStringToDate(timeString) {
    const [hours, minutes] = timeString.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  },

  // Verificar se um horário já passou hoje
  hasTimePassed(timeString) {
    const alarmTime = this.timeStringToDate(timeString);
    const now = new Date();
    return alarmTime <= now;
  },

  // Obter próxima data para um horário específico
  getNextAlarmDate(timeString) {
    const [hours, minutes] = timeString.split(":").map(Number);
    const now = new Date();
    const alarmTime = new Date();
    alarmTime.setHours(hours, minutes, 0, 0);

    if (alarmTime <= now) {
      alarmTime.setDate(alarmTime.getDate() + 1);
    }

    return alarmTime;
  },

  // Formatar duração em texto legível
  formatDuration(milliseconds) {
    const totalMinutes = Math.floor(milliseconds / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    } else {
      return `${minutes}min`;
    }
  },

  // Verificar se é um horário válido
  isValidTime(timeString) {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(timeString);
  },

  // Comparar dois horários (para ordenação)
  compareTimeStrings(time1, time2) {
    return time1.localeCompare(time2);
  },
};
