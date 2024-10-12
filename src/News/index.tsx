import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Button } from 'react-native';
import { WebView } from 'react-native-webview';

const noticias = [
  {
    id: 1,
    titulo: "Comerciante faz maquete com 'solução' para trânsito da Portinari",
    descricao: "Projeto artesanal foi desenvolvido para apontar 'soluções' e cobrar melhorias em trecho urbano da rodovia Cândido Portinari.",
    data: '07/05/2024',
    imagem: require('assets/image.png'),
    link: 'https://sampi.net.br/franca/noticias/2831557/franca-e-regiao/2024/05/comerciante-faz-maquete-com-solucao-para-transito-da-portinari'
  },
  {
    id: 2,
    titulo: 'Trânsito assassino: carros e motos matam mais que armas em Franca',
    descricao: 'De acordo com dados divulgados pela PM, nos últimos cinco anos, foram 229 mortes nas ruas, avenidas e rodovias de Franca; motociclistas são as principais vítimas.',
    data: '27/09/2023',
    imagem: require('assets/imagebombeiro.png'),
    link: 'https://sampi.net.br/franca/noticias/2789401/local/2023/09/transito-assassino-carros-e-motos-matam-mais-que-armas-em-franca'
  },
  {
    id: 3,
    titulo: 'Acidente em alça de acesso causa lentidão na rodovia Portinari',
    descricao: 'Colisão entre mociclista e ciclista na alça de acesso da rodovia Cândido Portinari para o Jardim Guanabara, em Franca, deixou duas pessoas feridas.',
    data: '03/06/2024',
    imagem: require('assets/imagelentidao.png'),
    link: 'https://sampi.net.br/franca/noticias/2836946/franca-e-regiao/2024/06/acidente-em-alca-de-acesso-causa-lentidao-na-rodovia-portinari'
  },
  {
    id: 4,
    titulo: 'Produtor rural de Batatais morre em grave acidente em Passos',
    descricao: 'Com a gravidade do impacto, o produtor rural Altair José Capato morreu no local do acidente, sem chances de ser socorrido.',
    data: '03/06/2024',
    imagem: require('assets/imagebombeiro.png'),
    link: 'https://sampi.net.br/franca/noticias/2836833/franca-e-regiao/2024/06/produtor-rural-de-batatais-morre-em-grave-acidente-em-passos'
  },
  {
    id: 5,
    titulo: 'Idoso de 86 anos morre atropelado em Franca',
    descricao: 'Após o acidente, o motorista de veículo não identificado, que atingiu o idoso, fugiu do local.',
    data: '02/06/2024',
    imagem: require('assets/imageidoso.png'),
    link: 'https://sampi.net.br/franca/noticias/2836763/franca-e-regiao/2024/06/idoso-de-86-anos-morre-atropelado-em-franca'
  },
  {
    id: 6,
    titulo: 'Câmera filmou acidente fatal na Av. Santos Dumont; ASSISTA',
    descricao: 'Rafael Batista Borges e seu amigo Fernando Borges da Silva voltavam da Expoagro quando o acidente aconteceu. Aos policiais, Fernando disse que ambos beberam na madrugada.',
    data: '27/05/2024',
    imagem: require('assets/imageacfatal.png'),
    link: 'https://sampi.net.br/franca/noticias/2835630/franca-e-regiao/2024/05/camera-filmou-acidente-fatal-na-av-santos-dumont-assista'
  },
  // Adicione mais notícias aqui
];

const NoticiasScreen = () => {
  const [selecionarNoticia, setSelecionarNoticia] = useState(null);

  const ApertarNoticia = (noticia) => {
    setSelecionarNoticia(noticia);
  };

  const SelecionarVoltar = () => {
    setSelecionarNoticia(null);
  };

  if (selecionarNoticia) {
    return (
      <View style={{ flex: 1 }}>
        <Button title="Voltar" onPress={SelecionarVoltar} />
        <WebView source={{ uri: selecionarNoticia.link }} style={{ flex: 1 }} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {noticias.map(noticia => (
        <TouchableOpacity key={noticia.id} onPress={() => ApertarNoticia(noticia)}>
          <View style={styles.noticiaContainer}>
            <Image source={noticia.imagem} style={styles.imagem} />
            <View style={styles.textContainer}>
              <Text style={styles.titulo}>{noticia.titulo}</Text>
              <Text style={styles.descricao}>{noticia.descricao}</Text>
              <Text style={styles.data}>{noticia.data}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  noticiaContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
  },
  imagem: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  descricao: {
    fontSize: 14,
    marginVertical: 5,
  },
  data: {
    fontSize: 12,
    color: '#666',
  },
});

export default NoticiasScreen;