import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Picker } from '@react-native-picker/picker';

const MinimalistScreen = () => {
  const [bairroSelecionado, setBairroSelecionado] = useState('');
  const [ruaSelecionada, setRuaSelecionada] = useState('');
  const [ruasPorBairro, setRuasPorBairro] = useState({});
  const [dadosAcidente, setDadosAcidente] = useState({});
  const [aviso, setAviso] = useState('');

  useEffect(() => {
    // Adicionar todos os outros bairros de Franca aqui
    const bairros = [
      'Centro',
      'Vila Santa Cruz',
      'Parque Vicente Leporace',
      'Jardim Alvorada',
      'Cidade Nova',
    ];

    // Preencher todos os bairros e avenidas e respectivos dados que estejam no csv de análise de dados. (Abaixo dados mockados para teste)
    const dadosAcidentes = {
      'Centro': {
        'Rua Monsenhor Rosa': {
          bairro: 'Centro',
          indiceAcidentes: 10,
          horarioMaiorIncidencia: '18h às 20h',
          causasMaisFrequentes: ['Desrespeito à sinalização', 'Excesso de velocidade', 'Falta de atenção'],
          rotasAlternativas: ['Avenida Presidente Vargas', 'Rua Major Claudiano', 'Rua General Osório'],
        },
      },
      'Jardim Alvorada': {
        'Avenida Paulo VI': {
          bairro: 'Jardim Alvorada',
          indiceAcidentes: 10,
          horarioMaiorIncidencia: '18h às 20h',
          causasMaisFrequentes: ['Desrespeito à sinalização', 'Excesso de velocidade', 'Falta de atenção'],
          rotasAlternativas: ['Avenida Presidente Vargas', 'Rua Major Claudiano', 'Rua General Osório'],
        },
    },
      'Parque Vicente Leporace': {
        'Avenida Doutor Abrahão Brickmann': {
          bairro: 'Parque Vicente Leporace',
          indiceAcidentes: 10,
          horarioMaiorIncidencia: '18h às 20h',
          causasMaisFrequentes: ['Desrespeito à sinalização', 'Excesso de velocidade', 'Falta de atenção'],
          rotasAlternativas: ['Avenida Presidente Vargas', 'Rua Major Claudiano', 'Rua General Osório'],
        },
    },
  };
    //Preencher com as principais ruas/avenidas que aparecerão nos filtros. 
    setRuasPorBairro({
      'Centro': ['Rua Monsenhor Rosa', 'Avenida Presidente Vargas', 'Rua Major Claudiano', 'Rua General Osório', 'Rua do Comércio'],
      'Vila Santa Cruz': ['Antônio Scarabucci', 'Rua B', 'Rua C'],
      'Parque Vicente Leporace': ['Avenida Doutor Abrahão Brickmann', 'Avenida Geralda Rocha Silva', 'Avenida Lisete Coelho Lourenço'],
      'Jardim Alvorada': ['Avenida Paulo VI', 'Rua K', 'Rua L'],
      'Cidade Nova': ['Avenida Presidente Vargas', 'Avenida Major Nicácio', 'Rua Álvaro Abranches'],
    });

    setDadosAcidente(dadosAcidentes);
  }, []);

  const handleBairroChange = (bairro) => {
    setBairroSelecionado(bairro);
    setRuaSelecionada('');
    setAviso('');
  };

  const handleRuaChange = (rua) => {
    if (!bairroSelecionado) {
      setAviso('Selecione primeiro um bairro.');
      return;
    }
    setRuaSelecionada(rua);
    setAviso('');
  };
//refatorar -- necessário retornar mensagem de erro somente quando dadosAcidentes não conter infos sobre bairro selecionado.
  const renderDadosAcidente = () => {
    if (
      !ruaSelecionada ||
      !dadosAcidente[bairroSelecionado] ||
      !dadosAcidente[bairroSelecionado][ruaSelecionada] ||
      !ruasPorBairro[bairroSelecionado]
    ) {
      return <Text style={styles.aviso}>Não há dados disponíveis para esta rua.</Text>;
    }

    const dados = dadosAcidente[bairroSelecionado][ruaSelecionada];

    return (
      <View>
        <Text style={styles.titulo}>Na {ruaSelecionada}, encontramos as seguintes informações:</Text>
        <Text style={styles.texto}><Text style={styles.negrito}>Bairro:</Text> {dados.bairro}</Text>
        <Text style={styles.texto}><Text style={styles.negrito}>Rua/Avenida:</Text> {ruaSelecionada}</Text>
        <Text style={styles.texto}><Text style={styles.negrito}>Índice de acidentes nos últimos 5 anos:</Text> {dados.indiceAcidentes}</Text>
        <Text style={styles.texto}><Text style={styles.negrito}>Horário com maior incidência:</Text> {dados.horarioMaiorIncidencia}</Text>
        <Text style={styles.texto}><Text style={styles.negrito}>Causas mais frequentes:</Text></Text>
        <View>
          {dados.causasMaisFrequentes.map((causa, index) => (
            <Text key={index} style={styles.texto}>
              {causa}
            </Text>
          ))}
        </View>
        <Text style={styles.texto}><Text style={styles.negrito}>Rotas alternativas:</Text></Text>
        <View>
          {dados.rotasAlternativas.map((rota, index) => (
            <Text key={index} style={styles.texto}>
              {rota}
            </Text>
          ))}
        </View>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -20.5386, // Latitude de Franca/SP
          longitude: -47.4006, // Longitude de Franca/SP
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {ruasPorBairro[bairroSelecionado]?.map((rua, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: -20.55 + index * 0.01, longitude: -47.4 + index * 0.01 }}
            pinColor={'red'}
            title={rua}
          />
        ))}
      </MapView>
      <Text style={styles.titulo}>Estatísticas por bairro</Text>
      <Picker
        style={styles.picker}
        selectedValue={bairroSelecionado}
        onValueChange={handleBairroChange}>
        <Picker.Item label="Selecione um bairro" value="" />
        {Object.keys(ruasPorBairro).map((bairro, index) => (
          <Picker.Item key={index} label={bairro} value={bairro} />
        ))}
      </Picker>
      {aviso ? <Text style={styles.aviso}>{aviso}</Text> : null}
      {bairroSelecionado && (
        <Picker
          style={styles.picker}
          selectedValue={ruaSelecionada}
          onValueChange={handleRuaChange}>
          <Picker.Item label="Selecione uma rua/avenida" value="" />
          {ruasPorBairro[bairroSelecionado]?.map((rua, index) => (
            <Picker.Item key={index} label={rua} value={rua} />
          ))}
        </Picker>
      )}
      {renderDadosAcidente()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: 300,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  texto: {
    fontSize: 16,
    marginTop: 5,
  },
  picker: {
    width: '80%',
    marginTop: 10,
    marginBottom: 20,
  },
  aviso: {
    color: 'red',
    fontSize: 12,
    marginBottom: 5,
  },
  negrito: {
    fontWeight: 'bold',
  },
});

export default MinimalistScreen;
