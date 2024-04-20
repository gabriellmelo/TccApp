import { Picker } from "@react-native-picker/picker";
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { WebView } from 'react-native-webview';

interface AcidenteDados {
  bairro: string;
  indiceAcidentes: number;
  horarioMaiorIncidencia: string;
  causasMaisFrequentes: string[];
  rotasAlternativas: string[];
}

interface AcidenteDadosPorBairro {
  [key: string]: {
    [key: string]: AcidenteDados;
  };
}

const ScreenView: React.FC = () => {
  const [bairroSelecionado, setBairroSelecionado] = useState<string>("");
  const [ruaSelecionada, setRuaSelecionada] = useState<string>("");
  const [ruasPorBairro, setRuasPorBairro] = useState<{
    [key: string]: string[];
  }>({});
  const [dadosAcidente, setDadosAcidente] = useState<AcidenteDadosPorBairro>(
    {}
  );
  const [aviso, setAviso] = useState<string>("");

  useEffect(() => {
    // Adicionar todos os outros bairros de Franca aqui
    const bairros = [
      "Centro",
      "Vila Santa Cruz",
      "Parque Vicente Leporace",
      "Jardim Alvorada",
      "Cidade Nova",
    ];

    // Preencher todos os bairros e avenidas e respectivos dados que estejam no csv de análise de dados. (Abaixo dados mockados para teste)
    const dadosAcidentes: AcidenteDadosPorBairro = {
      Centro: {
        "Rua Monsenhor Rosa": {
          bairro: "Centro",
          indiceAcidentes: 10,
          horarioMaiorIncidencia: "18h às 20h",
          causasMaisFrequentes: [
            "Desrespeito à sinalização",
            "Excesso de velocidade",
            "Falta de atenção",
          ],
          rotasAlternativas: [
            "Avenida Presidente Vargas",
            "Rua Major Claudiano",
            "Rua General Osório",
          ],
        },
      },
      "Jardim Alvorada": {
        "Avenida Paulo VI": {
          bairro: "Jardim Alvorada",
          indiceAcidentes: 10,
          horarioMaiorIncidencia: "18h às 20h",
          causasMaisFrequentes: [
            "Desrespeito à sinalização",
            "Excesso de velocidade",
            "Falta de atenção",
          ],
          rotasAlternativas: [
            "Avenida Presidente Vargas",
            "Rua Major Claudiano",
            "Rua General Osório",
          ],
        },
      },
      "Parque Vicente Leporace": {
        "Avenida Doutor Abrahão Brickmann": {
          bairro: "Parque Vicente Leporace",
          indiceAcidentes: 10,
          horarioMaiorIncidencia: "18h às 20h",
          causasMaisFrequentes: [
            "Desrespeito à sinalização",
            "Excesso de velocidade",
            "Falta de atenção",
          ],
          rotasAlternativas: [
            "Avenida Presidente Vargas",
            "Rua Major Claudiano",
            "Rua General Osório",
          ],
        },
      },
    };

    // Preencher com as principais ruas/avenidas que aparecerão nos filtros.
    setRuasPorBairro({
      Centro: [
        "Rua Monsenhor Rosa",
        "Avenida Presidente Vargas",
        "Rua Major Claudiano",
        "Rua General Osório",
        "Rua do Comércio",
      ],
      "Vila Santa Cruz": ["Antônio Scarabucci", "Rua B", "Rua C"],
      "Parque Vicente Leporace": [
        "Avenida Doutor Abrahão Brickmann",
        "Avenida Geralda Rocha Silva",
        "Avenida Lisete Coelho Lourenço",
      ],
      "Jardim Alvorada": ["Avenida Paulo VI", "Rua K", "Rua L"],
      "Cidade Nova": [
        "Avenida Presidente Vargas",
        "Avenida Major Nicácio",
        "Rua Álvaro Abranches",
      ],
    });

    setDadosAcidente(dadosAcidentes);
  }, []);

  const handleBairroChange = (bairro: string) => {
    setBairroSelecionado(bairro);
    setRuaSelecionada("");
    setAviso("");
  };

  const handleRuaChange = (rua: string) => {
    if (!bairroSelecionado) {
      setAviso("Selecione primeiro um bairro.");
      return;
    }
    setRuaSelecionada(rua);
    setAviso("");
  };

  const generateChartHTML = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
          <script type="text/javascript">
            google.charts.load('current', {'packages':['corechart']});
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
              var data = google.visualization.arrayToDataTable([
                ['Task', 'Hours per Day'],
                ['Work',     11],
                ['Eat',      2],
                ['Commute',  2],
                ['Watch TV', 2],
                ['Sleep',    7]
              ]);

              var options = {
                title: 'My Daily Activities'
              };

              var chart = new google.visualization.PieChart(document.getElementById('piechart'));

              chart.draw(data, options);
            }
          </script>
        </head>
        <body>
          <div id="piechart" style="width: 100%; height: 300px;"></div>
        </body>
      </html>
    `;
  };

  const renderBarChart = () => {
    if (!bairroSelecionado || bairroSelecionado !== "Centro" || !dadosAcidente[bairroSelecionado] || !dadosAcidente[bairroSelecionado][ruaSelecionada]) return null;

    const script = `
      google.charts.load('current', { packages: ['corechart'] });
      google.charts.setOnLoadCallback(drawChart);

      function drawChart() {
        var data = google.visualization.arrayToDataTable([
          ['Horário', 'Índice de Acidentes'],
          ['00:00', 5],
          ['01:00', 8],
          ['02:00', 12],
          // Adicione mais dados conforme necessário
        ]);

        var options = {
          title: 'Horários de Pico de Movimento',
          chartArea: { width: '50%' },
          hAxis: {
            title: 'Horário',
            minValue: 0,
          },
          vAxis: {
            title: 'Índice de Acidentes',
          },
        };

        var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
        chart.draw(data, options);
      }
    `;

    return (
      <WebView
        originWhitelist={['*']}
        source={{ html: `<html><head><script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script></head><body><div id="chart_div" style="width: 100%; height: 300px;"></div><script>${script}</script></body></html>` }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
      />
    );
  };

  const renderDadosAcidente = () => {
    if (
      !ruaSelecionada ||
      !dadosAcidente[bairroSelecionado] ||
      !(dadosAcidente[bairroSelecionado] instanceof Object) ||
      !dadosAcidente[bairroSelecionado][ruaSelecionada] ||
      !ruasPorBairro[bairroSelecionado] ||
      !(ruasPorBairro[bairroSelecionado] instanceof Array)
    ) {
      return (
        <Text style={styles.aviso}>
          Não há dados disponíveis para essa seleção.
        </Text>
      );
    }

    const dados = dadosAcidente[bairroSelecionado][ruaSelecionada];

    return (
      <View style={styles.dadosContainer}>
        <Text style={styles.titulo}>
          Na {ruaSelecionada}, encontramos as seguintes informações:
        </Text>
        <Text style={styles.texto}>
          <Text style={styles.negrito}>Bairro:</Text> {dados.bairro}
        </Text>
        <Text style={styles.texto}>
          <Text style={styles.negrito}>Rua/Avenida:</Text> {ruaSelecionada}
        </Text>
        <Text style={styles.texto}>
          <Text style={styles.negrito}>
            Índice de acidentes nos últimos 5 anos:
          </Text>{" "}
          {dados.indiceAcidentes}
        </Text>
        <Text style={styles.texto}>
          <Text style={styles.negrito}>Horário com maior incidência:</Text>{" "}
          {dados.horarioMaiorIncidencia}
        </Text>
        <Text style={styles.texto}>
          <Text style={styles.negrito}>Causas mais frequentes:</Text>
        </Text>
        <View>
          {dados.causasMaisFrequentes.map((causa, index) => (
            <Text key={index} style={styles.texto}>
              {causa}
            </Text>
          ))}
        </View>
        <Text style={styles.texto}>
          <Text style={styles.negrito}>Rotas alternativas:</Text>
        </Text>
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
        {ruasPorBairro[bairroSelecionado] &&
          ruasPorBairro[bairroSelecionado].map((rua, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: -20.55 + index * 0.01,
                longitude: -47.4 + index * 0.01,
              }}
              pinColor={"red"}
              title={rua}
            />
          ))}
      </MapView>
      <Text style={styles.titulo}>Estatísticas por bairro</Text>
      <Picker
        style={styles.picker}
        selectedValue={bairroSelecionado}
        onValueChange={handleBairroChange}
      >
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
          onValueChange={handleRuaChange}
        >
          <Picker.Item label="Selecione uma rua/avenida" value="" />
          {ruasPorBairro[bairroSelecionado]?.map((rua, index) => (
            <Picker.Item key={index} label={rua} value={rua} />
          ))}
        </Picker>
      )}
      {renderBarChart()}
      {renderDadosAcidente()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  dadosContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  map: {
    width: "100%",
    height: 300,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  texto: {
    fontSize: 16,
    marginTop: 5,
  },
  picker: {
    width: "80%",
    marginTop: 10,
    marginBottom: 20,
  },
  aviso: {
    color: "red",
    fontSize: 12,
    marginBottom: 5,
  },
  negrito: {
    fontWeight: "bold",
  },
});

export default ScreenView;
