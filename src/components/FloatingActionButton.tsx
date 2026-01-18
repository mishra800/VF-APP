import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';

interface FloatingActionButtonProps {
  onNewReport: () => void;
  onQRScan: () => void;
  onVoiceReport: () => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onNewReport,
  onQRScan,
  onVoiceReport,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const toggleMenu = () => {
    const toValue = isOpen ? 0 : 1;
    
    Animated.spring(animation, {
      toValue,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
    
    setIsOpen(!isOpen);
  };

  const rotation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  const translateY1 = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -70],
  });

  const translateY2 = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -130],
  });

  const translateY3 = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -190],
  });

  return (
    <View style={styles.container}>
      {/* Voice Report Button */}
      <Animated.View
        style={[
          styles.actionButton,
          styles.voiceButton,
          { transform: [{ translateY: translateY3 }] },
        ]}
      >
        <TouchableOpacity onPress={onVoiceReport}>
          <Text style={styles.actionIcon}>🎤</Text>
        </TouchableOpacity>
        <Text style={styles.actionLabel}>Voice</Text>
      </Animated.View>

      {/* QR Scan Button */}
      <Animated.View
        style={[
          styles.actionButton,
          styles.qrButton,
          { transform: [{ translateY: translateY2 }] },
        ]}
      >
        <TouchableOpacity onPress={onQRScan}>
          <Text style={styles.actionIcon}>📱</Text>
        </TouchableOpacity>
        <Text style={styles.actionLabel}>QR Scan</Text>
      </Animated.View>

      {/* New Report Button */}
      <Animated.View
        style={[
          styles.actionButton,
          styles.reportButton,
          { transform: [{ translateY: translateY1 }] },
        ]}
      >
        <TouchableOpacity onPress={onNewReport}>
          <Text style={styles.actionIcon}>📝</Text>
        </TouchableOpacity>
        <Text style={styles.actionLabel}>Report</Text>
      </Animated.View>

      {/* Main FAB */}
      <TouchableOpacity style={styles.fab} onPress={toggleMenu}>
        <Animated.Text
          style={[styles.fabIcon, { transform: [{ rotate: rotation }] }]}
        >
          +
        </Animated.Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    alignItems: 'center',
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabIcon: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  actionButton: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  reportButton: {
    backgroundColor: '#28a745',
  },
  qrButton: {
    backgroundColor: '#17a2b8',
  },
  voiceButton: {
    backgroundColor: '#ffc107',
  },
  actionIcon: {
    fontSize: 20,
  },
  actionLabel: {
    position: 'absolute',
    right: 60,
    fontSize: 12,
    color: '#333',
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontWeight: '500',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});

export default FloatingActionButton;