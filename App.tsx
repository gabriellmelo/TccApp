import React, { useState, useEffect } from 'react';
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
 import { StyleSheet } from 'react-native';

 const Stack = createNativeStackNavigator();

 export default function App() {
  const [firstLaunch, setFirstLaunch] = useState(true);

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
   
     if (firstLaunch === null) {
       return <LoadingSpinner />;
     }
   
     return (
       <NavigationContainer>
         <Stack.Navigator initialRouteName={firstLaunch ? "Carrossel" : "Home"}>
           <Stack.Screen name="Carrossel" component={CarouselScreen} options={{ headerShown: false }} />
           <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
           <Stack.Screen name="Detail" component={DetailScreen} />
           <Stack.Screen name="Notícias" component={NoticiasScreen} />
           <Stack.Screen name="Dicas de Segurança" component={DicasSegurancaScreen} />
           <Stack.Screen name="Explorar Dados" component={ExploreDadosScreen} />
           <Stack.Screen name="Telefones Úteis" component={TelefonesUteisScreen} />
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
