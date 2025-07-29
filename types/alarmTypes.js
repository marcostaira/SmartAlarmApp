// types/alarmTypes.js

export const CHALLENGE_TYPES = {
  MATH: "math",
  SHAKE: "shake",
};

export const MATH_OPERATIONS = ["+", "-", "*"];

export const DIFFICULTY_LEVELS = [1, 2, 3, 4, 5];

export const DEFAULT_DIFFICULTY = 3;

// Estrutura do objeto Alarm
export const createAlarm = (time, label, challenge, difficulty) => ({
  id: Date.now(),
  time,
  label,
  isActive: true,
  challenge,
  difficulty,
  isTriggered: false,
  notificationId: null,
});

// Estrutura do desafio de matemática
export const createMathChallenge = (question, answer) => ({
  question,
  answer,
  userAnswer: "",
});

// Configurações do acelerômetro
export const ACCELEROMETER_CONFIG = {
  UPDATE_INTERVAL: 100,
  SHAKE_THRESHOLD: 2.5,
};
