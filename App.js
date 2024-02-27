import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Dashboard from './screens/Dashboard';
import { MenuProvider } from 'react-native-popup-menu';

const Stack = createStackNavigator();

export default function App() {
  return (
    <MenuProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Dashboard">
          <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </MenuProvider>
  );
}