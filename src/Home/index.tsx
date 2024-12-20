import React, { useState, useEffect } from "react"; // Importa os hooks do React
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, AlertButton, StatusBar, Platform, Modal, TextInput, FlatList, Keyboard, KeyboardAvoidingView } from "react-native"; // Importa componentes do React Native
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
  const [todosMarcadores, setTodosMarcadores] = useState([]); // Estado de todos os marcadores
  const [bairroSelecionado, setBairroSelecionado] = useState(""); // Estado do bairro selecionado
  const [viaSelecionada, setViaSelecionada] = useState(""); // Estado da via selecionada
  const [zoom, setZoom] = useState(0.03); // Estado do zoom
  const [coordenadasViaSelecionada, setCoordenadasViaSelecionada] = useState(null);
  const [coordenadas, setCoordenadas] = useState({ latitude: -20.5386, longitude: -47.4006 }); // Estado das coordenadas
  const [mostrarListaVias, setMostrarListaVias] = useState(false); // Estado para exibir o picker de vias
  const [MenuVisivel, setMenuVisivel] = useState(false); // Estado do menu de navegação
  const [legendaVisivel, setLegendaVisivel] = useState(false); // Estado da legenda
  const [corMarcadorBairro, setCorMarcadorBairro] = useState("blue"); // Estado da cor do marcador do bairro
  const [pesquisa, setPesquisa] = useState(''); // Estado da pesquisa
  const [erroPesquisa, setErroPesquisa] = useState(""); // Estado para mensagem de erro
  const [bairrosFiltrados, setBairrosFiltrados] = useState(bairros); // Estado dos bairros filtrados
  const [bairrosDropdownAberto, setBairrosDropdownAberto] = useState(false); // Estado do dropdown de bairros
  const [viasDropdownAberto, setViasDropdownAberto] = useState(false); // Estado do dropdown de vias
  const [camadasVisivel, setCamadasVisivel] = useState(false); // Estado do modal de camadas
  const [tipoMapa, setTipoMapa] = useState<MapType>('terrain'); // Estado do tipo de mapa
  const [modalVisivel, setModalVisivel] = useState(false); // Estado do modal de informações do marcador
  const [informacoesMarcador, setInformacoesMarcador] = useState(""); // Estado das informações do marcador
  const [camadaSelecionada, setCamadaSelecionada] = useState<MapType>('terrain'); // Estado da camada selecionada

  type MapType = 'standard' | 'satellite' | 'hybrid' | 'terrain' | 'none' | 'traffic'; // Tipos de mapas disponíveis

  useEffect(() => {
    const inicializarMarcadores = async () => { // Função para inicializar os marcadores
      const marcadores = await Promise.all( // Obtém as coordenadas de todos os bairros
        bairros.map(async (bairro) => { // Mapeia os bairros
          const coords = await obterCoordenadas(bairro); // Obtém as coordenadas do bairro
          return { // Retorna um objeto com as informações do marcador
            bairro, // Define o nome do bairro
            coords, // Define as coordenadas do bairro
            cor: obterCorMarcadorBairro(bairro), // Define a cor do marcador com base no índice de acidentes
          };
        })
      );
      setTodosMarcadores(marcadores); // Atualiza o estado dos marcadores
    };

    inicializarMarcadores(); // Inicializa os marcadores
  }, []);

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

  useEffect(() => { // Atualiza o zoom ao selecionar ou desmarcar um bairro
    if (bairroSelecionado) { // Verifica se um bairro foi selecionado
      setZoom(0.02); // Ajusta o zoom ao selecionar um bairro
    } else { // Retorna ao zoom padrão se nenhum bairro estiver selecionado
      setZoom(0.03); // Ajusta o zoom ao desmarcar o bairro
    }
  }, [bairroSelecionado]); // Atualiza o zoom ao mudar o bairro selecionado

  const deltaZoom = bairroSelecionado ? 0.02 : 0.03; // Ajusta o zoom delta com base na seleção do bairro

  const MudancaBairro = (bairro: string) => { // Função para mudar o bairro selecionado
    setBairroSelecionado(bairro); // Atualiza o estado do bairro selecionado
    setViaSelecionada(""); // Limpa a via selecionada ao mudar de bairro
    setMostrarListaVias(bairro && ViasPorBairro[bairro]?.length > 0); // Atualiza o estado para exibir o picker de vias
    setCorMarcadorBairro(obterCorMarcadorBairro(bairro)); // Atualiza a cor do marcador do bairro
    setViasDropdownAberto(false); // Abre a lista de vias automaticamente
  };

  const MudancaVia = async (via: string) => { // Função para mudar a via selecionada
    setViaSelecionada(via); // Atualiza o estado da via selecionada
    const coords = await obterCoordenadas(`${bairroSelecionado} ${via}`); // Obtém as coordenadas da via
    setCoordenadasViaSelecionada(coords); // Atualiza as coordenadas da via selecionada
    setViasDropdownAberto(false); // Fecha o dropdown de vias ao selecionar uma via
  };

  const PressionarBotao = () => { // Função para exibir informações sobre a área selecionada
    if (!bairroSelecionado) { // Verifica se um bairro foi selecionado
      Alert.alert("Seleção inválida", "Por favor, selecione um bairro.");
    } else if (!ViasPorBairro[bairroSelecionado] || ViasPorBairro[bairroSelecionado].length === 0) { // Verifica se há vias disponíveis para o bairro selecionado
      Alert.alert("Informação indisponível", "Não há informações sobre este bairro.");
    } else if (contagemAcidentesPorBairro[bairroSelecionado] === undefined) { // Verifica se há acidentes registrados para o bairro selecionado
      Alert.alert("Informação indisponível", "Não há informações de acidentes registradas para este bairro.");
    } else if (viaSelecionada && !AcidentesPorVias[viaSelecionada]) { // Verifica se há dados para a via selecionada
      Alert.alert("Informação indisponível", "Não há informações de acidentes registradas para esta via.");
    } else {
      navigation.navigate('Detail', { bairro: bairroSelecionado, via: viaSelecionada }); // Navega para a tela de detalhes
    }
  };

  const opcoesMenu = [ // Opções do menu de navegação 
    { label: "Notícias", screen: "Notícias", icon: "newspaper-o" },
    { label: "Dados", screen: "Explorar Dados", icon: "bar-chart" },
    { label: "Dicas Educativas", screen: "Dicas de Segurança", icon: "lightbulb-o" },
    { label: "Telefones Úteis", screen: "Telefones Úteis", icon: "phone" },
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
        } else if (indiceAcidente <= 4) {
          return "yellow";
        } else if (indiceAcidente <= 9) {
          return "orange";
        } else {
          return "red";
        }
      }
    }
    return "blue"; // Retorna azul se não houver dados disponíveis
  };

  const obterCorMarcadorBairro = (bairroSelecionado: string) => { // Função para obter a cor do marcador do bairro
    if (bairroSelecionado && contagemAcidentesPorBairro[bairroSelecionado] !== undefined) { // Verifica se o bairro selecionado existe
      const indiceAcidente = contagemAcidentesPorBairro[bairroSelecionado]; // Obtém o índice de acidentes
      if (indiceAcidente === 0) { // Define a cor do marcador com base no índice de acidentes
        return "green";
      } else if (indiceAcidente <= 4) {
        return "yellow";
      } else if (indiceAcidente <= 9) {
        return "orange";
      } else {
        return "red";
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
    const bairrosFiltrados = bairros.filter(bairro => bairro.toLowerCase().includes(text.toLowerCase())); // Filtra os bairros
    setBairrosFiltrados(bairrosFiltrados); // Atualiza os bairros filtrados
    setBairrosDropdownAberto(true); // Abre o dropdown ao digitar
  
    if (text === "") { // Limpa a seleção ao apagar o texto
      limparSelecao(); // Limpa a seleção de bairro e via
      setErroPesquisa(""); // Limpa a mensagem de erro
    } else if (bairroSelecionado && text.length < bairroSelecionado.length) { // Limpa a seleção ao apagar o texto
      setBairroSelecionado(text); // Atualiza o estado do bairro selecionado
      setCoordenadas({ latitude: -20.5386, longitude: -47.4006 }); // Retorna ao centro da cidade
    }
  
    if (bairrosFiltrados.length === 0 && text !== "") { // Verifica se não há bairros correspondentes e se o texto não está vazio
      setErroPesquisa("Nenhum bairro encontrado."); // Define a mensagem de erro
    } else {
      setErroPesquisa(""); // Limpa a mensagem de erro
    }
  };

  const abrirModalMarcador = (message: string) => { // Função para abrir o modal com as informações do marcador
    setInformacoesMarcador(message); // Atualiza as informações do marcador
    setModalVisivel(true); // Abre o modal com as informações do marcador
  };

  const obterCorBordaModal = (message: string) => { // Função para obter a cor da borda do modal
    if (message.includes('Sem acidente')) { // Define a cor da borda com base no conteúdo da mensagem
      return 'green';
    } else if (message.includes('Baixo índice de acidente')) {
      return 'yellow';
    } else if (message.includes('Médio índice de acidente')) {
      return 'orange';
    } else if (message.includes('Alto índice de acidente')) {
      return 'red';
    }
    return 'blue'; // Retorna azul se não houver dados disponíveis
  };

  return ( // Renderiza o componente
    <KeyboardAvoidingView // Evita que o teclado cubra o conteúdo
      behavior={Platform.OS === "ios" ? "padding" : "height"} // Comportamento do teclado
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 10} // Ajuste do teclado
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
            <Icon name="menu" size={30} color="#007BFF" />
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
                <View style={styles.menuOptionContainer}>
                  <FontAwesome name={option.icon as keyof typeof FontAwesome.glyphMap} size={20} color="#007BFF" style={{ marginRight: 10 }} />
                  <Text style={styles.menuOptionText}>{option.label}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <MapView // Mapa de Franca
          style={styles.map} // Estilo do mapa
          mapType={tipoMapa === "traffic" ? "standard" : tipoMapa} // Tipo de mapa
          showsTraffic={tipoMapa === "traffic"} // Exibe informações de tráfego
          region={{ // Região inicial
            latitude: coordenadas.latitude, // Latitude inicial
            longitude: coordenadas.longitude, // Longitude inicial
            latitudeDelta: deltaZoom, // Usa o deltaZoom ajustado
            longitudeDelta: deltaZoom, // Usa o deltaZoom ajustado
          }}
          onRegionChangeComplete={(region) => { // Atualiza o zoom ao alterar a região
            const newZoom = region.latitudeDelta; // Obtém o novo zoom
            setZoom(newZoom); // Atualiza o estado do zoom
          }}
        >
          {viaSelecionada && coordenadasViaSelecionada && zoom <= 0.08 ? ( // Exibe o marcador da via selecionada
            <Marker // Marcador da via selecionada
              key={viaSelecionada} // Chave única para o marcador
              coordinate={coordenadasViaSelecionada} // Coordenadas do marcador
              pinColor={obterCorMarcador(viaSelecionada)} // Cor do marcador
              onPress={() => { // Exibe informações sobre a via ao pressionar o marcador
                let message = `Via: ${viaSelecionada}\n`; // Mensagem com o nome da via
                let indiceAcidente = AcidentesPorVias[viaSelecionada]?.indiceAcidentes; // Índice de acidentes da via
                if (indiceAcidente !== undefined) { // Verifica se o índice é válido
                  if (indiceAcidente === 0) {
                    message += 'Sem acidente';
                  } else if (indiceAcidente <= 5) {
                    message += 'Baixo índice de acidente';
                  } else if (indiceAcidente <= 10) {
                    message += 'Médio índice de acidente';
                  } else {
                    message += 'Alto índice de acidente';
                  }
                  message += `\n(Acidentes registrados: ${indiceAcidente})`; // Adiciona o número de acidentes à mensagem
                } else {
                  message += 'Sem dados disponíveis'; // Exibe mensagem de dados indisponíveis
                }
                abrirModalMarcador(message); // Abre o modal com as informações do marcador
              }}
            />
          ) : bairroSelecionado && zoom <= 0.02 ? ( // Exibe os marcadores das vias do bairro selecionado
            <>
              {ViasPorBairro[bairroSelecionado]?.map(async (via) => { // Mapeia as vias do bairro selecionado
                const coordenadas = await obterCoordenadas(`${bairroSelecionado} ${via}`); // Obtém as coordenadas da via
                return (
                  <Marker
                    key={via}
                    coordinate={coordenadas}
                    pinColor={obterCorMarcador(via)}
                    onPress={() => {
                      let message = `Via: ${via}\n`; // Mensagem com o nome da via
                      let indiceAcidente = AcidentesPorVias[via]?.indiceAcidentes; // Índice de acidentes da via
                      if (indiceAcidente !== undefined) { // Verifica se o índice é válido
                        if (indiceAcidente === 0) {
                          message += 'Sem acidente';
                        } else if (indiceAcidente <= 4) {
                          message += 'Baixo índice de acidente';
                        } else if (indiceAcidente <= 9) {
                          message += 'Médio índice de acidente';
                        } else {
                          message += 'Alto índice de acidente';
                        }
                        message += `\n(Acidentes registrados: ${indiceAcidente})`;
                      } else {
                        message += 'Sem dados disponíveis';
                      }
                      abrirModalMarcador(message); // Abre o modal com as informações do marcador
                    }}
                  />
                );
              })}
            </>
          ) : bairroSelecionado ? ( // Exibe o marcador do bairro selecionado
            <Marker
              key={bairroSelecionado}
              coordinate={coordenadas}
              pinColor={corMarcadorBairro}
              onPress={() => {
                let message = `Bairro: ${bairroSelecionado}\n`;
                let indiceAcidente = contagemAcidentesPorBairro[bairroSelecionado];
                if (corMarcadorBairro === 'blue') {
                  message += 'Sem dados disponíveis';
                } else if (corMarcadorBairro === 'green') {
                  message += 'Sem acidente';
                } else if (corMarcadorBairro === 'yellow') {
                  message += 'Baixo índice de acidente';
                } else if (corMarcadorBairro === 'orange') {
                  message += 'Médio índice de acidente';
                } else if (corMarcadorBairro === 'red') {
                  message += 'Alto índice de acidente';
                }
                if (indiceAcidente !== undefined) {
                  message += `\n(Acidentes registrados: ${indiceAcidente})`;
                }
                abrirModalMarcador(message); // Abre o modal com as informações do marcador
              }}
            />
          ) : todosMarcadores.map((marcador) => ( // Exibe os marcadores de todos os bairros
            <Marker
              key={marcador.bairro}
              coordinate={marcador.coords}
              pinColor={marcador.cor}
              onPress={() => {
                let message = `Bairro: ${marcador.bairro}\n`;
                let indiceAcidente = contagemAcidentesPorBairro[marcador.bairro];
                if (marcador.cor === 'blue') {
                  message += 'Sem dados disponíveis';
                } else if (marcador.cor === 'green') {
                  message += 'Sem acidente';
                } else if (marcador.cor === 'yellow') {
                  message += 'Baixo índice de acidente';
                } else if (marcador.cor === 'orange') {
                  message += 'Médio índice de acidente';
                } else if (marcador.cor === 'red') {
                  message += 'Alto índice de acidente';
                }
                if (indiceAcidente !== undefined) {
                  message += `\n(Acidentes registrados: ${indiceAcidente})`;
                }
                abrirModalMarcador(message); // Abre o modal com as informações do marcador
              }}
            />
          ))}
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
          {erroPesquisa && pesquisa ? ( // Exibe a mensagem de erro se houver e se o texto não estiver vazio
            <Text style={styles.erroTexto}>{erroPesquisa}</Text>
          ) : null}
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
                  <Text style={[styles.dropdownItem, item === bairroSelecionado && styles.selectedItem]}>{item}</Text>
                </TouchableOpacity>
              )}
              style={styles.dropdown}
              keyboardShouldPersistTaps="handled" // Permite tocar nos itens da lista mesmo com o teclado aberto
            />
          )}

          {mostrarListaVias && ( // Exibe a lista de vias do bairro selecionado
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
                  <Text style={[styles.dropdownItem, item === viaSelecionada && styles.selectedItem]}>{item}</Text>
                </TouchableOpacity>
              )}
              style={styles.dropdown}
            />
          )}

          {bairroSelecionado && ( // Exibe o botão de informações
            <TouchableOpacity
              style={[
                styles.button,
                (!ViasPorBairro[bairroSelecionado] || ViasPorBairro[bairroSelecionado].length === 0 || contagemAcidentesPorBairro[bairroSelecionado] === undefined) && styles.buttonDisabled // Desabilita o botão se não houver vias ou informações de acidentes disponíveis
              ]}
              onPress={PressionarBotao}
              disabled={!ViasPorBairro[bairroSelecionado] || ViasPorBairro[bairroSelecionado].length === 0 || contagemAcidentesPorBairro[bairroSelecionado] === undefined} // Desabilita o botão se não houver vias ou informações de acidentes disponíveis
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <FontAwesome name="info-circle" size={20} color="#FFF" style={{ marginRight: 10 }} />
                <Text style={styles.buttonText}>Ver informações sobre essa área</Text>
              </View>
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
                <Text style={styles.modalText}> Sem dados disponíveis</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: 'green' }]} />
                <Text style={styles.modalText}> Nenhum acidente registrado</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: 'yellow' }]} />
                <Text style={styles.modalText}> Baixo índice de acidente (1-4)</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: 'orange' }]} />
                <Text style={styles.modalText}> Médio índice de acidente (5-9)</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: 'red' }]} />
                <Text style={styles.modalText}> Alto índice de acidente (10+)</Text>
              </View>
              <TouchableOpacity style={[styles.closeButton]} onPress={() => setLegendaVisivel(false)}>
                <Text style={styles.buttonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <View style={styles.camadas}>
          <TouchableOpacity onPress={() => setCamadasVisivel(true)}>
            <Icon name="layers" size={30} color="#007BFF" />
          </TouchableOpacity>
        </View>

        <Modal // Modal com opções de camadas
          animationType="slide"  // Tipo de animação
          transparent={true} // Fundo transparente
          visible={camadasVisivel} // Visibilidade do modal 
          onRequestClose={() => setCamadasVisivel(false)} // Fecha o modal ao pressionar o botão de voltar
        >
          <View style={styles.modalOverlayCamadas}>
            <View style={styles.modalContentCamadas}>
              <Text style={styles.modalTitleCamadas}>Selecione um mapa</Text>
              <TouchableOpacity style={[styles.menuOptionCamadas, camadaSelecionada === 'standard' && styles.selectedCamada]} onPress={() => { setTipoMapa("standard"); setCamadaSelecionada("standard"); setCamadasVisivel(false); }}>
                <Text style={[styles.menuOptionTextCamadas, camadaSelecionada === 'standard' && styles.selectedText]}>Padrão</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.menuOptionCamadas, camadaSelecionada === 'satellite' && styles.selectedCamada]} onPress={() => { setTipoMapa("satellite"); setCamadaSelecionada("satellite"); setCamadasVisivel(false); }}>
                <Text style={[styles.menuOptionTextCamadas, camadaSelecionada === 'satellite' && styles.selectedText]}>Satélite</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.menuOptionCamadas, camadaSelecionada === 'terrain' && styles.selectedCamada]} onPress={() => { setTipoMapa("terrain"); setCamadaSelecionada("terrain"); setCamadasVisivel(false); }}>
                <Text style={[styles.menuOptionTextCamadas, camadaSelecionada === 'terrain' && styles.selectedText]}>Terreno</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.menuOptionCamadas, camadaSelecionada === 'hybrid' && styles.selectedCamada]} onPress={() => { setTipoMapa("hybrid"); setCamadaSelecionada("hybrid"); setCamadasVisivel(false); }}>
                <Text style={[styles.menuOptionTextCamadas, camadaSelecionada === 'hybrid' && styles.selectedText]}>Híbrido</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.menuOptionCamadas, camadaSelecionada === 'traffic' && styles.selectedCamada]} onPress={() => { setTipoMapa("traffic"); setCamadaSelecionada("traffic"); setCamadasVisivel(false); }}>
                <Text style={[styles.menuOptionTextCamadas, camadaSelecionada === 'traffic' && styles.selectedText]}>Tráfego</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButtonCamadas} onPress={() => setCamadasVisivel(false)}>
                <Text style={styles.buttonTextCamadas}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal // Modal com informações do marcador
          animationType="fade" // Tipo de animação
          transparent={true} // Fundo transparente
          visible={modalVisivel} // Visibilidade do modal
          onRequestClose={() => setModalVisivel(false)} // Fecha o modal ao pressionar o botão de voltar
        >
          <View style={styles.modalMarcador}>
            <View style={[styles.modalContentMarcador, { borderColor: obterCorBordaModal(informacoesMarcador) }]}>
              <Text style={styles.modalTitleMarcador}>Informação do Marcador</Text>
              <Text style={styles.modalTextMarcador}>{informacoesMarcador}</Text>
              <TouchableOpacity style={styles.closeButtonMarcador} onPress={() => setModalVisivel(false)}>
                <Text style={styles.buttonTextMarcador}>Fechar</Text>
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
  camadas: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 120 : 70, // Ajuste o valor de top para iOS
    left: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 50,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalOverlayCamadas: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContentCamadas: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderWidth: 1,
    borderRadius: 50,
    borderColor: '#007BFF',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalTitleCamadas: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#007BFF',
  },
  menuOptionCamadas: {
    width: '100%',
    padding: 12,
    borderRadius: 50,
    backgroundColor: '#f5f5f5',
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007BFF',
  },
  menuOptionTextCamadas: {
    fontSize: 16,
    color: '#333',
  },
  closeButtonCamadas: {
    marginTop: 15,
    padding: 10,
    borderRadius: 50,
    backgroundColor: '#007BFF',
    alignItems: 'center',
  },
  buttonTextCamadas: {
    fontSize: 16,
    color: '#fff',
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
    textAlign: 'left',
    color: '#000',
  },
  menuOptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
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
  erroTexto: {
    color: 'red',
    textAlign: 'center',
    marginTop: 5,
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
  selectedItem: {
    backgroundColor: '#007BFF',
    color: '#fff',
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
    borderWidth: 1,
    borderRadius: 50,
    borderColor: '#007BFF',
    alignItems: 'flex-start',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'center',
    color: '#007BFF',
  },
  modalText: {
    color: '#000',
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
    borderRadius: 50,
  },
  closeButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 50,
    marginTop: 10,
    alignSelf: 'center',
  },
  modalMarcador: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContentMarcador: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderWidth: 1,
    borderRadius: 50,
    borderColor: '#007BFF',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  modalTitleMarcador: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    alignSelf: 'center',
    color: '#007BFF',
    textAlign: 'center',
  },
  modalTextMarcador: {
    color: '#333',
    fontSize: 16,
    lineHeight: 22,
  },
  buttonTextMarcador: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeButtonMarcador: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 25,
    marginTop: 15,
    alignSelf: 'center',
    width: '50%',
  },
  selectedCamada: {
    backgroundColor: '#007BFF',
  },
  selectedText: {
    color: '#fff',
  },
});