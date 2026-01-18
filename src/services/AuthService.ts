import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';

class AuthService {
  private static instance: AuthService;
  
  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(phoneNumber: string, username?: string): Promise<{ success: boolean; user?: User; requiresOTP?: boolean }> {
    // Simulate API call
    await new Promise<void>(resolve => setTimeout(resolve, 1000));
    
    // Mock user data
    const mockUsers = [
      { id: '1', username: 'admin', phoneNumber: '+1234567890', role: 'admin' as const },
      { id: '2', username: 'user1', phoneNumber: '+1234567891', role: 'user' as const },
    ];
    
    const user = mockUsers.find(u => 
      u.phoneNumber === phoneNumber || u.username === username
    );
    
    if (user) {
      return { success: true, user, requiresOTP: true };
    }
    
    return { success: false };
  }

  async verifyOTP(phoneNumber: string, otp: string): Promise<{ success: boolean; user?: User; token?: string }> {
    // Simulate OTP verification
    await new Promise<void>(resolve => setTimeout(resolve, 500));
    
    if (otp === '123456') {
      const mockUsers = [
        { id: '1', username: 'admin', phoneNumber: '+1234567890', role: 'admin' as const },
        { id: '2', username: 'user1', phoneNumber: '+1234567891', role: 'user' as const },
      ];
      
      const user = mockUsers.find(u => u.phoneNumber === phoneNumber);
      const token = 'mock-jwt-token';
      
      if (user) {
        await AsyncStorage.setItem('user', JSON.stringify(user));
        await AsyncStorage.setItem('token', token);
        return { success: true, user, token };
      }
    }
    
    return { success: false };
  }

  async signup(_username: string, _phoneNumber: string): Promise<{ success: boolean; requiresOTP?: boolean }> {
    // Simulate API call
    await new Promise<void>(resolve => setTimeout(resolve, 1000));
    
    // Mock signup success
    return { success: true, requiresOTP: true };
  }

  async logout(): Promise<void> {
    await AsyncStorage.multiRemove(['user', 'token']);
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const userStr = await AsyncStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }

  async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem('token');
  }
}

export default AuthService;