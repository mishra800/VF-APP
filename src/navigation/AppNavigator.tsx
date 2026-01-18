import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  LoginScreen,
  SignupScreen,
  OTPScreen,
  UserDashboard,
  AdminDashboard,
  CarSeizureForm,
  HelpScreen,
} from '../components';
import { User } from '../types';

const Stack = createStackNavigator();

interface AppNavigatorProps {
  isAuthenticated: boolean;
  user: User | null;
  onLogin: (user: User) => void;
  onLogout: () => void;
}

const AppNavigator: React.FC<AppNavigatorProps> = ({
  isAuthenticated,
  user,
  onLogin,
  onLogout,
}) => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#007bff',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerLeft: () => null, // Remove default back button to add custom VF logo later if needed
        }}
      >
        {!isAuthenticated ? (
          <>
            <Stack.Screen
              name="Login"
              options={{ title: 'Vehicle Force', headerShown: false }}
            >
              {(props) => <LoginScreen {...props} />}
            </Stack.Screen>
            <Stack.Screen
              name="Signup"
              component={SignupScreen}
              options={{ title: 'Vehicle Force - Sign Up' }}
            />
            <Stack.Screen
              name="OTP"
              options={{ title: 'Vehicle Force - Verify OTP' }}
            >
              {(props) => <OTPScreen {...props} onLogin={onLogin} />}
            </Stack.Screen>
          </>
        ) : (
          <>
            {user?.role === 'admin' ? (
              <Stack.Screen
                name="AdminDashboard"
                options={{ title: 'Vehicle Force - Admin', headerShown: false }}
              >
                {(props) => (
                  <AdminDashboard {...props} user={user!} onLogout={onLogout} />
                )}
              </Stack.Screen>
            ) : (
              <Stack.Screen
                name="UserDashboard"
                options={{ title: 'Vehicle Force', headerShown: false }}
              >
                {(props) => (
                  <UserDashboard {...props} user={user!} onLogout={onLogout} />
                )}
              </Stack.Screen>
            )}
            <Stack.Screen
              name="CarSeizureForm"
              options={{ title: 'Vehicle Force - New Report' }}
            >
              {(props) => <CarSeizureForm {...props} route={{ ...props.route, params: { user } }} />}
            </Stack.Screen>
            <Stack.Screen
              name="Help"
              component={HelpScreen}
              options={{ title: 'Vehicle Force - Help' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;