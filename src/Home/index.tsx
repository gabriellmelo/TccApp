import React, { useState, useEffect } from "react"; // Importa os hooks do React
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, StatusBar, Platform, Modal, TextInput, FlatList, Keyboard, KeyboardAvoidingView } from "react-native"; // Importa componentes do React Native
import MapView, { Marker } from "react-native-maps"; // Importa o MapView e o Marker do React Native Maps
import { useNavigation, NavigationProp } from '@react-navigation/native'; // Importa os hooks de navegação
import Icon from 'react-native-vector-icons/MaterialIcons'; // Importa ícones do Material Icons
import { FontAwesome } from '@expo/vector-icons'; // Importa ícones do FontAwesome
import { bairros, ViasPorBairro, AcidentesPorVias, contagemAcidentesPorBairro } from "../Data"; // Importa os dados de bairros, vias e acidentes

type RootStackParamList = { // Definição das rotas disponíveis na navegação
  Detail: { bairro: string; via: string; }; // Parâmetros da tela de detalhes
  'News': undefined;
  'Safety Tips': undefined;
  'Data': undefined;
  'Useful Phones': undefined;
};

// Chave da API do Google Maps
const chaveApi = 'AIzaSyCQ1V4vK2zPgPwtbgS8F7H0Em63PYK5jJ4';

