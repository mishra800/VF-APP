import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import AuthService from '../services/AuthService';
import VFLogo from './VFLogo';

interface OTPScreenProps {
  navigation: any;
  route: any;
  onLogin: (user: any) => void;
}

const OTPScreen: React.FC<OTPScreenProps> = ({ navigation, route, onLogin }) => {
  const { phoneNumber } = route.params;
  const _isSignup = route.params.isSignup;
  const _userData = route.params.userData;
  const _user = route.params.user;
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    
    try {
      const authService = AuthService.getInstance();
      const result = await authService.verifyOTP(phoneNumber, otp);

      if (result.success && result.user) {
        onLogin(result.user);
      } else {
        Alert.alert('Error', 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'OTP verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = () => {
    if (timer === 0) {
      setTimer(60);
      Alert.alert('Success', 'OTP has been resent to your phone number');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <VFLogo size={60} />
        <Text style={styles.title}>Verify OTP</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit code sent to {phoneNumber}
        </Text>
        <Text style={styles.hint}>
          (Use 123456 for demo purposes)
        </Text>
      </View>

      <OTPInputView
        style={styles.otpContainer}
        pinCount={6}
        code={otp}
        onCodeChanged={setOtp}
        autoFocusOnLoad
        codeInputFieldStyle={styles.otpInput}
        codeInputHighlightStyle={styles.otpInputHighlight}
      />

      <TouchableOpacity
        style={styles.verifyButton}
        onPress={handleVerifyOTP}
        disabled={loading || otp.length !== 6}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.verifyButtonText}>Verify OTP</Text>
        )}
      </TouchableOpacity>

      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>
          Didn't receive the code?{' '}
        </Text>
        <TouchableOpacity
          onPress={handleResendOTP}
          disabled={timer > 0}
        >
          <Text style={[styles.resendLink, timer > 0 && styles.disabledLink]}>
            {timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
    color: '#666',
  },
  hint: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
    color: '#28a745',
    fontStyle: 'italic',
  },
  otpContainer: {
    width: '100%',
    height: 80,
    marginBottom: 30,
  },
  otpInput: {
    width: 45,
    height: 45,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 8,
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: '#fff',
  },
  otpInputHighlight: {
    borderColor: '#007bff',
  },
  verifyButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  resendText: {
    color: '#666',
    fontSize: 14,
  },
  resendLink: {
    color: '#007bff',
    fontSize: 14,
    fontWeight: '500',
  },
  disabledLink: {
    color: '#999',
  },
  backButton: {
    alignItems: 'center',
  },
  backButtonText: {
    color: '#666',
    fontSize: 16,
  },
});

export default OTPScreen;