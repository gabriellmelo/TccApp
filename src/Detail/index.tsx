import React, { useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RuasPorBairro, AcidenteDadosPorRua } from '../Data';

export default function Details({ route }) {
  const { bairro, rua } = route.params;
  const navigation = useNavigation(); 
  const [showOverlay, setShowOverlay] = useState(false);
  const [causasExpanded, setCausasExpanded] = useState(false);
  const [rotasExpanded, setRotasExpanded] = useState(false);
  const info = AcidenteDadosPorRua[rua];

  useLayoutEffect(() => {
    navigation.setOptions({
      title: '',
    });
  }, [navigation]);

  const handleVerMaisPress = () => {
    navigation.navigate('Explore Data' as never);
  };

  const toggleCausas = () => {
    setCausasExpanded(!causasExpanded);
  };

  const toggleRotas = () => {
    setRotasExpanded(!rotasExpanded);
  };
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
      <Text style={styles.title}>Na {rua}, encontramos as seguintes informações:</Text>
        {info ? (
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>Bairro: {info.bairro}</Text>
            <Text style={styles.infoText}>Índice de acidentes nos últimos 5 anos: {info.indiceAcidentes}</Text>
            <Text style={styles.infoText}>
              Causas mais frequentes:{" "}
              <Text style={styles.expandText} onPress={toggleCausas}>
                {causasExpanded ? "Recolher" : "Expandir"}
              </Text>
            </Text>
            {causasExpanded && (
              <Text style={styles.infoText}>
                {info.causasMaisFrequentes.join(", ")}
              </Text>
            )}
            <Text style={styles.infoText}>
              Rotas alternativas:{" "}
              <Text style={styles.expandText} onPress={toggleRotas}>
                {rotasExpanded ? "Recolher" : "Expandir"}
              </Text>
            </Text>
            {rotasExpanded && (
              <Text style={styles.infoText}>
                {info.rotasAlternativas.join(", ")}
              </Text>
            )}
          </View>
        ) : (
          <Text style={styles.noInfo}>Não há informações disponíveis para esta rua.</Text>
        )}
      </ScrollView>
        <TouchableOpacity style={styles.button} onPress={handleVerMaisPress}>
          <Text style={styles.buttonText}>Ver informações mais aprofundadas</Text>
        </TouchableOpacity>
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
  expandText: {
    color: 'blue',
    textDecorationLine: 'underline',
    marginBottom: 5,
  },
});
