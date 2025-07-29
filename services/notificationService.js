// services/notificationService.js
import * as Notifications from "expo-notifications";
import { Alert, Platform } from "react-native";

// Configurar o comportamento das notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const NotificationService = {
  // Solicitar permissões
  async requestPermissions() {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permissão necessária",
          "É necessário permitir notificações para o funcionamento dos alarmes."
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error("Erro ao solicitar permissões:", error);
      return false;
    }
  },

  // Agendar notificação de alarme (LOCAL apenas)
  async scheduleAlarmNotification(alarm) {
    try {
      // Cancelar notificação existente
      if (alarm.notificationId) {
        await this.cancelNotification(alarm.notificationId);
      }

      const [hours, minutes] = alarm.time.split(":").map(Number);
      const now = new Date();
      const alarmTime = new Date();
      alarmTime.setHours(hours, minutes, 0, 0);

      // Se o horário já passou hoje, agendar para amanhã
      if (alarmTime <= now) {
        alarmTime.setDate(alarmTime.getDate() + 1);
      }

      // Usar notificação local (funciona no Expo Go)
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Alarme Smart! ⏰",
          body: alarm.label || `Hora de acordar! ${alarm.time}`,
          sound: Platform.OS === "ios" ? "default" : true,
          priority: Platform.OS === "android" ? "high" : undefined,
          categoryIdentifier: "alarm",
          data: {
            isAlarm: true,
            alarmId: alarm.id,
            challenge: alarm.challenge,
            difficulty: alarm.difficulty,
          },
        },
        trigger: {
          date: alarmTime,
          repeats: false,
        },
      });

      console.log("Notificação agendada:", {
        time: alarm.time,
        alarmTime: alarmTime.toLocaleString(),
        notificationId,
      });

      return notificationId;
    } catch (error) {
      console.error("Erro ao agendar notificação:", error);
      return null;
    }
  },

  // Mostrar notificação de confirmação quando alarme é criado (SEM SOM)
  async showAlarmConfirmation(alarm) {
    try {
      await Notifications.presentNotificationAsync({
        title: "Alarme Criado ✅",
        body: `Alarme para ${alarm.time} foi agendado${
          alarm.label ? ` - ${alarm.label}` : ""
        }`,
        sound: false, // SEM som para confirmação
      });
    } catch (error) {
      console.error("Erro ao mostrar confirmação:", error);
    }
  },

  // Cancelar notificação
  async cancelNotification(notificationId) {
    try {
      if (notificationId) {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
        console.log("Notificação cancelada:", notificationId);
      }
    } catch (error) {
      console.error("Erro ao cancelar notificação:", error);
    }
  },

  // Configurar listeners de notificação
  setupNotificationListeners(onNotificationReceived, onNotificationResponse) {
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notificação recebida:", notification);
        const alarmData = notification.request.content.data;
        if (alarmData && alarmData.isAlarm) {
          onNotificationReceived(alarmData);
        }
      }
    );

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Resposta da notificação:", response);
        const alarmData = response.notification.request.content.data;
        if (alarmData && alarmData.isAlarm) {
          onNotificationResponse(alarmData);
        }
      });

    return { notificationListener, responseListener };
  },

  // Remover listeners
  removeNotificationListeners(listeners) {
    if (listeners.notificationListener) {
      Notifications.removeNotificationSubscription(
        listeners.notificationListener
      );
    }
    if (listeners.responseListener) {
      Notifications.removeNotificationSubscription(listeners.responseListener);
    }
  },

  // Verificar notificações agendadas (para debug)
  async getScheduledNotifications() {
    try {
      const notifications =
        await Notifications.getAllScheduledNotificationsAsync();
      console.log("Notificações agendadas:", notifications);
      return notifications;
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
      return [];
    }
  },
};
