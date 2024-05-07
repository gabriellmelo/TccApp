import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import HomeScreen from './src/Home';
import DetailScreen from './src/Detail';
import GraficosScreen from './src/Graficos'; 
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" options={{ headerShown: false }} component={HomeScreen} />
        <Stack.Screen name="Detail" component={DetailScreen} />
        <Stack.Screen name="Graficos" component={GraficosScreen} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
}
