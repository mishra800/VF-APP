import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';

interface PhotoHelperProps {
  visible: boolean;
  onClose: () => void;
  onTakePhoto: () => void;
}

const PhotoHelper: React.FC<PhotoHelperProps> = ({
  visible,
  onClose,
  onTakePhoto,
}) => {
  const photoTips = [
    {
      icon: '🚗',
      title: 'Full Car Photo',
      description: 'Take a photo showing the entire car from the side'
    },
    {
      icon: '🔢',
      title: 'License Plate',
      description: 'Take a clear close-up photo of the license plate'
    },
    {
      icon: '💥',
      title: 'Any Damage',
      description: 'If there is damage, take close-up photos'
    },
    {
      icon: '📍',
      title: 'Location',
      description: 'Take a photo showing where the car is located'
    }
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>📸 Photo Guide</Text>
            <Text style={styles.subtitle}>Take these 4 types of photos</Text>
          </View>

          <ScrollView style={styles.content}>
            {photoTips.map((tip, index) => (
              <View key={index} style={styles.tipCard}>
                <Text style={styles.tipIcon}>{tip.icon}</Text>
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>{tip.title}</Text>
                  <Text style={styles.tipDescription}>{tip.description}</Text>
                </View>
              </View>
            ))}

            <View style={styles.reminderCard}>
              <Text style={styles.reminderIcon}>💡</Text>
              <Text style={styles.reminderTitle}>Remember:</Text>
              <Text style={styles.reminderText}>• Take photos in good light</Text>
              <Text style={styles.reminderText}>• Hold phone steady</Text>
              <Text style={styles.reminderText}>• Make sure photos are clear</Text>
              <Text style={styles.reminderText}>• Take at least 3-4 photos</Text>
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.takePhotoButton}
              onPress={() => {
                onClose();
                onTakePhoto();
              }}
            >
              <Text style={styles.takePhotoText}>📸 Start Taking Photos</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Maybe Later</Text>
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
    maxHeight: '80%',
    width: '90%',
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
  content: {
    padding: 20,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  tipIcon: {
    fontSize: 30,
    marginRight: 15,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  tipDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  reminderCard: {
    backgroundColor: '#fff3cd',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ffeaa7',
    marginTop: 10,
  },
  reminderIcon: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 10,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 10,
    textAlign: 'center',
  },
  reminderText: {
    fontSize: 14,
    color: '#856404',
    marginBottom: 5,
  },
  buttonContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  takePhotoButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  takePhotoText: {
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

export default PhotoHelper;