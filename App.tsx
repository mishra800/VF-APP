import React, { useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import AuthService from './src/services/AuthService';
import { ErrorBoundary, LoadingSpinner } from './src/components';
import { User } from './src/types';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const authService = AuthService.getInstance();
      const currentUser = await authService.getCurrentUser();
      const token = await authService.getToken();
      
      if (currentUser && token) {
        setUser(currentUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  if (loading) {
    return <LoadingSpinner visible={true} message="Starting Vehicle Force..." overlay={false} />;
  }

  return (
    <ErrorBoundary>
      <StatusBar barStyle="light-content" backgroundColor="#007bff" />
      <AppNavigator
        isAuthenticated={isAuthenticated}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
    </ErrorBoundary>
  );
};

export default App;