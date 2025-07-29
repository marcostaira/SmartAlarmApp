// services/challengeService.js
import { MATH_OPERATIONS } from "../types/alarmTypes";

export const ChallengeService = {
  // Gerar desafio matemático
  generateMathChallenge(difficulty) {
    const challenges = [];

    for (let i = 0; i < difficulty; i++) {
      const num1 = Math.floor(Math.random() * 50) + 1;
      const num2 = Math.floor(Math.random() * 50) + 1;
      const operation =
        MATH_OPERATIONS[Math.floor(Math.random() * MATH_OPERATIONS.length)];

      let answer;
      switch (operation) {
        case "+":
          answer = num1 + num2;
          break;
        case "-":
          answer = num1 - num2;
          break;
        case "*":
          answer = num1 * num2;
          break;
        default:
          answer = num1 + num2;
      }

      challenges.push({
        question: `${num1} ${operation} ${num2}`,
        answer: answer,
        userAnswer: "",
      });
    }

    return challenges;
  },

  // Verificar respostas do desafio matemático
  checkMathAnswers(challenges) {
    return challenges.every(
      (challenge) => parseInt(challenge.userAnswer) === challenge.answer
    );
  },

  // Atualizar resposta do usuário
  updateMathAnswer(challenges, index, answer) {
    return challenges.map((challenge, i) =>
      i === index ? { ...challenge, userAnswer: answer } : challenge
    );
  },

  // Verificar se todas as respostas foram preenchidas
  areAllAnswersFilled(challenges) {
    return challenges.every((challenge) => challenge.userAnswer.trim() !== "");
  },

  // Gerar dica para operação matemática
  generateHint(challenge) {
    const [num1, operation, num2] = challenge.question.split(" ");
    const n1 = parseInt(num1);
    const n2 = parseInt(num2);

    switch (operation) {
      case "+":
        return `Dica: ${n1} + ${n2} = ?`;
      case "-":
        return `Dica: ${n1} - ${n2} = ?`;
      case "*":
        return `Dica: ${n1} × ${n2} = ?`;
      default:
        return "Resolva a operação matemática";
    }
  },

  // Validar se o desafio de chacoalhar foi completado
  isShakeChallengeComplete(currentShakes, requiredShakes) {
    return currentShakes >= requiredShakes;
  },

  // Calcular progresso do desafio de chacoalhar
  getShakeProgress(currentShakes, requiredShakes) {
    return Math.min((currentShakes / requiredShakes) * 100, 100);
  },
};