// Função para obter coorden a partir do endereço
async function obterCoordenadas(endereco) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(endereco + ', Franca, SP')}&key=${chaveApi}`; // URL da API do Google Maps
  const resposta = await fetch(url); // Faz a requisição à API do Google Maps
  const dados = await resposta.json(); // Converte a resposta para JSON

  if (dados.status === "OK") { // Verifica se a requisição foi bem-sucedida
    const { lat, lng } = dados.results[0].geometry.location; // Obtém as coordenadas
    return { latitude: lat, longitude: lng }; // Retorna o formato aceito pelo MapView
  } else {
    console.error(`Erro ao obter coordenadas para ${endereco}: ${dados.status}`); // Exibe o erro no console
    return null; // Retorna nulo em caso de erro
  }
}

export default function Home() { // Componente principal da tela inicial
  const navigation = useNavigation<NavigationProp<RootStackParamList>>(); // navegação
  const [bairroSelecionado, setBairroSelecionado] = useState(""); // Estado do bairro selecionado
  const [viaSelecionada, setViaSelecionada] = useState(""); // Estado da via selecionada
  const [coordenadas, setCoordenadas] = useState({ latitude: -20.5386, longitude: -47.4006 }); // Estado das coordenadas
  const [mostrarListaVias, setMostrarListaVias] = useState(false); // Estado para exibir o picker de vias
  const [MenuVisivel, setMenuVisivel] = useState(false); // Estado do menu de navegação
  const [legendaVisivel, setLegendaVisivel] = useState(false); // Estado da legenda
  const [corMarcadorBairro, setCorMarcadorBairro] = useState("blue"); // Estado da cor do marcador do bairro
  const [pesquisa, setPesquisa] = useState(''); // Estado da pesquisa
  const [bairrosFiltrados, setBairrosFiltrados] = useState(bairros); // Estado dos bairros filtrados
  const [bairrosDropdownAberto, setBairrosDropdownAberto] = useState(false); // Estado do dropdown de bairros
  const [viasDropdownAberto, setViasDropdownAberto] = useState(false); // Estado do dropdown de vias

  useEffect(() => { // Atualiza as coordenadas ao selecionar um bairro ou via
    const atualizarCoordenadas = async () => {
      let endereco = bairroSelecionado; // Inicia o endereço com o bairro selecionado
      if (viaSelecionada) { // Verifica se uma via foi selecionada
        endereco += ` ${viaSelecionada}`; // Adiciona a via ao endereço
      }

      const coords = await obterCoordenadas(endereco); // Obtém as coordenadas do endereço
      if (coords) { // Verifica se as coordenadas foram obtidas com sucesso
        setCoordenadas(coords); // Atualiza as coordenadas
      } else {
        Alert.alert("Erro", "Não foi possível obter as coordenadas."); // Exibe um alerta em caso de erro
      }
    };

    if (bairroSelecionado || viaSelecionada) { // Verifica se um bairro ou via foi selecionado
      atualizarCoordenadas(); // Atualiza as coordenadas
    } else {
      setCoordenadas({ latitude: -20.5386, longitude: -47.4006 }); // Retorna ao centro da cidade se nada estiver selecionado
    }
  }, [bairroSelecionado, viaSelecionada]); // Atualiza as coordenadas ao mudar o bairro ou via

  const MudancaBairro = (bairro: string) => { // Função para mudar o bairro selecionado
    setBairroSelecionado(bairro); // Atualiza o estado do bairro selecionado
    setViaSelecionada(""); // Limpa a via selecionada ao mudar de bairro
    setMostrarListaVias(bairro && ViasPorBairro[bairro]?.length > 0); // Atualiza o estado para exibir o picker de vias
    setCorMarcadorBairro(obterCorMarcadorBairro(bairro)); // Atualiza a cor do marcador do bairro
    setViasDropdownAberto(true); // Abre a lista de vias automaticamente
  };

  const MudancaVia = (via: string) => { // Função para mudar a via selecionada
    setViaSelecionada(via); // Atualiza o estado da via selecionada
    setViasDropdownAberto(false); // Fecha o dropdown ao selecionar uma via
  };

  const PressionarBotao = () => { // Função para exibir informações sobre a área selecionada
    if (!bairroSelecionado) { // Verifica se um bairro foi selecionado
      Alert.alert("Seleção inválida", "Por favor, selecione um bairro.");
    } else if (!ViasPorBairro[bairroSelecionado] || ViasPorBairro[bairroSelecionado].length === 0) { // Verifica se há vias disponíveis para o bairro selecionado
      Alert.alert("Informação indisponível", "Não há informações sobre este bairro.");
    } else if (!contagemAcidentesPorBairro[bairroSelecionado] || contagemAcidentesPorBairro[bairroSelecionado] === 0) { // Verifica se há acidentes registrados para o bairro selecionado
      Alert.alert("Informação indisponível", "Não há informações de acidentes registradas para este bairro.");
    } else if (viaSelecionada && !AcidentesPorVias[viaSelecionada]) { // Verifica se há dados para a via selecionada
      Alert.alert("Informação indisponível", "Não há informações de acidentes registradas para esta via.");
    } else {
      navigation.navigate('Detail', { bairro: bairroSelecionado, via: viaSelecionada }); // Navega para a tela de detalhes
    }
  };
  

  const opcoesMenu = [ // Opções do menu de navegação 
    { label: "Notícias", screen: "Notícias" },
    { label: "Dados", screen: "Explorar Dados" },
    { label: "Dicas Educativas", screen: "Dicas de Segurança" },
    { label: "Telefones Úteis", screen: "Telefones Úteis" },
  ];

  const PressionarMenu = (option) => { // Função para navegar para a tela correspondente à opção selecionada
    if (option.screen) { // Navega para a tela correspondente à opção selecionada
      navigation.navigate(option.screen);
    }
    setMenuVisivel(false); // Fecha o menu após selecionar uma opção
  };

  const obterCorMarcador = (viaSelecionada: string) => { // Função para obter a cor do marcador da via
    if (viaSelecionada && AcidentesPorVias[viaSelecionada]) { // Verifica se a via selecionada existe
      const indiceAcidente = AcidentesPorVias[viaSelecionada].indiceAcidentes; // Obtém o índice de acidentes
      if (indiceAcidente !== undefined) { // Verifica se o índice é válido
        if (indiceAcidente === 0) { // Define a cor do marcador com base no índice de acidentes
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
    return "blue"; // Retorna azul se não houver dados disponíveis
  };

  const obterCorMarcadorBairro = (bairroSelecionado: string) => { // Função para obter a cor do marcador do bairro
    if (bairroSelecionado && contagemAcidentesPorBairro[bairroSelecionado]) { // Verifica se o bairro selecionado existe
      const indiceAcidente = contagemAcidentesPorBairro[bairroSelecionado]; // Obtém o índice de acidentes
      if (indiceAcidente !== undefined) { // Verifica se o índice é válido
        if (indiceAcidente === 0) { // Define a cor do marcador com base no índice de acidentes
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
    return "blue"; // Retorna azul se não houver dados disponíveis
  };

  const corMarcador = viaSelecionada ? obterCorMarcador(viaSelecionada) : corMarcadorBairro; // Define a cor do marcador

  const limparSelecao = () => { // Função para limpar a seleção de bairro e via
    setBairroSelecionado(""); // Limpa a seleção de bairro
    setViaSelecionada(""); // Limpa a seleção de via
    setPesquisa(""); // Limpa a pesquisa ao limpar a seleção
    setBairrosFiltrados(bairros); // Reseta os bairros filtrados
    setBairrosDropdownAberto(false); // Fecha o dropdown de bairros
    setMostrarListaVias(false); // Esconde o picker de vias
    setCoordenadas({ latitude: -20.5386, longitude: -47.4006 }); // Retorna ao centro da cidade
    setCorMarcadorBairro("blue"); // Reseta a cor do marcador do bairro
  };

  const limparSelecaoRua = () => { // Função para limpar a seleção de via
    setViaSelecionada(""); // Limpa a seleção de via
    setViasDropdownAberto(false); // Fecha o dropdown de vias
  };

  const Busca = (text) => { // Função para buscar bairros
    setPesquisa(text); // Atualiza o estado da pesquisa
    setBairrosFiltrados(bairros.filter(bairro => bairro.toLowerCase().includes(text.toLowerCase()))); // Filtra os bairros
    setBairrosDropdownAberto(true); // Abre o dropdown ao digitar

    if (text === "") { // Limpa a seleção ao apagar o texto
      limparSelecao(); // Limpa a seleção de bairro e via
    } else if (bairroSelecionado && text.length < bairroSelecionado.length) { // Limpa a seleção ao apagar o texto
      setBairroSelecionado(text); // Atualiza o estado do bairro selecionado
      setCoordenadas({ latitude: -20.5386, longitude: -47.4006 }); // Retorna ao centro da cidade
    }
  };

  return ( // Renderiza o componente
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setLegendaVisivel(true)}>
          <Icon name="info" size={30} color="#007BFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mapa de Franca</Text>
        <TouchableOpacity onPress={() => setMenuVisivel(!MenuVisivel)}>
          <Icon name="menu" size={30} color="#000" />
        </TouchableOpacity>
      </View>

      {MenuVisivel && ( // Exibe o menu de navegação
        <View style={styles.dropdownMenu}>
          {opcoesMenu.map((option, index) => (  // Mapeia as opções do menu
            <TouchableOpacity
              key={index}  // Chave única para cada opção
              style={styles.menuOption}  // Estilo da opção
              onPress={() => PressionarMenu(option)}  // Função ao pressionar a opção
            >
              <Text style={styles.menuOptionText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <MapView // Mapa de Franca
        style={styles.map} // Estilo do mapa
        mapType="terrain" // Tipo de mapa
        region={{  // Região inicial
          latitude: coordenadas.latitude,
          longitude: coordenadas.longitude,
          latitudeDelta: 0.01,  // Zoom
          longitudeDelta: 0.01,
        }}
      >
        <Marker // Marcador do bairro
          key={corMarcador} // Chave única para o marcador
          coordinate={{ // Coordenadas do marcador
            latitude: coordenadas.latitude,
            longitude: coordenadas.longitude,
          }}
          pinColor={corMarcador} // Cor do marcador
          onPress={() => { // Exibe informações ao tocar no marcador
            let message = ''; // Mensagem do marcador
            let indiceAcidente = viaSelecionada ? AcidentesPorVias[viaSelecionada]?.indiceAcidentes : contagemAcidentesPorBairro[bairroSelecionado]; // Índice de acidentes
            if (corMarcador === 'blue') { // Define a mensagem com base na cor do marcador
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
            if (indiceAcidente !== undefined) { // Adiciona o número de acidentes à mensagem
              message += `\n(Acidentes registrados: ${indiceAcidente})`;
            }
            Alert.alert('Informação do Marcador', message); // Exibe a mensagem em um alerta
          }}
        />
      </MapView>

      <View style={styles.overlay}>
        <View style={styles.pesquisaContainer}>
          <FontAwesome name="search" size={20} color="#007BFF" />
          <TextInput
            style={styles.input}
            placeholder="Pesquise ou selecione um bairro"
            value={bairroSelecionado || pesquisa} // Exibe o bairro selecionado ou o texto da pesquisa
            onChangeText={Busca} // Atualiza a pesquisa ao digitar
            onFocus={() => setBairrosDropdownAberto(true)} // Abre o dropdown ao focar no campo
          />
          <View style={styles.iconContainer}>
            <TouchableOpacity onPress={() => { // Abre ou fecha o dropdown de bairros
              setBairrosDropdownAberto(!bairrosDropdownAberto); // Atualiza o estado do dropdown
              if (bairrosDropdownAberto) {
                Keyboard.dismiss(); // Fecha o teclado quando desabilitar a lista de bairros
              }
            }}>
              <FontAwesome name={bairrosDropdownAberto ? "chevron-up" : "chevron-down"} size={20} color="#007BFF" />
            </TouchableOpacity>
            {(pesquisa !== '' || bairroSelecionado) && ( // Exibe o ícone de limpar a seleção
              <TouchableOpacity onPress={limparSelecao} style={styles.clearIcon}>
                <FontAwesome name="close" size={20} color="#007BFF" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {bairrosDropdownAberto && ( // Exibe o dropdown de bairros
          <FlatList // Lista de bairros
            data={bairrosFiltrados} // Dados do dropdown
            keyExtractor={(item) => item} // Chave única para cada item
            renderItem={({ item }) => ( // Renderiza cada item
              <TouchableOpacity onPress={() => { // Atualiza o bairro selecionado ao pressionar um item
                MudancaBairro(item); // Atualiza o bairro selecionado
                setBairrosDropdownAberto(false); // Fecha o dropdown ao selecionar um bairro
                Keyboard.dismiss(); // Fecha o teclado quando selecionar algum bairro
              }}>
                <Text style={styles.dropdownItem}>{item}</Text>
              </TouchableOpacity>
            )}
            style={styles.dropdown}
            keyboardShouldPersistTaps="handled" // Permite tocar nos itens da lista mesmo com o teclado aberto
          />
        )}

        {mostrarListaVias && ( // Exibe o picker de vias
          <TouchableOpacity style={styles.pesquisaContainer} onPress={() => setViasDropdownAberto(!viasDropdownAberto)}>
            <TextInput
              style={[styles.input, styles.inputRua]}
              placeholder="Selecione uma via"
              value={viaSelecionada} // Exibe a via selecionada
              editable={false}  // Impede a edição direta do campo
            />
            <View style={styles.iconContainer}>
              <FontAwesome name={viasDropdownAberto ? "chevron-up" : "chevron-down"} size={20} color="#007BFF" />
              {viaSelecionada && (
                <TouchableOpacity onPress={limparSelecaoRua} style={styles.clearIcon}>
                  <FontAwesome name="close" size={20} color="#007BFF" />
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        )}

        {viasDropdownAberto && ( // Exibe o dropdown de vias
          <FlatList // Lista de vias
            data={ViasPorBairro[bairroSelecionado]} // Dados do dropdown
            keyExtractor={(item) => item} // Chave única para cada item
            renderItem={({ item }) => ( // Renderiza cada item
              <TouchableOpacity onPress={() => MudancaVia(item)}>
                <Text style={styles.dropdownItem}>{item}</Text>
              </TouchableOpacity>
            )}
            style={styles.dropdown}
          />
        )}

        {bairroSelecionado && ( // Exibe o botão de informações
          <TouchableOpacity
            style={[
              styles.button,
              (!ViasPorBairro[bairroSelecionado] || ViasPorBairro[bairroSelecionado].length === 0 || !contagemAcidentesPorBairro[bairroSelecionado]) && styles.buttonDisabled // Desabilita o botão se não houver vias ou informações de acidentes disponíveis
            ]}
            onPress={PressionarBotao}
            disabled={!ViasPorBairro[bairroSelecionado] || ViasPorBairro[bairroSelecionado].length === 0 || !contagemAcidentesPorBairro[bairroSelecionado]} // Desabilita o botão se não houver vias ou informações de acidentes disponíveis
          >
            <Text style={styles.buttonText}>Ver informações sobre essa área</Text>
          </TouchableOpacity>
        )}
      </View>

      <Modal // legenda das cores dos marcadores
        animationType="slide"  // Tipo de animação
        transparent={true}  // Fundo transparente
        visible={legendaVisivel}  // Visibilidade da legenda
        onRequestClose={() => setLegendaVisivel(false)}  // Fecha a legenda ao pressionar o botão de voltar
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
    </KeyboardAvoidingView>
  );
}

// Estilos gerais do componente
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 40 : 0,
    backgroundColor: '#fff',
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
  buttonDisabled: {
    backgroundColor: '#ccc',
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