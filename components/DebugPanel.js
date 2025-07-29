// components/DebugPanel.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NotificationService } from "../services/notificationService";

const DebugPanel = ({ alarms }) => {
  const [showDebug, setShowDebug] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [scheduledNotifications, setScheduledNotifications] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const loadScheduledNotifications = async () => {
    const notifications = await NotificationService.getScheduledNotifications();
    setScheduledNotifications(notifications);
  };

  const triggerTestAlarm = () => {
    const testAlarm = {
      id: 999,
      time: currentTime.toTimeString().slice(0, 5),
      label: "Teste",
      challenge: "math",
      difficulty: 1,
      isActive: true,
    };

    // Simular trigger do alarme
    console.log("Teste de alarme acionado:", testAlarm);
  };

  if (!showDebug) {
    return (
      <TouchableOpacity
        style={styles.debugButton}
        onPress={() => setShowDebug(true)}
      >
        <Ionicons name="bug" size={20} color="white" />
      </TouchableOpacity>
    );
  }

  return (
    <Modal visible={showDebug} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.debugPanel}>
          <View style={styles.header}>
            <Text style={styles.title}>Debug Panel</Text>
            <TouchableOpacity
              onPress={() => setShowDebug(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>⏰ Tempo Atual</Text>
              <Text style={styles.timeText}>
                {currentTime.toLocaleTimeString("pt-BR")}
              </Text>
              <Text style={styles.timeText}>
                {currentTime.toLocaleDateString("pt-BR")}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📱 Alarmes</Text>
              {alarms.map((alarm) => (
                <View key={alarm.id} style={styles.alarmDebug}>
                  <Text style={styles.alarmText}>
                    {alarm.time} - {alarm.label || "Sem etiqueta"}
                  </Text>
                  <Text style={styles.alarmStatus}>
                    {alarm.isActive ? "✅ Ativo" : "❌ Inativo"}
                    {alarm.isTriggered ? " | 🔥 Acionado" : ""}
                  </Text>
                  <Text style={styles.alarmDetails}>
                    Notificação ID: {alarm.notificationId || "Nenhuma"}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🔔 Notificações Agendadas</Text>
              <TouchableOpacity
                style={styles.refreshButton}
                onPress={loadScheduledNotifications}
              >
                <Text style={styles.refreshButtonText}>Atualizar Lista</Text>
              </TouchableOpacity>

              {scheduledNotifications.map((notif, index) => (
                <View key={index} style={styles.notificationDebug}>
                  <Text style={styles.notifText}>ID: {notif.identifier}</Text>
                  <Text style={styles.notifText}>
                    Título: {notif.content.title}
                  </Text>
                  <Text style={styles.notifText}>
                    Agendado para:{" "}
                    {new Date(notif.trigger.date).toLocaleString("pt-BR")}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🧪 Testes</Text>
              <TouchableOpacity
                style={styles.testButton}
                onPress={triggerTestAlarm}
              >
                <Text style={styles.testButtonText}>Testar Alarme Agora</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  debugButton: {
    position: "absolute",
    top: 100,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ff6b35",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    zIndex: 1000,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  debugPanel: {
    backgroundColor: "white",
    width: "90%",
    maxHeight: "80%",
    borderRadius: 15,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 5,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  timeText: {
    fontSize: 18,
    fontFamily: "monospace",
    color: "#2196F3",
    marginBottom: 5,
  },
  alarmDebug: {
    backgroundColor: "#f8f9fa",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  alarmText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  alarmStatus: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  alarmDetails: {
    fontSize: 11,
    color: "#999",
    marginTop: 2,
  },
  refreshButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  refreshButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  notificationDebug: {
    backgroundColor: "#fff3cd",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  notifText: {
    fontSize: 12,
    color: "#333",
    marginBottom: 2,
  },
  testButton: {
    backgroundColor: "#ff6b35",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  testButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default DebugPanel;
