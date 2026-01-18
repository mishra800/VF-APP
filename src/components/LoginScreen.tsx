import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AuthService from '../services/AuthService';
import VFLogo from './VFLogo';

interface LoginScreenProps {
  navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [username, setUsername] = useState('');
  const [loginMethod, setLoginMethod] = useState<'phone' | 'username'>('phone');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (loginMethod === 'phone' && !phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }
    
    if (loginMethod === 'username' && !username.trim()) {
      Alert.alert('Error', 'Please enter your username');
      return;
    }

    setLoading(true);
    
    try {
      const authService = AuthService.getInstance();
      const result = await authService.login(
        loginMethod === 'phone' ? phoneNumber : '',
        loginMethod === 'username' ? username : ''
      );

      if (result.success && result.requiresOTP) {
        navigation.navigate('OTP', {
          phoneNumber: loginMethod === 'phone' ? phoneNumber : result.user?.phoneNumber,
          user: result.user,
        });
      } else {
        Alert.alert('Error', 'Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      Alert.alert('Error', 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <VFLogo size={80} />
        <Text style={styles.title}>Vehicle Force</Text>
        <Text style={styles.subtitle}>Car Seizure Management</Text>
      </View>

      <View style={styles.methodSelector}>
        <TouchableOpacity
          style={[styles.methodButton, loginMethod === 'phone' && styles.activeMethod]}
          onPress={() => setLoginMethod('phone')}
        >
          <Text style={[styles.methodText, loginMethod === 'phone' && styles.activeMethodText]}>
            Phone Number
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.methodButton, loginMethod === 'username' && styles.activeMethod]}
          onPress={() => setLoginMethod('username')}
        >
          <Text style={[styles.methodText, loginMethod === 'username' && styles.activeMethodText]}>
            Username
          </Text>
        </TouchableOpacity>
      </View>

      {loginMethod === 'phone' ? (
        <TextInput
          style={styles.input}
          placeholder="Enter phone number (+1234567890)"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />
      ) : (
        <TextInput
          style={styles.input}
          placeholder="Enter username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
      )}

      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.loginButtonText}>Login</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.signupLink}
        onPress={() => navigation.navigate('Signup')}
      >
        <Text style={styles.signupText}>Don't have an account? Sign up</Text>
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
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 5,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
    color: '#666',
  },
  methodSelector: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 8,
    overflow: 'hidden',
  },
  methodButton: {
    flex: 1,
    padding: 12,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
  },
  activeMethod: {
    backgroundColor: '#007bff',
  },
  methodText: {
    color: '#666',
    fontWeight: '500',
  },
  activeMethodText: {
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupLink: {
    alignItems: 'center',
  },
  signupText: {
    color: '#007bff',
    fontSize: 16,
  },
});

export default LoginScreen;