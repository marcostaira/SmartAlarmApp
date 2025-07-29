# 🚀 Smart Alarm - Alarme Inteligente com Desafios

<div align="center">

![Smart Alarm Logo](https://img.shields.io/badge/Smart%20Alarm-v1.0.0-blue?style=for-the-badge&logo=react)
![React Native](https://img.shields.io/badge/React%20Native-0.73.4-61DAFB?style=for-the-badge&logo=react)
![Expo](https://img.shields.io/badge/Expo-50.0.0-000020?style=for-the-badge&logo=expo)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**O alarme que te desafia a acordar de verdade! 🧠💪**

_Chega de apertar "soneca" sem nem perceber. Com o Smart Alarm, você precisa resolver desafios para desligar o alarme._

[📱 Demo](#-demo) • [🚀 Instalação](#-instalação) • [⭐ Features](#-features) • [🎯 Como Usar](#-como-usar)

</div>

---

## 🎯 **Por que usar o Smart Alarm?**

🛌 **Problema:** Você acorda, aperta "soneca" no piloto automático, e volta a dormir  
💡 **Solução:** Agora você precisa **resolver problemas** para desligar o alarme!

### 🧮 **Desafio Matemático**

Resolva de 1 a 5 contas matemáticas aleatórias

- ➕ Soma, ➖ Subtração, ✖️ Multiplicação
- 🎚️ Dificuldade configurável
- 🧠 Acorda seu cérebro instantaneamente

### 📱 **Desafio de Movimento**

Chacoalhe o celular de 3 a 5 vezes

- 🔄 Usa o acelerômetro do dispositivo
- 💪 Te faz se mexer fisicamente
- ⚡ Desperta seu corpo

---

## ⭐ **Features Incríveis**

### 🎨 **Interface Moderna**

- ✨ Design limpo e intuitivo
- 🌙 Otimizado para uso matinal
- 🎯 Gestos naturais (swipe para excluir)
- 🔄 Switch elegante para ativar/desativar

### 🔧 **Funcionalidades Avançadas**

- 📅 **Múltiplos alarmes** - Configure quantos quiser
- ✏️ **Edição fácil** - Toque no alarme para editar
- 🏷️ **Etiquetas personalizadas** - "Trabalho", "Academia", etc.
- 💾 **Persistência automática** - Seus alarmes salvos para sempre
- 🔔 **Notificações inteligentes** - Funcionam mesmo com app fechado

### 🛠️ **Tecnologia Robusta**

- 📱 **React Native + Expo** - Performance nativa
- 🏗️ **Arquitetura modular** - Código bem organizado
- 🔍 **Painel de debug** - Para desenvolvedores
- ⚡ **Verificação dupla** - Garante que o alarme sempre toca

---

## 📱 **Demo**

<div align="center">

### 🎬 **Como funciona:**

|                                  1. Configure o Alarme                                  |                                   2. Escolha o Desafio                                   |                              3. Desperte com Propósito                              |
| :-------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------: |
| ![Create Alarm](https://via.placeholder.com/200x400/2196F3/FFFFFF?text=⏰+Criar+Alarme) | ![Challenge](https://via.placeholder.com/200x400/4CAF50/FFFFFF?text=🧮+Escolher+Desafio) | ![Wake Up](https://via.placeholder.com/200x400/FF4444/FFFFFF?text=🚀+Acordar+Ativo) |
|                         Defina horário, etiqueta e dificuldade                          |                              Matemática ou movimento físico                              |                           Resolva o desafio para desligar                           |

</div>

---

## 🚀 **Instalação**

### 📋 **Pré-requisitos**

- Node.js 16+
- Expo CLI
- Android Studio ou Expo Go app

### ⚡ **Instalação Rápida**

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/smart-alarm-app.git
cd smart-alarm-app

# Instale as dependências
npm install

# Execute o projeto
npm start

# Para Android
npm run android
```

### 📱 **Teste no seu celular**

1. Instale o **Expo Go** na Play Store
2. Escaneie o QR code que aparece no terminal
3. Pronto! O app abre no seu celular

---

## 🎯 **Como Usar**

### ➕ **Criar Alarme**

1. Toque no botão **+**
2. Escolha o **horário**
3. Adicione uma **etiqueta** (opcional)
4. Selecione o **tipo de desafio**
5. Configure a **dificuldade** (1-5)
6. Salve e aguarde a notificação de confirmação

### ✏️ **Editar Alarme**

- **Toque** em qualquer alarme para editar
- **Arraste para esquerda** para excluir
- **Use o switch** para ativar/desativar

### 🏆 **Desafios Disponíveis**

#### 🧮 **Matemática**

- **Dificuldade 1:** 1 conta simples
- **Dificuldade 5:** 5 contas complexas
- Todas as respostas devem estar corretas

#### 📱 **Chacoalhar**

- **Dificuldade 1:** 1 chacoalhada
- **Dificuldade 5:** 5 chacoalhadas
- Sensor detecta movimento automático

---

## 🏗️ **Arquitetura**

```
📁 Smart Alarm App
├── 🎨 components/          # Componentes UI reutilizáveis
│   ├── AlarmItem.js       # Item da lista com gestos
│   ├── AddAlarmModal.js   # Modal de criação
│   ├── EditAlarmModal.js  # Modal de edição
│   └── AlarmChallenge.js  # Interface dos desafios
├── ⚙️ services/           # Lógica de negócio
│   ├── notificationService.js  # Gerencia notificações
│   ├── storageService.js       # Persistência local
│   ├── audioService.js         # Controle de áudio
│   └── challengeService.js     # Lógica dos desafios
├── 🛠️ utils/             # Utilitários
│   └── timeUtils.js       # Funções de tempo
└── 📋 types/              # Definições e constantes
    └── alarmTypes.js      # Tipos e interfaces
```

---

## 🤝 **Contribuindo**

Adoramos contribuições! Aqui estão algumas maneiras de ajudar:

### 🐛 **Reportar Bugs**

- Use o painel de debug (botão 🐛 no app)
- Abra uma [issue](../../issues) com detalhes

### ✨ **Sugerir Features**

- 🔄 Alarmes recorrentes (seg-sex, fins de semana)
- 🎵 Múltiplos sons de alarme
- 📊 Estatísticas de uso
- 🌙 Modo escuro
- ☁️ Backup na nuvem

### 🔧 **Desenvolver**

```bash
# Fork o projeto
# Crie uma branch para sua feature
git checkout -b feature/nova-funcionalidade

# Commit suas mudanças
git commit -m "Adiciona nova funcionalidade incrível"

# Push para sua branch
git push origin feature/nova-funcionalidade

# Abra um Pull Request
```

---

## 📊 **Roadmap**

### 🎯 **v1.1** (Próxima versão)

- [ ] 🔄 Alarmes recorrentes
- [ ] 🎵 Sons customizáveis
- [ ] 📊 Estatísticas de desempenho
- [ ] 🌙 Modo escuro

### 🚀 **v2.0** (Futuro)

- [ ] ☁️ Sincronização na nuvem
- [ ] 👥 Compartilhamento de alarmes
- [ ] 🎮 Novos tipos de desafio
- [ ] 📱 Widget para tela inicial

---

## 🙏 **Créditos**

### 🛠️ **Tecnologias Utilizadas**

- [React Native](https://reactnative.dev/) - Framework mobile
- [Expo](https://expo.dev/) - Plataforma de desenvolvimento
- [Expo Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/) - Sistema de notificações
- [Expo Sensors](https://docs.expo.dev/versions/latest/sdk/sensors/) - Acelerômetro
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) - Persistência local

### 💡 **Inspiração**

Criado para resolver o problema universal de **não conseguir acordar cedo**. Inspirado nos melhores apps de alarme, mas com uma abordagem única de **gamificação** e **desafios cognitivos**.

---

## 📄 **Licença**

Este projeto está licenciado sob a MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

<div align="center">

### 🌟 **Gostou do projeto? Deixe uma estrela!**

**Desenvolvido com ❤️ para pessoas que querem acordar melhor**

[⬆️ Voltar ao topo](#-smart-alarm---alarme-inteligente-com-desafios)

</div>
