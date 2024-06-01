import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import MapView, { Marker } from "react-native-maps";
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { bairros, RuasPorBairro, AcidenteDadosPorRua } from "../Data";
import { CoordenadasPorBairro, CoordenadasPorRua } from "../Coordinates";

type RootStackParamList = {
  Detail: { bairro: string; rua: string; };
};

export default function Home() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [bairroSelecionado, setBairroSelecionado] = useState("");
  const [ruaSelecionada, setRuaSelecionada] = useState("");
  const [mostrarPickerRua, setMostrarPickerRua] = useState(false);
  const [coordenadas, setCoordenadas] = useState<{ latitude: number; longitude: number }>({
    latitude: -20.5386,
    longitude: -47.4006,
  });

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

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        style={styles.map}
        region={{
          latitude: coordenadas.latitude,
          longitude: coordenadas.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
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
            message = 'Baixo indice de acidente';
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