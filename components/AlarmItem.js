// components/AlarmItem.js
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Alert,
  Switch,
  PanResponder,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TimeUtils } from "../utils/timeUtils";

const AlarmItem = ({ alarm, onToggle, onDelete, onEdit }) => {
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const translateX = useRef(new Animated.Value(0)).current;

  // Configurar PanResponder para gestos de swipe
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Só ativar se for movimento horizontal
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
      },

      onPanResponderMove: (evt, gestureState) => {
        // Permitir apenas deslizar para a esquerda
        if (gestureState.dx <= 0) {
          translateX.setValue(gestureState.dx);
        }
      },

      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx < -80) {
          // Mostrar botão de excluir
          setShowDeleteButton(true);
          Animated.spring(translateX, {
            toValue: -80,
            useNativeDriver: false,
          }).start();
        } else {
          // Voltar à posição original
          setShowDeleteButton(false);
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const handleDelete = () => {
    Alert.alert(
      "Excluir Alarme",
      `Tem certeza que deseja excluir o alarme ${alarm.time}?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
          onPress: () => {
            // Voltar à posição original
            setShowDeleteButton(false);
            Animated.spring(translateX, {
              toValue: 0,
              useNativeDriver: false,
            }).start();
          },
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            onDelete(alarm.id);
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    // Só permitir editar se não estiver mostrando delete
    if (!showDeleteButton) {
      onEdit(alarm);
    } else {
      // Fechar o botão de delete se estiver aberto
      setShowDeleteButton(false);
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleToggle = () => {
    // Fechar delete se estiver aberto
    if (showDeleteButton) {
      setShowDeleteButton(false);
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: false,
      }).start();
    } else {
      onToggle(alarm.id);
    }
  };

  return (
    <View style={styles.container}>
      {/* Botão de excluir (fica atrás) */}
      {showDeleteButton && (
        <View style={styles.deleteBackground}>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Ionicons name="trash" size={24} color="white" />
            <Text style={styles.deleteText}>Excluir</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Item do alarme com gesture */}
      <Animated.View
        style={[styles.alarmItem, { transform: [{ translateX }] }]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          style={styles.alarmContent}
          onPress={handleEdit}
          activeOpacity={0.7}
        >
          <View style={styles.alarmInfo}>
            <Text
              style={[styles.alarmTime, !alarm.isActive && styles.inactiveText]}
            >
              {alarm.time}
            </Text>

            {alarm.label && (
              <Text
                style={[
                  styles.alarmLabel,
                  !alarm.isActive && styles.inactiveText,
                ]}
              >
                {alarm.label}
              </Text>
            )}

            <Text style={styles.alarmChallenge}>
              {alarm.challenge === "math"
                ? `Matemática (${alarm.difficulty} contas)`
                : `Chacoalhar (${alarm.difficulty}x)`}
            </Text>

            {alarm.isActive && (
              <Text style={styles.nextAlarm}>
                Próximo: {TimeUtils.getTimeUntilAlarm(alarm.time)}
              </Text>
            )}
          </View>

          <View style={styles.alarmControls}>
            <Switch
              value={alarm.isActive}
              onValueChange={handleToggle}
              trackColor={{ false: "#ccc", true: "#4CAF50" }}
              thumbColor={alarm.isActive ? "#fff" : "#f4f3f4"}
              ios_backgroundColor="#ccc"
              style={styles.switch}
            />

            <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
              <Ionicons name="pencil" size={18} color="#2196F3" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    position: "relative",
  },
  deleteBackground: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 80,
    backgroundColor: "#ff4444",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  deleteButton: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
  },
  deleteText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 4,
  },
  alarmItem: {
    backgroundColor: "white",
    borderRadius: 16,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    zIndex: 2,
  },
  alarmContent: {
    flexDirection: "row",
    padding: 20,
  },
  alarmInfo: {
    flex: 1,
  },
  alarmTime: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  alarmLabel: {
    fontSize: 16,
    color: "#2196F3",
    fontWeight: "600",
    marginBottom: 4,
  },
  alarmChallenge: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  nextAlarm: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "500",
  },
  inactiveText: {
    color: "#999",
  },
  alarmControls: {
    justifyContent: "center",
    alignItems: "center",
  },
  switch: {
    marginBottom: 8,
  },
  editButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#f0f8ff",
  },
});

export default AlarmItem;
