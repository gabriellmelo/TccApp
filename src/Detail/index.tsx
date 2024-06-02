import React, { useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Importe o Ionicons ou outro conjunto de ícones

import { RuasPorBairro, AcidenteDadosPorRua } from '../Data';

export default function Details({ route }) {
  const { bairro, rua } = route.params;
  const navigation = useNavigation(); 
  const [showOverlay, setShowOverlay] = useState(false);

  const ruasDoBairro = RuasPorBairro[bairro];
  const info = AcidenteDadosPorRua[rua];

  useLayoutEffect(() => {
    navigation.setOptions({
      title: '',
      headerRight: () => (
        <TouchableOpacity style={styles.menuButton} onPress={() => {
          setShowOverlay(!showOverlay);
        }}>
          <Ionicons name="menu" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, showOverlay]);

  const goToHomeScreen = () => {
    navigation.navigate('Home' as never); 
  };

  const handleVerMaisPress = () => {
    navigation.navigate('Explore Data' as never);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Na {rua}, encontramos as seguintes informações:</Text>
        {info ? (
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>Bairro: {info.bairro}</Text>
            <Text style={styles.infoText}>Índice de acidentes nos últimos 5 anos: {info.indiceAcidentes}</Text>
            <Text style={styles.infoText}>Causas mais frequentes: {info.causasMaisFrequentes.join(', ')}</Text>
            <Text style={styles.infoText}>Rotas alternativas: {info.rotasAlternativas.join(', ')}</Text>
          </View>
        ) : (
          <Text style={styles.noInfo}>Não há informações disponíveis para esta rua.</Text>
        )}
      </ScrollView>
      {showOverlay && (
        <View style={styles.overlay}>
          <TouchableOpacity style={styles.overlayButton} onPress={goToHomeScreen}>
            <Text style={styles.overlayButtonText}>Ver Noticas</Text>
          </TouchableOpacity>
        </View>
      )}
      {!showOverlay && (
        <TouchableOpacity style={styles.button} onPress={handleVerMaisPress}>
          <Text style={styles.buttonText}>Ver informações mais aprofundadas</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F2F2F2', 
  },
  scrollView: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  infoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
  },
  noInfo: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 50,
  },
  button: {
    backgroundColor: '#322153',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  menuButton: {
    marginRight: 15,
    padding: 10,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Ajuste a opacidade como desejar
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayButton: {
    backgroundColor: '#322153',
    padding: 15,
    borderRadius: 10,
  },
  overlayButtonText: {
    fontSize: 16,
    color: '#fff',
  },
});
