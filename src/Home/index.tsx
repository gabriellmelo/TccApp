import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, StatusBar } from "react-native";
import { Picker } from "@react-native-picker/picker";
import MapView, { Marker } from "react-native-maps";
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { bairros, RuasPorBairro, AcidenteDadosPorRua } from "../Data";
import { CoordenadasPorBairro, CoordenadasPorRua } from "../Coordinates";

type RootStackParamList = {
  Detail: { bairro: string; rua: string; };
  News: undefined;
  'Safety Tips': undefined;
  'Data': undefined;
  'Useful Phones': undefined;
};

const mapStyle = [
  // Insira seu estilo de mapa personalizado aqui
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
    if (bairro === "") {
      setMostrarPickerRua(false);
      setCoordenadas({ latitude: -20.5386, longitude: -47.4006 }); 
    } else {
      setMostrarPickerRua(true);
      const coordenadasBairro = CoordenadasPorBairro[bairro];
      if (coordenadasBairro) {
        setCoordenadas(coordenadasBairro);
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
    if (!bairroSelecionado || !ruaSelecionada) {
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
    { label: "Notícias", screen: "News" },
    { label: "Dados", screen: "Explore Data" },
    { label: "Dicas Educativas", screen: "Safety Tips" },
    { label: "Telefones Úteis", screen: "Useful Phones" },
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
        <Picker
          style={styles.picker}
          selectedValue={bairroSelecionado}
          onValueChange={handleBairroChange}
        >
          <Picker.Item label="Selecione um bairro" value="" />
          {bairros.map((bairro, index) => (
            <Picker.Item key={index} label={bairro} value={bairro} />
          ))}
        </Picker>

        {mostrarPickerRua && (
          <Picker
            style={styles.picker}
            selectedValue={ruaSelecionada}
            onValueChange={handleRuaChange}
          >
            <Picker.Item label="Selecione uma rua" value="" />
            {bairroSelecionado && RuasPorBairro[bairroSelecionado].map((rua, index) => (
              <Picker.Item key={index} label={rua} value={rua} />
            ))}
          </Picker>
        )}
        <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
          <Text style={styles.buttonText}>Ver informações sobre essa área</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginTop: StatusBar.currentHeight || 0, 
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 100, 
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
  },
  overlay: {
    position: 'absolute',
    bottom: 30,
    backgroundColor: 'white',
    width: '90%',
    padding: 20,
    borderRadius: 20,
    alignSelf: 'center',
  },
  picker: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  button: {
    backgroundColor: '#322153',
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
});
