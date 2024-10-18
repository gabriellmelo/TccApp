import React, { useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ViasPorBairro, AcidentesPorVias, contagemAcidentesPorBairro, causasMaisFrequentesPorBairro } from '../Data';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function Details({ route }) {
  const { bairro, via } = route.params;
  const navigation = useNavigation();
  const [causas, setCausas] = useState(false);
  const [vias, setVias] = useState(false);
  const info = via ? AcidentesPorVias[via] : null;
  const totalAcidentes = contagemAcidentesPorBairro[bairro];
  const causasBairro = causasMaisFrequentesPorBairro[bairro];
  const viasBairro = ViasPorBairro[bairro] || [];

  useLayoutEffect(() => {
    navigation.setOptions({
      title: '',
    });
  }, [navigation]);

  const ExplorarDados = () => {
    navigation.navigate('Explorar Dados' as never);
  };

  const alternarCausas = () => {
    setCausas(!causas);
  };

  const alternarVias = () => {
    setVias(!vias);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {via ? (
          <>
            <Text style={styles.title}>Na <Text style={styles.highlightedText}>{via}</Text>, encontramos as seguintes informações:</Text>
            {info ? (
              <View style={styles.infoContainer}>
                <Text style={styles.infoTextWithBorder}><Text style={styles.label}>Bairro:</Text> {info.bairro}</Text>
                <Text style={styles.infoTextWithBorder}>
                  <Text style={styles.label}>Acidentes já registrados nessa via: </Text>
                  {info.indiceAcidentes === 0 ? 'Nenhum acidente registrado' : `${info.indiceAcidentes} ${info.indiceAcidentes === 1 ? 'acidente' : 'acidentes'}`}
                </Text>
                {info.indiceAcidentes > 0 && (
                  <>
                    <View style={styles.rowWithBorder}>
                      <Text style={styles.infoText}>
                        <Text style={styles.label}>Causas mais frequentes:</Text>
                      </Text>
                      <TouchableOpacity onPress={alternarCausas} style={styles.expandButton}>
                        <Icon name={causas ? "expand-less" : "expand-more"} size={24} color="#007BFF" />
                      </TouchableOpacity>
                    </View>
                    {causas && (
                      <Text style={styles.infoText}>{info.causasMaisFrequentes.join(", ")}</Text>
                    )}
                  </>
                )}
              </View>
            ) : (
              <Text style={styles.noInfo}>Não há informações disponíveis para esta via.</Text>
            )}
          </>
        ) : (
          <>
            <Text style={styles.title}>No bairro <Text style={styles.highlightedText}>{bairro}</Text>, encontramos as seguintes informações:</Text>
            <View style={styles.infoContainer}>
              <Text style={styles.infoTextWithBorder}>
                <Text style={styles.label}>Total de acidentes: </Text>
                {totalAcidentes === 0 ? 'Nenhum acidente registrado' : `${totalAcidentes} ${totalAcidentes === 1 ? 'acidente' : 'acidentes'}`}
              </Text>
              <View style={styles.rowWithBorder}>
                <Text style={styles.infoText}>
                  <Text style={styles.label}>Causas mais frequentes:</Text>
                </Text>
                <TouchableOpacity onPress={alternarCausas} style={styles.expandButton}>
                  <Icon name={causas ? "expand-less" : "expand-more"} size={24} color="#007BFF" />
                </TouchableOpacity>
              </View>
              {causas && (
                <Text style={styles.infoText}>{causasBairro.join(", ")}</Text>
              )}
              <View style={styles.rowWithBorder}>
                <Text style={styles.infoText}>
                  <Text style={styles.label}>Vias e índices de acidentes:</Text>
                </Text>
                <TouchableOpacity onPress={alternarVias} style={styles.expandButton}>
                  <Icon name={vias ? "expand-less" : "expand-more"} size={24} color="#007BFF" />
                </TouchableOpacity>
              </View>
              {vias && (
                <View style={styles.viasContainer}>
                  {viasBairro.map((via, index) => (
                    <Text key={index} style={styles.infoTextWithBorder}>
                      <Text style={styles.label}>{via}:</Text> {AcidentesPorVias[via]?.indiceAcidentes !== undefined ? `${AcidentesPorVias[via].indiceAcidentes === 0 ? 'Nenhum acidente registrado' : `${AcidentesPorVias[via].indiceAcidentes} ${AcidentesPorVias[via].indiceAcidentes === 1 ? 'acidente' : 'acidentes'}`}` : "Sem dados disponíveis"}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>
      <TouchableOpacity style={styles.button} onPress={ExplorarDados}>
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
  viasContainer: {
    marginTop: 10,
  },
});