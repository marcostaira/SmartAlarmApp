// App.js - Componente Principal
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Importar serviços
import { NotificationService } from './services/notificationService';
import { StorageService } from './services/storageService';
import { AudioService } from './services/audioService';
import { ChallengeService } from './services/challengeService';
import { SensorService } from './services/sensorService';

// Importar utilitários
import { TimeUtils } from './utils/timeUtils';

// Importar tipos
import { createAlarm, CHALLENGE_TYPES } from './types/alarmTypes';

// Importar componentes
import AlarmItem from './components/AlarmItem';
import AddAlarmModal from './components/AddAlarmModal';
import EditAlarmModal from './components/EditAlarmModal';
import AlarmChallengeModal from './components/AlarmChallengeModal';
import DebugPanel from './components/DebugPanel';

const SmartAlarmApp = () => {
  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 44;
  
  // Estados principais
  const [alarms, setAlarms] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAlarmModal, setShowAlarmModal] = useState(false);
  const [activeAlarm, setActiveAlarm] = useState(null);
  const [editingAlarm, setEditingAlarm] = useState(null);
  
  // Estados para desafios
  const [mathChallenge, setMathChallenge] = useState(null);
  const [shakeCount, setShakeCount] = useState(0);
  const [requiredShakes, setRequiredShakes] = useState(0);
  
  // Referências
  const notificationListeners = useRef(null);
  const alarmCheckInterval = useRef(null);
  const appInitialized = useRef(false);

  // Inicialização do app
  useEffect(() => {
    initializeApp();
    
    return () => {
      cleanup();
    };
  }, []);

  const initializeApp = async () => {
    if (appInitialized.current) return;
    appInitialized.current = true;

    console.log('Inicializando app...');
    
    // Solicitar permissões
    await NotificationService.requestPermissions();
    
    // Carregar alarmes salvos
    await loadAlarms();
    
    // Configurar listeners de notificação
    setupNotificationListeners();
    
    // Iniciar verificação em tempo real
    startAlarmChecking();
  };

  const cleanup = () => {
    // Limpar listeners
    if (notificationListeners.current) {
      NotificationService.removeNotificationListeners(notificationListeners.current);
    }
    
    // Parar verificação de alarmes
    if (alarmCheckInterval.current) {
      clearInterval(alarmCheckInterval.current);
    }
    
    // Parar sensores
    SensorService.stopShakeDetection();
    
    // Parar áudio
    AudioService.stopSound();
  };

  const setupNotificationListeners = () => {
    notificationListeners.current = NotificationService.setupNotificationListeners(
      handleAlarmNotification,
      handleAlarmNotification
    );
  };

  // Verificação em tempo real dos alarmes
  const startAlarmChecking = () => {
    alarmCheckInterval.current = setInterval(() => {
      checkAlarms();
    }, 30000); // Verifica a cada 30 segundos
  };

  const checkAlarms = () => {
    const now = new Date();
    const currentTime = TimeUtils.formatTime(now);
    
    console.log('Verificando alarmes:', currentTime);
    
    alarms.forEach(alarm => {
      if (alarm.isActive && alarm.time === currentTime && !alarm.isTriggered) {
        console.log('Alarm triggered by interval check:', alarm.time);
        triggerAlarm(alarm);
      }
    });
  };

  const handleAlarmNotification = async (alarmData) => {
    console.log('Notificação de alarme recebida:', alarmData);
    const alarm = alarms.find(a => a.id === alarmData.alarmId);
    if (alarm) {
      console.log('Alarm triggered by notification:', alarm.time);
      await triggerAlarm(alarm);
    }
  };

  // Gerenciamento de alarmes
  const loadAlarms = async () => {
    try {
      const savedAlarms = await StorageService.loadAlarms();
      console.log('Alarmes carregados:', savedAlarms);
      setAlarms(savedAlarms);
      
      // Reagendar notificações para alarmes ativos
      savedAlarms.forEach(alarm => {
        if (alarm.isActive) {
          scheduleAlarmNotification(alarm);
        }
      });
    } catch (error) {
      console.error('Erro ao carregar alarmes:', error);
    }
  };

  const saveAlarms = async (alarmsToSave) => {
    try {
      await StorageService.saveAlarms(alarmsToSave);
    } catch (error) {
      console.error('Erro ao salvar alarmes:', error);
    }
  };

  const scheduleAlarmNotification = async (alarm) => {
    try {
      const notificationId = await NotificationService.scheduleAlarmNotification(alarm);
      
      // Atualizar alarme com ID da notificação
      setAlarms(prev => prev.map(a => 
        a.id === alarm.id ? { ...a, notificationId } : a
      ));
      
      return notificationId;
    } catch (error) {
      console.error('Erro ao agendar alarme:', error);
      return null;
    }
  };

  const addAlarm = async (alarmData) => {
    try {
      const newAlarm = createAlarm(
        alarmData.time,
        alarmData.label,
        alarmData.challenge,
        alarmData.difficulty
      );
      
      // Agendar notificação
      const notificationId = await scheduleAlarmNotification(newAlarm);
      newAlarm.notificationId = notificationId;
      
      const updatedAlarms = [...alarms, newAlarm];
      setAlarms(updatedAlarms);
      await saveAlarms(updatedAlarms);
      
      // Mostrar notificação de confirmação (SEM SOM)
      await NotificationService.showAlarmConfirmation(newAlarm);
      
      setShowAddModal(false);
      
      console.log('Alarme adicionado:', newAlarm);
    } catch (error) {
      console.error('Erro ao adicionar alarme:', error);
      Alert.alert('Erro', 'Não foi possível adicionar o alarme.');
    }
  };

  const editAlarm = async (updatedAlarm) => {
    try {
      // Cancelar notificação anterior
      if (updatedAlarm.notificationId) {
        await NotificationService.cancelNotification(updatedAlarm.notificationId);
      }
      
      // Agendar nova notificação se ativo
      let notificationId = null;
      if (updatedAlarm.isActive) {
        notificationId = await scheduleAlarmNotification(updatedAlarm);
      }
      
      const finalAlarm = { ...updatedAlarm, notificationId };
      
      const updatedAlarms = alarms.map(a => 
        a.id === updatedAlarm.id ? finalAlarm : a
      );
      
      setAlarms(updatedAlarms);
      await saveAlarms(updatedAlarms);
      
      setShowEditModal(false);
      setEditingAlarm(null);
    } catch (error) {
      console.error('Erro ao editar alarme:', error);
      Alert.alert('Erro', 'Não foi possível editar o alarme.');
    }
  };

  const toggleAlarm = async (id) => {
    try {
      const updatedAlarms = await Promise.all(alarms.map(async (alarm) => {
        if (alarm.id === id) {
          const updatedAlarm = { 
            ...alarm, 
            isActive: !alarm.isActive, 
            isTriggered: false 
          };
          
          if (updatedAlarm.isActive) {
            // Agendar notificação
            const notificationId = await scheduleAlarmNotification(updatedAlarm);
            updatedAlarm.notificationId = notificationId;
          } else {
            // Cancelar notificação
            await NotificationService.cancelNotification(updatedAlarm.notificationId);
            updatedAlarm.notificationId = null;
          }
          
          return updatedAlarm;
        }
        return alarm;
      }));
      
      setAlarms(updatedAlarms);
      await saveAlarms(updatedAlarms);
    } catch (error) {
      console.error('Erro ao alternar alarme:', error);
    }
  };

  const deleteAlarm = async (id) => {
    try {
      const alarmToDelete = alarms.find(a => a.id === id);
      if (alarmToDelete?.notificationId) {
        await NotificationService.cancelNotification(alarmToDelete.notificationId);
      }
      
      const updatedAlarms = alarms.filter(alarm => alarm.id !== id);
      setAlarms(updatedAlarms);
      await saveAlarms(updatedAlarms);
    } catch (error) {
      console.error('Erro ao excluir alarme:', error);
    }
  };

  // Funções de edição
  const handleEditAlarm = (alarm) => {
    setEditingAlarm(alarm);
    setShowEditModal(true);
  };

  // Gerenciamento de desafios
  const triggerAlarm = async (alarm) => {
    try {
      console.log('Triggering alarm:', alarm.time);
      
      // Tocar som do alarme
      await AudioService.playAlarmSound();
      
      // Preparar desafio
      if (alarm.challenge === CHALLENGE_TYPES.MATH) {
        const challenge = ChallengeService.generateMathChallenge(alarm.difficulty);
        setMathChallenge(challenge);
      } else if (alarm.challenge === CHALLENGE_TYPES.SHAKE) {
        setRequiredShakes(alarm.difficulty);
        setShakeCount(0);
        startShakeDetection();
      }
      
      // Marcar alarme como acionado
      const updatedAlarms = alarms.map(a => 
        a.id === alarm.id ? { ...a, isTriggered: true } : a
      );
      setAlarms(updatedAlarms);
      await saveAlarms(updatedAlarms);
      
      setActiveAlarm(alarm);
      setShowAlarmModal(true);
    } catch (error) {
      console.error('Erro ao acionar alarme:', error);
    }
  };

  const startShakeDetection = () => {
    SensorService.startShakeDetection(() => {
      setShakeCount(prev => prev + 1);
    });
  };

  const checkMathAnswers = () => {
    const isCorrect = ChallengeService.checkMathAnswers(mathChallenge);
    
    if (isCorrect) {
      dismissAlarm();
      Alert.alert('Parabéns!', 'Todas as respostas estão corretas!');
    } else {
      Alert.alert('Erro', 'Algumas respostas estão incorretas. Tente novamente.');
    }
  };

  const updateMathAnswer = (index, answer) => {
    const updatedChallenge = ChallengeService.updateMathAnswer(mathChallenge, index, answer);
    setMathChallenge(updatedChallenge);
  };

  const dismissAlarm = async () => {
    try {
      // Parar som
      await AudioService.stopSound();
      
      // Parar sensores
      SensorService.stopShakeDetection();
      
      // Reagendar alarme se estava ativo
      if (activeAlarm && activeAlarm.isActive) {
        await scheduleAlarmNotification(activeAlarm);
      }
      
      // Reset dos estados
      setShowAlarmModal(false);
      setActiveAlarm(null);
      setMathChallenge(null);
      setShakeCount(0);
      setRequiredShakes(0);
    } catch (error) {
      console.error('Erro ao desligar alarme:', error);
    }
  };

  // Efeito para verificar conclusão do desafio de chacoalhar
  useEffect(() => {
    // Só verificar se há um desafio ativo e valores válidos
    if (requiredShakes > 0 && shakeCount > 0 && ChallengeService.isShakeChallengeComplete(shakeCount, requiredShakes)) {
      dismissAlarm();
      Alert.alert('Parabéns!', `Você chacoalhou ${shakeCount} vezes!`);
    }
  }, [shakeCount, requiredShakes]);

  // Renderização dos alarmes
  const renderAlarm = ({ item }) => (
    <AlarmItem
      alarm={item}
      onToggle={toggleAlarm}
      onDelete={deleteAlarm}
      onEdit={handleEditAlarm}
    />
  );

  return (
    <View style={[styles.container, { paddingTop: statusBarHeight }]}>
      <StatusBar backgroundColor="#f8f9fa" barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Smart Alarm</Text>
        <Text style={styles.subtitle}>
          {alarms.filter(a => a.isActive).length} alarmes ativos
        </Text>
      </View>
      
      <FlatList
        data={alarms.sort((a, b) => TimeUtils.compareTimeStrings(a.time, b.time))}
        renderItem={renderAlarm}
        keyExtractor={item => item.id.toString()}
        style={styles.alarmsList}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      />
      
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setShowAddModal(true)}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>

      {/* Modal para adicionar alarme */}
      <AddAlarmModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={addAlarm}
      />

      {/* Modal para editar alarme */}
      <EditAlarmModal
        visible={showEditModal}
        alarm={editingAlarm}
        onClose={() => {
          setShowEditModal(false);
          setEditingAlarm(null);
        }}
        onSave={editAlarm}
        onDelete={deleteAlarm}
      />

      {/* Modal do alarme ativo */}
      <AlarmChallengeModal
        visible={showAlarmModal}
        alarm={activeAlarm}
        mathChallenge={mathChallenge}
        onMathAnswerChange={updateMathAnswer}
        onCheckMathAnswers={checkMathAnswers}
        shakeCount={shakeCount}
        requiredShakes={requiredShakes}
        onDismiss={dismissAlarm}
      />

      {/* Painel de Debug (apenas em desenvolvimento) */}
      {__DEV__ && <DebugPanel alarms={alarms} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  alarmsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  addButton: {
    position: 'absolute',
    bottom: 40,
    right: 30,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});

export default SmartAlarmApp; d