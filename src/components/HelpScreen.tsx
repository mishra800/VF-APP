import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import VFLogo from './VFLogo';

interface HelpScreenProps {
  navigation: any;
}

const HelpScreen: React.FC<HelpScreenProps> = ({ navigation }) => {
  const showPhoneHelp = () => {
    Alert.alert(
      '📞 Need Help?',
      'Call our support team:\n\n📱 Phone: 1-800-VF-HELP\n📧 Email: help@vehicleforce.com\n\nWe are here to help you!',
      [{ text: 'OK' }]
    );
  };

  const helpItems = [
    {
      icon: '📝',
      title: 'How to Create Report',
      description: 'Step by step guide to create a new seizure report',
      steps: [
        '1. Tap "New Report" button',
        '2. Fill car details (make, model, plate)',
        '3. Add location and reason',
        '4. Take photos of the car',
        '5. Submit the report'
      ]
    },
    {
      icon: '📸',
      title: 'Taking Good Photos',
      description: 'Tips for taking clear photos',
      steps: [
        '1. Take photos in good light',
        '2. Show the whole car',
        '3. Take close-up of license plate',
        '4. Show any damage clearly',
        '5. Take at least 3-4 photos'
      ]
    },
    {
      icon: '📋',
      title: 'Check Report Status',
      description: 'How to see your report status',
      steps: [
        '1. Go to "My Reports"',
        '2. Look for colored badges:',
        '   🟡 Yellow = Waiting',
        '   🟢 Green = Approved',
        '   🔴 Red = Rejected',
        '3. Tap report to see details'
      ]
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <VFLogo size={50} />
        <Text style={styles.title}>Help & Support</Text>
        <Text style={styles.subtitle}>We're here to help you</Text>
      </View>

      <TouchableOpacity style={styles.emergencyButton} onPress={showPhoneHelp}>
        <Text style={styles.emergencyIcon}>📞</Text>
        <Text style={styles.emergencyText}>Need Immediate Help?</Text>
        <Text style={styles.emergencySubtext}>Tap to call support</Text>
      </TouchableOpacity>

      {helpItems.map((item, index) => (
        <View key={index} style={styles.helpCard}>
          <View style={styles.helpHeader}>
            <Text style={styles.helpIcon}>{item.icon}</Text>
            <View style={styles.helpTitleContainer}>
              <Text style={styles.helpTitle}>{item.title}</Text>
              <Text style={styles.helpDescription}>{item.description}</Text>
            </View>
          </View>
          
          <View style={styles.stepsContainer}>
            {item.steps.map((step, stepIndex) => (
              <Text key={stepIndex} style={styles.stepText}>{step}</Text>
            ))}
          </View>
        </View>
      ))}

      <View style={styles.contactCard}>
        <Text style={styles.contactTitle}>📧 Contact Information</Text>
        <Text style={styles.contactText}>📱 Phone: 1-800-VF-HELP</Text>
        <Text style={styles.contactText}>📧 Email: help@vehicleforce.com</Text>
        <Text style={styles.contactText}>🕒 Hours: 24/7 Support</Text>
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  emergencyButton: {
    backgroundColor: '#dc3545',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  emergencyIcon: {
    fontSize: 30,
    marginBottom: 8,
  },
  emergencyText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  emergencySubtext: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
  },
  helpCard: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  helpHeader: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  helpIcon: {
    fontSize: 30,
    marginRight: 15,
  },
  helpTitleContainer: {
    flex: 1,
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  helpDescription: {
    fontSize: 14,
    color: '#666',
  },
  stepsContainer: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
  },
  stepText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    lineHeight: 20,
  },
  contactCard: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  contactText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  bottomPadding: {
    height: 20,
  },
});

export default HelpScreen;