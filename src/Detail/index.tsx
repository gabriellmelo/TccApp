import React, { useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RuasPorBairro, AcidenteDadosPorRua } from '../Data';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
    navigation.navigate('Explorar Dados' as never);
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
        <Text style={styles.title}>Na <Text style={styles.highlightedText}>{rua}</Text>, encontramos as seguintes informações:</Text>
        {info ? (
          <View style={styles.infoContainer}>
            <Text style={styles.infoTextWithBorder}><Text style={styles.label}>Bairro:</Text> {info.bairro}</Text>
            <Text style={styles.infoTextWithBorder}><Text style={styles.label}>Acidentes já registrados nessa via:</Text> {info.indiceAcidentes}</Text>
            <View style={styles.rowWithBorder}>
              <Text style={styles.infoText}>
                <Text style={styles.label}>Causas mais frequentes:</Text>
              </Text>
              <TouchableOpacity onPress={toggleCausas} style={styles.expandButton}>
                <Icon name={causasExpanded ? "expand-less" : "expand-more"} size={24} color="#007BFF" />
              </TouchableOpacity>
            </View>
            {causasExpanded && (
              <Text style={styles.infoText}>{info.causasMaisFrequentes.join(", ")}</Text>
            )}
            <View style={styles.rowWithBorder}>
              <Text style={styles.infoText}>
                <Text style={styles.label}>Rotas alternativas:</Text>
              </Text>
              <TouchableOpacity onPress={toggleRotas} style={styles.expandButton}>
                <Icon name={rotasExpanded ? "expand-less" : "expand-more"} size={24} color="#007BFF" />
              </TouchableOpacity>
            </View>
            {rotasExpanded && (
              <Text style={styles.infoText}>{info.rotasAlternativas.join(", ")}</Text>
            )}
          </View>
        ) : (
          <Text style={styles.noInfo}>Não há informações disponíveis para esta rua.</Text>
        )}
      </ScrollView>
      <TouchableOpacity style={styles.button} onPress={handleVerMaisPress}>
        <Text style={styles.buttonText}>Acessar Análise Interativa</Text>
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
    color: '#333',
  },
  infoContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  infoText: {
    fontSize: 16,
    color: '#555',
  },
  infoTextWithBorder: {
    fontSize: 16,
    color: '#555',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  label: {
    fontWeight: 'bold',
    color: '#007BFF',
  },
  highlightedText: {
    fontWeight: 'bold',
    color: '#007BFF',
  },
  noInfo: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 50,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
  },
  expandButton: {
    marginLeft: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  rowWithBorder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});