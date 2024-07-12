import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { EmptyScreen, WelcomeScreen } from '../screens';

// import { LoginScreen, SignupScreen, ForgotPasswordScreen } from "../screens";

const Stack = createStackNavigator();

export const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={EmptyScreen} />
      <Stack.Screen name="Signup" component={EmptyScreen} />
      <Stack.Screen name="ForgotPassword" component={EmptyScreen} />
    </Stack.Navigator>
  );
};
