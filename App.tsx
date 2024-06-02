import React, { useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/Home';
import DetailScreen from './src/Detail';
import NewsScreen from './src/News';
import SafetyTipsScreen from './src/SafetyTips';
import ExploreDataScreen from './src/ExploreData';
import UsefulPhonesScreen from './src/UsefulPhones';

const Stack = createNativeStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Initial">
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Detail" component={DetailScreen} />
        <Stack.Screen name="News" component={NewsScreen} />
        <Stack.Screen name="Safety Tips" component={SafetyTipsScreen} />
        <Stack.Screen name="Explore Data" component={ExploreDataScreen} />
        <Stack.Screen name="Useful Phones" component={UsefulPhonesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
