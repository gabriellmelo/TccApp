import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, StatusBar, Platform } from "react-native";
import RNPickerSelect from 'react-native-picker-select';
import MapView, { Marker } from "react-native-maps";
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { bairros, RuasPorBairro, AcidenteDadosPorRua } from "../Data";
import { CoordenadasPorBairro, CoordenadasPorRua } from "../Coordinates";

type RootStackParamList = {
  Detail: { bairro: string; rua: string; };
  'News': undefined;
  'Safety Tips': undefined;
  'Data': undefined;
  'Useful Phones': undefined;
};

const mapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#000000"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  },
];

export default function Home() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [bairroSelecionado, setBairroSelecionado] = useState("");
  const [ruaSelecionada, setRuaSelecionada] = useState("");
  const [mostrarPickerRua, setMostrarPickerRua] = useState(false);
  const [coordenadas, setCoordenadas] = useState<{ latitude: number; longitude: number }>({
    latitude: -20.5386,
    longitude: -47.4006,
  });
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    const coordenadasRua = CoordenadasPorRua[bairroSelecionado]?.[ruaSelecionada];
    if (coordenadasRua) {
      setCoordenadas({
        latitude: coordenadasRua.latitude,
        longitude: coordenadasRua.longitude,
      });
    }
  }, [bairroSelecionado, ruaSelecionada]);

  const handleBairroChange = (bairro: string) => {
    setBairroSelecionado(bairro);
    setRuaSelecionada("");
    setMostrarPickerRua(false);
    if (bairro === "") {
      setCoordenadas({ latitude: -20.5386, longitude: -47.4006 });
    } else {
      const coordenadasBairro = CoordenadasPorBairro[bairro];
      if (coordenadasBairro) {
        setCoordenadas(coordenadasBairro);
      }
      if (RuasPorBairro[bairro] && RuasPorBairro[bairro].length > 0) {
        setMostrarPickerRua(true);
      }
    }
  };

  const handleRuaChange = (rua: string) => {
    setRuaSelecionada(rua);
    if (rua === "") {
      setCoordenadas({ latitude: -20.5386, longitude: -47.4006 });
    }
  };

  const handleButtonPress = () => {
    if (!bairroSelecionado || (mostrarPickerRua && !ruaSelecionada)) {
      Alert.alert("Seleção inválida", "Por favor, selecione um bairro e uma rua.");
    } else {
      const info = AcidenteDadosPorRua[ruaSelecionada];
      if (info) {
        navigation.navigate('Detail', { bairro: info.bairro, rua: ruaSelecionada });
      } else {
        Alert.alert("Informações não encontradas", "Não há informações disponíveis para esta rua.");
      }
    }
  };

  const getMarkerColor = (ruaSelecionada: string) => {
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

  const markerColor = getMarkerColor(ruaSelecionada);

  const menuOptions = [
    { label: "Notícias", screen: "Notícias" },
    { label: "Dados", screen: "Explorar Dados" },
    { label: "Dicas Educativas", screen: "Dicas de Segurança" },
    { label: "Telefones Úteis", screen: "Telefones Úteis" },
  ];

  const handleMenuOptionPress = (option) => {
    if (option.screen) {
      navigation.navigate(option.screen);
    } else if (option.action) {
      option.action();
    }
    setMenuVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mapa</Text>
        <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
          <Icon name="menu" size={30} color="#000" />
        </TouchableOpacity>
      </View>

      {menuVisible && (
        <View style={styles.dropdownMenu}>
          {menuOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuOption}
              onPress={() => handleMenuOptionPress(option)}
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
        customMapStyle={mapStyle}
      >
        <Marker
          key={markerColor}
          coordinate={{
            latitude: coordenadas.latitude,
            longitude: coordenadas.longitude,
          }}
          pinColor={markerColor}
          onPress={() => {
            let message = '';
            if (markerColor === 'blue') {
              message = 'Sem dados';
            } else if (markerColor === 'green') {
              message = 'Sem acidente';
            } else if (markerColor === 'yellow') {
              message = 'Baixo índice de acidente';
            } else if (markerColor === 'orange') {
              message = 'Médio índice de acidente';
            } else if (markerColor === 'red') {
              message = 'Alto índice de acidente';
            }
            Alert.alert('Informação do Marcador', message);
          }}
        />
      </MapView>

      <View style={styles.overlay}>
      <RNPickerSelect
        onValueChange={handleBairroChange}
        items={bairros.map((bairro) => ({ label: bairro, value: bairro }))}
        style={pickerSelectStyles}
        placeholder={{ label: "Selecione um bairro", value: "" }}
        useNativeAndroidPickerStyle={false}
        Icon={() => {
          return <Icon name="arrow-drop-down" size={24} color="gray" />;
        }}
      />

      {mostrarPickerRua && (
        <RNPickerSelect
          onValueChange={handleRuaChange}
          items={bairroSelecionado && RuasPorBairro[bairroSelecionado].map((rua) => ({ label: rua, value: rua }))}
          style={pickerSelectStyles}
          placeholder={{ label: "Selecione uma rua", value: "" }}
          useNativeAndroidPickerStyle={false}
          Icon={() => {
            return <Icon name="arrow-drop-down" size={24} color="gray" />;
          }}
        />
      )}


        <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
          <Text style={styles.buttonText}>Ver informações sobre essa área</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}


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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 40 : 0,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
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
  headerIcon: {
    position: 'absolute',
    right: 16,
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
    marginTop: 20,
    zIndex: 3,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
});

