// components/AddAlarmModal.js
import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import {
  CHALLENGE_TYPES,
  DIFFICULTY_LEVELS,
  DEFAULT_DIFFICULTY,
} from "../types/alarmTypes";
import { TimeUtils } from "../utils/timeUtils";

const { width } = Dimensions.get("window");

const AddAlarmModal = ({ visible, onClose, onSave }) => {
  const [newAlarmTime, setNewAlarmTime] = useState(new Date());
  const [newAlarmChallenge, setNewAlarmChallenge] = useState(
    CHALLENGE_TYPES.MATH
  );
  const [challengeDifficulty, setChallengeDifficulty] =
    useState(DEFAULT_DIFFICULTY);
  const [alarmLabel, setAlarmLabel] = useState("");
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleTimeChange = (event, selectedTime) => {
    if (Platform.OS === "android") {
      setShowTimePicker(false);
    }
    if (selectedTime) {
      setNewAlarmTime(selectedTime);
    }
  };

  const handleSave = () => {
    const alarmData = {
      time: TimeUtils.formatTime(newAlarmTime),
      label: alarmLabel.trim(),
      challenge: newAlarmChallenge,
      difficulty: challengeDifficulty,
    };

    onSave(alarmData);
    resetForm();
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setNewAlarmTime(new Date());
    setNewAlarmChallenge(CHALLENGE_TYPES.MATH);
    setChallengeDifficulty(DEFAULT_DIFFICULTY);
    setAlarmLabel("");
    setShowTimePicker(false);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Novo Alarme</Text>

          <Text style={styles.label}>Horário:</Text>
          <TouchableOpacity
            style={styles.timeButton}
            onPress={() => setShowTimePicker(true)}
          >
            <Text style={styles.timeButtonText}>
              {TimeUtils.formatTime(newAlarmTime)}
            </Text>
          </TouchableOpacity>

          {showTimePicker && (
            <DateTimePicker
              value={newAlarmTime}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={handleTimeChange}
            />
          )}

          <Text style={styles.label}>Etiqueta (opcional):</Text>
          <TextInput
            style={styles.labelInput}
            value={alarmLabel}
            onChangeText={setAlarmLabel}
            placeholder="Ex: Trabalho, Academia..."
            maxLength={30}
          />

          <Text style={styles.label}>Tipo de Desafio:</Text>
          <View style={styles.challengeOptions}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                newAlarmChallenge === CHALLENGE_TYPES.MATH &&
                  styles.selectedOption,
              ]}
              onPress={() => setNewAlarmChallenge(CHALLENGE_TYPES.MATH)}
            >
              <Ionicons
                name="calculator"
                size={20}
                color={
                  newAlarmChallenge === CHALLENGE_TYPES.MATH ? "white" : "#666"
                }
              />
              <Text
                style={[
                  styles.optionText,
                  newAlarmChallenge === CHALLENGE_TYPES.MATH &&
                    styles.selectedText,
                ]}
              >
                Matemática
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionButton,
                newAlarmChallenge === CHALLENGE_TYPES.SHAKE &&
                  styles.selectedOption,
              ]}
              onPress={() => setNewAlarmChallenge(CHALLENGE_TYPES.SHAKE)}
            >
              <Ionicons
                name="phone-portrait"
                size={20}
                color={
                  newAlarmChallenge === CHALLENGE_TYPES.SHAKE ? "white" : "#666"
                }
              />
              <Text
                style={[
                  styles.optionText,
                  newAlarmChallenge === CHALLENGE_TYPES.SHAKE &&
                    styles.selectedText,
                ]}
              >
                Chacoalhar
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>
            Dificuldade: {challengeDifficulty}{" "}
            {newAlarmChallenge === CHALLENGE_TYPES.MATH
              ? "contas"
              : "chacoalhadas"}
          </Text>
          <View style={styles.difficultyButtons}>
            {DIFFICULTY_LEVELS.map((num) => (
              <TouchableOpacity
                key={num}
                style={[
                  styles.difficultyButton,
                  challengeDifficulty === num && styles.selectedDifficulty,
                ]}
                onPress={() => setChallengeDifficulty(num)}
              >
                <Text
                  style={[
                    styles.difficultyText,
                    challengeDifficulty === num && styles.selectedText,
                  ]}
                >
                  {num}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 20,
    width: width * 0.9,
    maxHeight: "90%",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
    color: "#1a1a1a",
  },
  timeButton: {
    backgroundColor: "#f8f9fa",
    borderWidth: 2,
    borderColor: "#2196F3",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  timeButtonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2196F3",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 12,
    color: "#1a1a1a",
  },
  labelInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: "#f8f9fa",
  },
  challengeOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  optionButton: {
    flex: 1,
    padding: 16,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 4,
    flexDirection: "row",
    justifyContent: "center",
  },
  optionText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  selectedOption: {
    backgroundColor: "#2196F3",
    borderColor: "#2196F3",
  },
  selectedText: {
    color: "white",
  },
  difficultyButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  difficultyButton: {
    width: 48,
    height: 48,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedDifficulty: {
    backgroundColor: "#2196F3",
    borderColor: "#2196F3",
  },
  difficultyText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#666",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    alignItems: "center",
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  saveButton: {
    flex: 1,
    padding: 16,
    backgroundColor: "#2196F3",
    borderRadius: 12,
    alignItems: "center",
    marginLeft: 8,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default AddAlarmModal;
