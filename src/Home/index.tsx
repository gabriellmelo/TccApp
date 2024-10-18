import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, StatusBar, Platform, Modal, TextInput, FlatList } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { FontAwesome } from '@expo/vector-icons';
import { bairros, ViasPorBairro, AcidentesPorVias, contagemAcidentesPorBairro } from "../Data";

type RootStackParamList = {
  Detail: { bairro: string; via: string; };
  'News': undefined;
  'Safety Tips': undefined;
  'Data': undefined;
  'Useful Phones': undefined;
};

// Chave da API do Google Maps
const chaveApi = 'AIzaSyCQ1V4vK2zPgPwtbgS8F7H0Em63PYK5jJ4';

// Função para obter coorden a partir do endereço
async function obterCoordenadas(endereco) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(endereco + ', Franca, SP')}&key=${chaveApi}`;
  const resposta = await fetch(url);
  const dados = await resposta.json();

  if (dados.status === "OK") {
    const { lat, lng } = dados.results[0].geometry.location;
    return { latitude: lat, longitude: lng }; // Retorna o formato aceito pelo MapView
  } else {
    console.error(`Erro ao obter coordenadas para ${endereco}: ${dados.status}`);
    return null;
  }
}

export default function Home() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [bairroSelecionado, setBairroSelecionado] = useState("");
  const [viaSelecionada, setViaSelecionada] = useState("");
  const [coordenadas, setCoordenadas] = useState({ latitude: -20.5386, longitude: -47.4006 });
  const [mostrarListaVias, setMostrarListaVias] = useState(false);
  const [MenuVisivel, setMenuVisivel] = useState(false);
  const [legendaVisivel, setLegendaVisivel] = useState(false);
  const [corMarcadorBairro, setCorMarcadorBairro] = useState("blue");
  const [pesquisa, setPesquisa] = useState('');
  const [bairrosFiltrados, setBairrosFiltrados] = useState(bairros);
  const [bairrosDropdownAberto, setBairrosDropdownAberto] = useState(false);
  const [viasDropdownAberto, setViasDropdownAberto] = useState(false);

  useEffect(() => {
    const atualizarCoordenadas = async () => {
      let endereco = bairroSelecionado;
      if (viaSelecionada) {
        endereco += ` ${viaSelecionada}`;
      }

      const coords = await obterCoordenadas(endereco);
      if (coords) {
        setCoordenadas(coords);
      } else {
        Alert.alert("Erro", "Não foi possível obter as coordenadas.");
      }
    };

    if (bairroSelecionado || viaSelecionada) {
      atualizarCoordenadas();
    } else {
      // Retorna ao centro da cidade se nada estiver selecionado
      setCoordenadas({ latitude: -20.5386, longitude: -47.4006 });
    }
  }, [bairroSelecionado, viaSelecionada]);

  const MudancaBairro = (bairro: string) => {
    setBairroSelecionado(bairro);
    setViaSelecionada(""); // Limpa a via selecionada ao mudar de bairro
    setMostrarListaVias(bairro && ViasPorBairro[bairro]?.length > 0); // Atualiza o estado para exibir o picker de vias
    setCorMarcadorBairro(obterCorMarcadorBairro(bairro)); // Atualiza a cor do marcador do bairro
    setViasDropdownAberto(true); // Abre a lista de vias automaticamente
  };

  const MudancaVia = (via: string) => {
    setViaSelecionada(via);
    setViasDropdownAberto(false);
  };

  const PressionarBotao = () => {
    if (!bairroSelecionado) {
      Alert.alert("Seleção inválida", "Por favor, selecione um bairro.");
    } else if (!ViasPorBairro[bairroSelecionado] || ViasPorBairro[bairroSelecionado].length === 0) {
      Alert.alert("Informação indisponível", "Não há informações sobre este bairro.");
    } else if (!contagemAcidentesPorBairro[bairroSelecionado] || contagemAcidentesPorBairro[bairroSelecionado] === 0) {
      Alert.alert("Informação indisponível", "Não há informações de acidentes registradas para este bairro.");
    } else {
      navigation.navigate('Detail', { bairro: bairroSelecionado, via: viaSelecionada });
    }
  };

  const opcoesMenu = [
    { label: "Notícias", screen: "Notícias" },
    { label: "Dados", screen: "Explorar Dados" },
    { label: "Dicas Educativas", screen: "Dicas de Segurança" },
    { label: "Telefones Úteis", screen: "Telefones Úteis" },
  ];

  const PressionarMenu = (option) => {
    if (option.screen) {
      navigation.navigate(option.screen);
    }
    setMenuVisivel(false);
  };

  const obterCorMarcador = (viaSelecionada: string) => {
    if (viaSelecionada && AcidentesPorVias[viaSelecionada]) {
      const indiceAcidente = AcidentesPorVias[viaSelecionada].indiceAcidentes;
      if (indiceAcidente !== undefined) {
        if (indiceAcidente === 0) {
          return "green";
        } else if (indiceAcidente <= 5) {
          return "yellow";
        } else if (indiceAcidente <= 10) {
          return "orange";
        } else {
          return "red";
        }
      }
    }
    return "blue";
  };

  const obterCorMarcadorBairro = (bairroSelecionado: string) => {
    if (bairroSelecionado && contagemAcidentesPorBairro[bairroSelecionado]) {
      const indiceAcidente = contagemAcidentesPorBairro[bairroSelecionado];
      if (indiceAcidente !== undefined) {
        if (indiceAcidente === 0) {
          return "green";
        } else if (indiceAcidente <= 5) {
          return "yellow";
        } else if (indiceAcidente <= 10) {
          return "orange";
        } else {
          return "red";
        }
      }
    }
    return "blue";
  };

  const corMarcador = viaSelecionada ? obterCorMarcador(viaSelecionada) : corMarcadorBairro;

  const Busca = (text) => {
    setPesquisa(text);
    setBairrosFiltrados(bairros.filter(bairro => bairro.toLowerCase().includes(text.toLowerCase())));
    setBairrosDropdownAberto(true); // Abre o dropdown ao digitar

    if (text === "") {
      limparSelecao();
    } else if (bairroSelecionado && text.length < bairroSelecionado.length) {
      setBairroSelecionado(text);
      setCoordenadas({ latitude: -20.5386, longitude: -47.4006 });
    }
  };

  const limparSelecao = () => {
    setBairroSelecionado("");
    setViaSelecionada("");
    setPesquisa("");
    setBairrosFiltrados(bairros);
    setBairrosDropdownAberto(false);
    setMostrarListaVias(false);
    setCoordenadas({ latitude: -20.5386, longitude: -47.4006 });
    setCorMarcadorBairro("blue");
  };

  const limparSelecaoRua = () => {
    setViaSelecionada("");
    setViasDropdownAberto(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setLegendaVisivel(true)}>
          <Icon name="info" size={30} color="#007BFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mapa</Text>
        <TouchableOpacity onPress={() => setMenuVisivel(!MenuVisivel)}>
          <Icon name="menu" size={30} color="#000" />
        </TouchableOpacity>
      </View>

      {MenuVisivel && (
        <View style={styles.dropdownMenu}>
          {opcoesMenu.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuOption}
              onPress={() => PressionarMenu(option)}
            >
              <Text style={styles.menuOptionText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <MapView
        style={styles.map}
        mapType="terrain"
        region={{
          latitude: coordenadas.latitude,
          longitude: coordenadas.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          key={corMarcador}
          coordinate={{
            latitude: coordenadas.latitude,
            longitude: coordenadas.longitude,
          }}
          pinColor={corMarcador}
          onPress={() => {
            let message = '';
            let indiceAcidente = viaSelecionada ? AcidentesPorVias[viaSelecionada]?.indiceAcidentes : contagemAcidentesPorBairro[bairroSelecionado];
            if (corMarcador === 'blue') {
              message = 'Sem dados disponíveis';
            } else if (corMarcador === 'green') {
              message = 'Sem acidente';
            } else if (corMarcador === 'yellow') {
              message = 'Baixo índice de acidente';
            } else if (corMarcador === 'orange') {
              message = 'Médio índice de acidente';
            } else if (corMarcador === 'red') {
              message = 'Alto índice de acidente';
            }
            if (indiceAcidente !== undefined) {
              message += `\n(Acidentes registrados: ${indiceAcidente})`;
            }
            Alert.alert('Informação do Marcador', message);
          }}
        />
      </MapView>

      <View style={styles.overlay}>
        <View style={styles.pesquisaContainer}>
          <FontAwesome name="search" size={20} color="#000" />
          <TextInput
            style={styles.input}
            placeholder="Digite o nome do bairro"
            value={bairroSelecionado || pesquisa}
            onChangeText={Busca}
            onFocus={() => setBairrosDropdownAberto(true)} // Abre o dropdown ao focar no campo
          />
          <View style={styles.iconContainer}>
            <TouchableOpacity onPress={() => setBairrosDropdownAberto(!bairrosDropdownAberto)}>
              <FontAwesome name={bairrosDropdownAberto ? "chevron-up" : "chevron-down"} size={20} color="#000" />
            </TouchableOpacity>
            {(pesquisa !== '' || bairroSelecionado) && (
              <TouchableOpacity onPress={limparSelecao} style={styles.clearIcon}>
                <FontAwesome name="times-circle" size={20} color="#FF0000" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {bairrosDropdownAberto && (
          <FlatList
            data={bairrosFiltrados}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => { MudancaBairro(item); setBairrosDropdownAberto(false); }}>
                <Text style={styles.dropdownItem}>{item}</Text>
              </TouchableOpacity>
            )}
            style={styles.dropdown}
          />
        )}

        {mostrarListaVias && (
          <TouchableOpacity style={styles.pesquisaContainer} onPress={() => setViasDropdownAberto(!viasDropdownAberto)}>
            <TextInput
              style={[styles.input, styles.inputRua]}
              placeholder="Selecione uma via"
              value={viaSelecionada}
              editable={false}
            />
            <View style={styles.iconContainer}>
              <FontAwesome name={viasDropdownAberto ? "chevron-up" : "chevron-down"} size={20} color="#000" />
              {viaSelecionada && (
                <TouchableOpacity onPress={limparSelecaoRua} style={styles.clearIcon}>
                  <FontAwesome name="times-circle" size={20} color="#FF0000" />
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        )}

        {viasDropdownAberto && (
          <FlatList
            data={ViasPorBairro[bairroSelecionado]}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => MudancaVia(item)}>
                <Text style={styles.dropdownItem}>{item}</Text>
              </TouchableOpacity>
            )}
            style={styles.dropdown}
          />
        )}

        <TouchableOpacity style={styles.button} onPress={PressionarBotao}>
          <Text style={styles.buttonText}>Ver informações sobre essa área</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={legendaVisivel}
        onRequestClose={() => setLegendaVisivel(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cores dos marcadores</Text>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: 'blue' }]} />
              <Text> Sem dados disponíveis</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: 'green' }]} />
              <Text> Nenhum acidente registrado</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: 'yellow' }]} />
              <Text> Baixo índice de acidentes</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: 'orange' }]} />
              <Text> Médio índice de acidentes</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: 'red' }]} />
              <Text> Alto índice de acidentes</Text>
            </View>
            <TouchableOpacity style={[styles.closeButton]} onPress={() => setLegendaVisivel(false)}>
              <Text style={styles.buttonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Estilos gerais do componente
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 40 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  dropdownMenu: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 101 : 42,
    right: 17,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    zIndex: 1,
  },
  menuOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  menuOptionText: {
    fontSize: 18,
  },
  map: {
    flex: 1,
    zIndex: -1,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    alignSelf: 'center',
    zIndex: 2,
  },
  pesquisaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    marginLeft: 10,
  },
  inputRua: {
    color: '#000',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearIcon: {
    marginLeft: 10,
  },
  dropdown: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'flex-start',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  legendColor: {
    width: 20,
    height: 20,
    marginRight: 10,
    borderRadius: 5,
  },
  closeButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    alignSelf: 'center',
  },
});