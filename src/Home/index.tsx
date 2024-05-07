import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import MapView, { Marker } from "react-native-maps";
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { bairros, RuasPorBairro, AcidenteDadosPorRua } from "../Data";
import { CoordenadasPorRua } from "../Coordinates";

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
    } else {
      setMostrarPickerRua(true);
    }
  };

  const handleRuaChange = (rua: string) => {
    setRuaSelecionada(rua);
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
          coordinate={{
            latitude: coordenadas.latitude,
            longitude: coordenadas.longitude,
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
