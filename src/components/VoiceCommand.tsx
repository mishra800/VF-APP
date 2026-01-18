import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  Animated,
} from 'react-native';

interface VoiceCommandProps {
  visible: boolean;
  onClose: () => void;
  onVoiceResult: (text: string) => void;
}

const VoiceCommand: React.FC<VoiceCommandProps> = ({
  visible,
  onClose,
  onVoiceResult,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [pulseAnim] = useState(new Animated.Value(1));

  const startListening = () => {
    setIsListening(true);
    
    // Start pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Simulate voice recognition for demo
    setTimeout(() => {
      stopListening();
      const mockResults = [
        'Red Toyota Camry license plate ABC123 seized at Main Street for parking violation',
        'Blue Honda Civic plate XYZ789 towed from downtown area for expired registration',
        'White Ford Focus license DEF456 impounded at City Hall for unpaid tickets',
        'Black Nissan Altima plate GHI789 seized on Oak Avenue for illegal parking',
      ];
      
      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
      
      Alert.alert(
        '🎤 Voice Recognized!',
        `"${randomResult}"\n\nThis will help fill out your report automatically.`,
        [
          { text: 'Try Again', onPress: () => {} },
          {
            text: 'Use This',
            onPress: () => {
              onVoiceResult(randomResult);
              onClose();
            },
          },
        ]
      );
    }, 3000);
  };

  const stopListening = () => {
    setIsListening(false);
    pulseAnim.stopAnimation();
    pulseAnim.setValue(1);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>🎤 Voice Command</Text>
            <Text style={styles.subtitle}>Speak your report details</Text>
          </View>

          <View style={styles.voiceArea}>
            <Animated.View
              style={[
                styles.microphoneButton,
                {
                  transform: [{ scale: pulseAnim }],
                  backgroundColor: isListening ? '#dc3545' : '#007bff',
                },
              ]}
            >
              <TouchableOpacity
                onPress={isListening ? stopListening : startListening}
                style={styles.micButton}
              >
                <Text style={styles.micIcon}>
                  {isListening ? '⏹️' : '🎤'}
                </Text>
              </TouchableOpacity>
            </Animated.View>

            <Text style={styles.statusText}>
              {isListening ? 'Listening... Speak now!' : 'Tap microphone to start'}
            </Text>

            {isListening && (
              <View style={styles.listeningIndicator}>
                <Text style={styles.listeningText}>🔴 Recording</Text>
                <Text style={styles.listeningSubtext}>
                  Say something like: "Red car, license ABC123, parked illegally on Main Street"
                </Text>
              </View>
            )}
          </View>

          <View style={styles.instructions}>
            <Text style={styles.instructionTitle}>💡 Voice Tips:</Text>
            <Text style={styles.instructionText}>
              • Speak clearly and slowly
            </Text>
            <Text style={styles.instructionText}>
              • Include car color, make, and license plate
            </Text>
            <Text style={styles.instructionText}>
              • Mention location and reason for seizure
            </Text>
            <Text style={styles.instructionText}>
              • Speak in a quiet environment
            </Text>
          </View>

          <View style={styles.exampleSection}>
            <Text style={styles.exampleTitle}>📝 Example:</Text>
            <Text style={styles.exampleText}>
              "Blue Honda Civic, license plate XYZ123, seized at downtown parking lot for expired registration"
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            {!isListening && (
              <TouchableOpacity style={styles.startButton} onPress={startListening}>
                <Text style={styles.startButtonText}>🎤 Start Voice Command</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => {
                if (isListening) stopListening();
                onClose();
              }}
            >
              <Text style={styles.closeButtonText}>
                {isListening ? 'Cancel' : 'Close'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 20,
    margin: 20,
    width: '90%',
    maxHeight: '85%',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  voiceArea: {
    padding: 40,
    alignItems: 'center',
  },
  microphoneButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  micButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  micIcon: {
    fontSize: 40,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  listeningIndicator: {
    backgroundColor: '#fff5f5',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fecaca',
    alignItems: 'center',
  },
  listeningText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#dc3545',
    marginBottom: 5,
  },
  listeningSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  instructions: {
    backgroundColor: '#f8f9fa',
    margin: 20,
    padding: 15,
    borderRadius: 8,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  exampleSection: {
    backgroundColor: '#e7f3ff',
    margin: 20,
    marginTop: 0,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#b3d9ff',
  },
  exampleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0066cc',
    marginBottom: 8,
  },
  exampleText: {
    fontSize: 14,
    color: '#0066cc',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  buttonContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  startButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 15,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#666',
    fontSize: 16,
  },
});

export default VoiceCommand;