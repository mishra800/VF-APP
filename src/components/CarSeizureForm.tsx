import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { launchImageLibrary, launchCamera, MediaType } from 'react-native-image-picker';
import { CarSeizure } from '../types';
import SeizureService from '../services/SeizureService';
import VFLogo from './VFLogo';
import PhotoHelper from './PhotoHelper';

interface CarSeizureFormProps {
  navigation: any;
  route: any;
}

const CarSeizureForm: React.FC<CarSeizureFormProps> = ({ navigation, route }) => {
  const { user } = route.params || {};
  
  const [carDetails, setCarDetails] = useState({
    make: '',
    model: '',
    year: '',
    color: '',
    licensePlate: '',
    vin: '',
  });

  const [seizureDetails, setSeizureDetails] = useState({
    location: '',
    reason: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0].slice(0, 5),
    notes: '',
  });

  const [media, setMedia] = useState({
    photos: [] as string[],
    videos: [] as string[],
  });

  const [loading, setLoading] = useState(false);
  const [showPhotoHelper, setShowPhotoHelper] = useState(false);

  const handleImagePicker = () => {
    setShowPhotoHelper(true);
  };

  const handleTakePhoto = () => {
    Alert.alert(
      '📸 Add Photos',
      'Choose how to add photos',
      [
        { text: '📷 Camera', onPress: () => openCamera('photo') },
        { text: '📁 Gallery', onPress: () => openGallery('photo') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleVideoPicker = () => {
    Alert.alert(
      'Select Video',
      'Choose an option',
      [
        { text: 'Camera', onPress: () => openCamera('video') },
        { text: 'Gallery', onPress: () => openGallery('video') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const openCamera = (type: 'photo' | 'video') => {
    const mediaType: MediaType = type === 'photo' ? 'photo' : 'video';
    
    launchCamera(
      {
        mediaType,
        quality: 0.8,
        videoQuality: 'medium',
      },
      (response) => {
        if (response.assets && response.assets[0]) {
          const asset = response.assets[0];
          if (asset.uri) {
            if (type === 'photo') {
              setMedia(prev => ({
                ...prev,
                photos: [...prev.photos, asset.uri!],
              }));
            } else {
              setMedia(prev => ({
                ...prev,
                videos: [...prev.videos, asset.uri!],
              }));
            }
          }
        }
      }
    );
  };

  const openGallery = (type: 'photo' | 'video') => {
    const mediaType: MediaType = type === 'photo' ? 'photo' : 'video';
    
    launchImageLibrary(
      {
        mediaType,
        quality: 0.8,
        selectionLimit: type === 'photo' ? 5 : 1,
      },
      (response) => {
        if (response.assets) {
          const uris = response.assets.map(asset => asset.uri!).filter(Boolean);
          if (type === 'photo') {
            setMedia(prev => ({
              ...prev,
              photos: [...prev.photos, ...uris],
            }));
          } else {
            setMedia(prev => ({
              ...prev,
              videos: [...prev.videos, ...uris],
            }));
          }
        }
      }
    );
  };

  const removePhoto = (index: number) => {
    setMedia(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const removeVideo = (index: number) => {
    setMedia(prev => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!carDetails.make || !carDetails.model || !carDetails.licensePlate) {
      Alert.alert('Error', 'Please fill in required car details (Make, Model, License Plate)');
      return;
    }

    if (!seizureDetails.location || !seizureDetails.reason) {
      Alert.alert('Error', 'Please fill in required seizure details (Location, Reason)');
      return;
    }

    if (media.photos.length === 0) {
      Alert.alert('Error', 'Please add at least one photo');
      return;
    }

    setLoading(true);

    try {
      const seizureService = SeizureService.getInstance();
      const seizureData: Omit<CarSeizure, 'id' | 'createdAt' | 'status'> = {
        userId: user?.id || '2', // Default to user1 if no user provided
        carDetails,
        seizureDetails,
        media,
      };

      const result = await seizureService.submitSeizure(seizureData);

      if (result.success) {
        Alert.alert(
          'Success',
          'Car seizure report submitted successfully!',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } else {
        Alert.alert('Error', 'Failed to submit seizure report. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to submit seizure report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <VFLogo size={50} />
        <Text style={styles.title}>Vehicle Seizure Report</Text>
        <Text style={styles.subtitle}>Vehicle Force</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Car Details</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Make *"
          value={carDetails.make}
          onChangeText={(text) => setCarDetails(prev => ({ ...prev, make: text }))}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Model *"
          value={carDetails.model}
          onChangeText={(text) => setCarDetails(prev => ({ ...prev, model: text }))}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Year"
          value={carDetails.year}
          onChangeText={(text) => setCarDetails(prev => ({ ...prev, year: text }))}
          keyboardType="numeric"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Color"
          value={carDetails.color}
          onChangeText={(text) => setCarDetails(prev => ({ ...prev, color: text }))}
        />
        
        <TextInput
          style={styles.input}
          placeholder="License Plate *"
          value={carDetails.licensePlate}
          onChangeText={(text) => setCarDetails(prev => ({ ...prev, licensePlate: text }))}
        />
        
        <TextInput
          style={styles.input}
          placeholder="VIN (Optional)"
          value={carDetails.vin}
          onChangeText={(text) => setCarDetails(prev => ({ ...prev, vin: text }))}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Seizure Details</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Location *"
          value={seizureDetails.location}
          onChangeText={(text) => setSeizureDetails(prev => ({ ...prev, location: text }))}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Reason for Seizure *"
          value={seizureDetails.reason}
          onChangeText={(text) => setSeizureDetails(prev => ({ ...prev, reason: text }))}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Date"
          value={seizureDetails.date}
          onChangeText={(text) => setSeizureDetails(prev => ({ ...prev, date: text }))}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Time"
          value={seizureDetails.time}
          onChangeText={(text) => setSeizureDetails(prev => ({ ...prev, time: text }))}
        />
        
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Additional Notes"
          value={seizureDetails.notes}
          onChangeText={(text) => setSeizureDetails(prev => ({ ...prev, notes: text }))}
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Media</Text>
        
        <View style={styles.mediaButtons}>
          <TouchableOpacity style={styles.mediaButton} onPress={handleImagePicker}>
            <Text style={styles.mediaButtonIcon}>📸</Text>
            <Text style={styles.mediaButtonText}>Add Photos</Text>
            <Text style={styles.mediaButtonSubtext}>Tap for help</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.mediaButton} onPress={handleVideoPicker}>
            <Text style={styles.mediaButtonIcon}>🎥</Text>
            <Text style={styles.mediaButtonText}>Add Videos</Text>
            <Text style={styles.mediaButtonSubtext}>Optional</Text>
          </TouchableOpacity>
        </View>

        {media.photos.length > 0 && (
          <View style={styles.mediaSection}>
            <Text style={styles.mediaTitle}>📸 Photos ({media.photos.length})</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {media.photos.map((photo, index) => (
                <View key={index} style={styles.mediaItem}>
                  <Image source={{ uri: photo }} style={styles.photo} />
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removePhoto(index)}
                  >
                    <Text style={styles.removeButtonText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {media.videos.length > 0 && (
          <View style={styles.mediaSection}>
            <Text style={styles.mediaTitle}>🎥 Videos ({media.videos.length})</Text>
            {media.videos.map((video, index) => (
              <View key={index} style={styles.videoItem}>
                <Text style={styles.videoText}>🎥 Video {index + 1}</Text>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeVideo(index)}
                >
                  <Text style={styles.removeButtonText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>

      <PhotoHelper
        visible={showPhotoHelper}
        onClose={() => setShowPhotoHelper(false)}
        onTakePhoto={handleTakePhoto}
      />

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Submit Report</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 5,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  mediaButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  mediaButton: {
    flex: 1,
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  mediaButtonIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  mediaButtonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
    marginBottom: 2,
  },
  mediaButtonSubtext: {
    color: '#fff',
    fontSize: 11,
    opacity: 0.8,
  },
  mediaSection: {
    marginBottom: 15,
  },
  mediaTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    color: '#333',
  },
  mediaItem: {
    position: 'relative',
    marginRight: 10,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  videoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 5,
  },
  videoText: {
    fontSize: 16,
    color: '#333',
  },
  removeButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#dc3545',
    width: 25,
    height: 25,
    borderRadius: 12.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 30,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CarSeizureForm;