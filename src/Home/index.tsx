import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, StatusBar, Platform, Modal } from "react-native";
import RNPickerSelect from 'react-native-picker-select';
import MapView, { Marker } from "react-native-maps";
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { bairros, RuasPorBairro, AcidenteDadosPorRua } from "../Data";

type RootStackParamList = {
    Detail: { bairro: string; rua: string; };
    'News': undefined;
    'Safety Tips': undefined;
    'Data': undefined;
    'Useful Phones': undefined;
};

// Chave da API do Google Maps
const chaveApi = 'AIzaSyCQ1V4vK2zPgPwtbgS8F7H0Em63PYK5jJ4';

// Função para obter coordenadas a partir do endereço
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
    const [ruaSelecionada, setRuaSelecionada] = useState("");
    const [coordenadas, setCoordenadas] = useState({ latitude: -20.5386, longitude: -47.4006 });
    const [mostrarPickerRua, setMostrarPickerRua] = useState(false);
    const [MenuVisivel, setMenuVisivel] = useState(false);
    const [legendaVisivel, setLegendaVisivel] = useState(false);

    useEffect(() => {
        const atualizarCoordenadas = async () => {
            let endereco = bairroSelecionado;
            if (ruaSelecionada) {
                endereco += ` ${ruaSelecionada}`;
            }

            const coords = await obterCoordenadas(endereco);
            if (coords) {
                setCoordenadas(coords);
            } else {
                Alert.alert("Erro", "Não foi possível obter as coordenadas.");
            }
        };

        if (bairroSelecionado || ruaSelecionada) {
            atualizarCoordenadas();
        } else {
            // Retorna ao centro da cidade se nada estiver selecionado
            setCoordenadas({ latitude: -20.5386, longitude: -47.4006 });
        }
    }, [bairroSelecionado, ruaSelecionada]);

    const MudancaBairro = (bairro: string) => {
        setBairroSelecionado(bairro);
        setRuaSelecionada(""); // Limpa a rua selecionada ao mudar de bairro
        setMostrarPickerRua(bairro && RuasPorBairro[bairro]?.length > 0); // Atualiza o estado para exibir o picker de ruas
    };

    const MudancaRua = (rua: string) => {
        setRuaSelecionada(rua);
    };

    const PressionarBotao = () => {
        if (!bairroSelecionado || (mostrarPickerRua && !ruaSelecionada)) {
            Alert.alert("Seleção inválida", "Por favor, selecione um bairro e uma rua.");
        } else {
            navigation.navigate('Detail', { bairro: bairroSelecionado, rua: ruaSelecionada });
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

    const obterCorMarcador = (ruaSelecionada: string) => {
        if (ruaSelecionada && AcidenteDadosPorRua[ruaSelecionada]) {
            const indiceAcidente = AcidenteDadosPorRua[ruaSelecionada].indiceAcidentes;
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

    const corMarcador = obterCorMarcador(ruaSelecionada);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => setLegendaVisivel(true)}>
                    <Icon name="info" size={30} color="#000" />
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
                        if (corMarcador === 'blue') {
                            message = 'Sem dados';
                        } else if (corMarcador === 'green') {
                            message = 'Sem acidente';
                        } else if (corMarcador === 'yellow') {
                            message = 'Baixo índice de acidente';
                        } else if (corMarcador === 'orange') {
                            message = 'Médio índice de acidente';
                        } else if (corMarcador === 'red') {
                            message = 'Alto índice de acidente';
                        }
                        Alert.alert('Informação do Marcador', message);
                    }}
                />
            </MapView>

            <View style={styles.overlay}>
                <RNPickerSelect
                    onValueChange={MudancaBairro}
                    items={bairros.map(bairro => ({ label: bairro, value: bairro }))}
                    placeholder={{ label: "Selecione um bairro", value: "" }}
                    style={pickerSelectStyles}
                    useNativeAndroidPickerStyle={false}
                    Icon={() => <Icon name="arrow-drop-down" size={24} color="gray" />}
                />

                {mostrarPickerRua && (
                    <RNPickerSelect
                        value={ruaSelecionada} // Aqui está o controle do valor selecionado
                        onValueChange={MudancaRua}
                        items={RuasPorBairro[bairroSelecionado]?.map(rua => ({ label: rua, value: rua }))}
                        placeholder={{ label: "Selecione uma rua", value: "" }}
                        style={pickerSelectStyles}
                        useNativeAndroidPickerStyle={false}
                        Icon={() => <Icon name="arrow-drop-down" size={24} color="gray" />}
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
                        <Text style={styles.modalTitle}>Legenda das Cores dos Marcadores</Text>
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
                        <TouchableOpacity style={styles.closeButton} onPress={() => setLegendaVisivel(false)}>
                            <Text style={styles.buttonText}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

// Estilos para os pickers
const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        height: 40,
        width: '100%',
        padding: 10,
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'black',
        backgroundColor: 'white',
        zIndex: 3,
    },
    inputAndroid: {
        height: 40,
        width: '100%',
        padding: 10,
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'black',
        backgroundColor: 'white',
        zIndex: 3,
    },
    iconContainer: {
        top: Platform.OS === 'ios' ? 10 : 15,
        right: Platform.OS === 'ios' ? 12 : 10,
    },
});

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
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 20,
        alignSelf: 'center',
        zIndex: 2,
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