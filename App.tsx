import React, { useState, useEffect } from 'react';
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
 
 const Stack = createNativeStackNavigator(); // Cria a pilha de navegação

 export default function App() { // Componente principal do aplicativo
  const [firstLaunch, setFirstLaunch] = useState(true); // Estado do primeiro lançamento

  // Código para o carrosel de introdução aparecer apenas na primeira vez que o aplicativo é aberto
   // useEffect(() => { // Verifica se o aplicativo já foi lançado
   //   AsyncStorage.getItem('alreadyLaunched').then(value => { // Obtém o valor da chave 'alreadyLaunched'
   //     if (value === null) { // Verifica se o valor é nulo
   //       AsyncStorage.setItem('alreadyLaunched', 'true'); // Define o valor da chave 'alreadyLaunched' como 'true'
   //       setFirstLaunch(true); // Define o estado do primeiro lançamento como verdadeiro
   //     } else { // Se o valor não for nulo
   //       setFirstLaunch(false); // Define o estado do primeiro lançamento como falso
   //     }
   //   });
   // }, []);
    
     if (firstLaunch === null) { // Verifica se o estado do primeiro lançamento é nulo
       return <LoadingSpinner />;  // Exibe o spinner de carregamento
     }
   
     return ( // Retorna a pilha de navegação
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
