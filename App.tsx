import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/Home';
import DetailScreen from './src/Detail';
import LoadingSpinner from 'src/LoadinSpinner/LoadingSpinner';
import NoticiasScreen from './src/News';
import DicasSegurancaScreen from './src/SafetyTips';
import CarouselScreen from 'src/AppIntroCarousel';
import ExploreDadosScreen from './src/ExploreData';
import TelefonesUteisScreen from './src/UsefulPhones';

const Stack = createNativeStackNavigator();

export default function App() {
  const [firstLaunch, setFirstLaunch] = useState(null);

  // useEffect(() => {
  //   AsyncStorage.getItem('alreadyLaunched').then(value => {
  //     if (value === null) {
  //       AsyncStorage.setItem('alreadyLaunched', 'true');
  //       setFirstLaunch(true);
  //     } else {
  //       setFirstLaunch(false);
  //     }
  //   });
  // }, []);
  useEffect(() => {
    // Forçar sempre o primeiro lançamento como verdadeiro para testes
    AsyncStorage.setItem('alreadyLaunched', 'true');
    setFirstLaunch(true);
  }, []);

  if (firstLaunch === null) {
    return <LoadingSpinner />; 
  } else if (firstLaunch === true) {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Carousel">
          <Stack.Screen name="Inicio" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Detalhes" component={DetailScreen} />
          <Stack.Screen name="Notícias" component={NoticiasScreen} />
          <Stack.Screen name="Dicas de Segurança" component={DicasSegurancaScreen} />
          <Stack.Screen name="Explorar Dados" component={ExploreDadosScreen} />
          <Stack.Screen name="Telefones Úteis" component={TelefonesUteisScreen} />
          <Stack.Screen name="Carrossel" component={CarouselScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  } else {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Inicio">
          <Stack.Screen name="Inicio" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Detalhes" component={DetailScreen} />
          <Stack.Screen name="Notícias" component={NoticiasScreen} />
          <Stack.Screen name="Dicas de Segurança" component={DicasSegurancaScreen} />
          <Stack.Screen name="Explorar Dados" component={ExploreDadosScreen} />
          <Stack.Screen name="Telefones Úteis" component={TelefonesUteisScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});