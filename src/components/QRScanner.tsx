import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';

interface QRScannerProps {
  visible: boolean;
  onClose: () => void;
  onScanResult: (data: string) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({
  visible,
  onClose,
  onScanResult,
}) => {
  // Simulate QR scan for demo
  const simulateScan = () => {
    const mockVINs = [
      '1HGBH41JXMN109186',
      '2FMDK3GC4DBA12345',
      '3VWDX7AJ9DM123456',
      '4T1BF1FK5DU123789',
    ];
    
    const randomVIN = mockVINs[Math.floor(Math.random() * mockVINs.length)];
    
    Alert.alert(
      '📱 QR Code Scanned!',
      `Vehicle VIN: ${randomVIN}\n\nThis will auto-fill the VIN field in your report.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Use VIN',
          onPress: () => {
            onScanResult(randomVIN);
            onClose();
          },
        },
      ]
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>📱 QR Scanner</Text>
            <Text style={styles.subtitle}>Scan vehicle QR code or VIN</Text>
          </View>

          <View style={styles.scanArea}>
            <View style={styles.scanFrame}>
              <Text style={styles.scanIcon}>📱</Text>
              <Text style={styles.scanText}>Point camera at QR code</Text>
              <Text style={styles.scanSubtext}>
                QR codes are usually found on:
              </Text>
              <Text style={styles.scanTip}>• Vehicle registration</Text>
              <Text style={styles.scanTip}>• Insurance documents</Text>
              <Text style={styles.scanTip}>• Vehicle inspection stickers</Text>
            </View>
          </View>

          <View style={styles.instructions}>
            <Text style={styles.instructionTitle}>💡 How to use:</Text>
            <Text style={styles.instructionText}>
              1. Hold phone steady over QR code
            </Text>
            <Text style={styles.instructionText}>
              2. Make sure code is clearly visible
            </Text>
            <Text style={styles.instructionText}>
              3. Wait for automatic scan
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.demoButton} onPress={simulateScan}>
              <Text style={styles.demoButtonText}>📱 Demo Scan</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 20,
    margin: 20,
    width: '90%',
    maxHeight: '80%',
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
  scanArea: {
    padding: 30,
    alignItems: 'center',
  },
  scanFrame: {
    width: 200,
    height: 200,
    borderWidth: 3,
    borderColor: '#007bff',
    borderRadius: 20,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9ff',
  },
  scanIcon: {
    fontSize: 48,
    marginBottom: 15,
  },
  scanText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  scanSubtext: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
  },
  scanTip: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 2,
  },
  instructions: {
    backgroundColor: '#fff3cd',
    margin: 20,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffeaa7',
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 14,
    color: '#856404',
    marginBottom: 5,
  },
  buttonContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  demoButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  demoButtonText: {
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

export default QRScanner;