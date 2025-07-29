// components/AlarmChallengeModal.js
import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CHALLENGE_TYPES } from "../types/alarmTypes";

const AlarmChallengeModal = ({
  visible,
  alarm,
  mathChallenge,
  onMathAnswerChange,
  onCheckMathAnswers,
  shakeCount,
  requiredShakes,
  onDismiss,
}) => {
  const getShakeProgress = () => {
    return Math.min((shakeCount / requiredShakes) * 100, 100);
  };

  if (!alarm) return null;

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.alarmModalContent}>
        <Text style={styles.alarmModalTitle}>⏰ ALARME!</Text>
        <Text style={styles.alarmModalTime}>{alarm.time}</Text>

        {alarm.label && (
          <Text style={styles.alarmModalLabel}>{alarm.label}</Text>
        )}

        {alarm.challenge === CHALLENGE_TYPES.MATH && mathChallenge && (
          <View style={styles.mathChallengeContainer}>
            <Text style={styles.challengeTitle}>
              Resolva as contas para desligar:
            </Text>

            {mathChallenge.map((challenge, index) => (
              <View key={index} style={styles.mathQuestion}>
                <Text style={styles.questionText}>{challenge.question} =</Text>
                <TextInput
                  style={styles.answerInput}
                  value={challenge.userAnswer}
                  onChangeText={(text) => onMathAnswerChange(index, text)}
                  keyboardType="numeric"
                  placeholder="?"
                  autoFocus={index === 0}
                />
              </View>
            ))}

            <TouchableOpacity
              style={styles.checkButton}
              onPress={onCheckMathAnswers}
            >
              <Text style={styles.checkButtonText}>Verificar Respostas</Text>
            </TouchableOpacity>
          </View>
        )}

        {alarm.challenge === CHALLENGE_TYPES.SHAKE && (
          <View style={styles.shakeChallengeContainer}>
            <Text style={styles.challengeTitle}>
              Chacoalhe o celular para desligar!
            </Text>

            <View style={styles.shakeProgress}>
              <Text style={styles.shakeCounter}>
                {shakeCount} / {requiredShakes}
              </Text>

              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${getShakeProgress()}%` },
                  ]}
                />
              </View>
            </View>

            <Text style={styles.shakeInstruction}>
              {requiredShakes - shakeCount > 0
                ? `Chacoalhe mais ${requiredShakes - shakeCount} vez(es)`
                : "Completado!"}
            </Text>

            <Ionicons
              name="phone-portrait"
              size={60}
              color="white"
              style={styles.shakeIcon}
            />
          </View>
        )}

        {/* Botão de emergência para fechar (opcional) */}
        <TouchableOpacity style={styles.emergencyButton} onPress={onDismiss}>
          <Text style={styles.emergencyButtonText}>Desligar Emergência</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  alarmModalContent: {
    flex: 1,
    backgroundColor: "#ff4444",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  alarmModalTitle: {
    fontSize: 48,
    fontWeight: "bold",
    color: "white",
    marginBottom: 16,
    textAlign: "center",
  },
  alarmModalTime: {
    fontSize: 56,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  alarmModalLabel: {
    fontSize: 20,
    color: "white",
    marginBottom: 32,
    textAlign: "center",
  },
  mathChallengeContainer: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 20,
    width: "100%",
    maxWidth: 400,
  },
  challengeTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
    color: "#1a1a1a",
  },
  mathQuestion: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    justifyContent: "center",
  },
  questionText: {
    fontSize: 20,
    marginRight: 12,
    fontWeight: "500",
  },
  answerInput: {
    borderWidth: 2,
    borderColor: "#2196F3",
    borderRadius: 12,
    padding: 12,
    fontSize: 20,
    width: 80,
    textAlign: "center",
    fontWeight: "bold",
  },
  checkButton: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  checkButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  shakeChallengeContainer: {
    backgroundColor: "white",
    padding: 32,
    borderRadius: 20,
    alignItems: "center",
    width: "100%",
    maxWidth: 400,
  },
  shakeProgress: {
    alignItems: "center",
    marginVertical: 24,
  },
  shakeCounter: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#2196F3",
    marginBottom: 16,
  },
  progressBar: {
    width: 200,
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 4,
  },
  shakeInstruction: {
    fontSize: 18,
    textAlign: "center",
    color: "#666",
    marginBottom: 24,
  },
  shakeIcon: {
    opacity: 0.3,
  },
  emergencyButton: {
    position: "absolute",
    bottom: 50,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "white",
  },
  emergencyButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
});

export default AlarmChallengeModal;
