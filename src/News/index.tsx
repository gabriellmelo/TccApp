import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const noticias = [ // Dados das notícias
  {
    id: 1, // Identificador da notícia
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
    imagem: require('assets/imagepassos.png'),
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
  {
    id: 7,
    titulo: 'Médico francano sobrevive a grave acidente perto do Paineirão',
    descricao: 'Veículo do médico francano atingiu a traseira de um caminhão que iria acessar o Posto Paineirão',
    data: '13/10/2024',
    imagem: require('assets/imageCarroMedico.webp'),
    link: 'https://sampi.net.br/franca/noticias/2861942/policia/2024/10/medico-francano-sobrevive-a-grave-acidente-perto-do-paineirao'
  },
  {
    id: 8,
    titulo: 'VÍDEO: Conversão proibida de moto causa grave acidente na Vargasco francano sobrevive a grave acidente perto do Paineirão',
    descricao: 'Uma conversão proibida resultou em um grave acidente na noite desta segunda-feira, 14, no cruzamento da avenida Presidente Vargas com a rua Afonso Pena, na Cidade Nova, região central de Franca.',
    data: '14/10/2024',
    imagem: require('assets/imageVargas.webp'),
    link: 'https://sampi.net.br/franca/noticias/2862124/franca-e-regiao/2024/10/video-conversao-proibida-de-moto-causa-grave-acidente-na-vargas'
  },
  {
    id: 9,
    titulo: 'Colisão na Portinari deixa 3 vítimas presas às ferragens; VÍDEO',
    descricao: 'Caminhão tombou ao atingir mureta de proteção na rodovia Cândido Portinari',
    data: '14/10/2024',
    imagem: require('assets/imageCandidoPortinari.webp'),
    link: 'https://sampi.net.br/franca/noticias/2861944/regiao/2024/10/colisao-na-portinari-deixa-3-vitimas-presas-as-ferragens-video'
  },
  {
    id: 10,
    titulo: "Motorista desrespeita 'pare' e causa acidente no Cidade Nova",
    descricao: 'EcoSport tombou e atingiu outro veículo estacionado',
    data: '14/10/2024',
    imagem: require('assets/imageCidadeNova.webp'),
    link: 'https://sampi.net.br/franca/noticias/2862059/franca-e-regiao/2024/10/motorista-desrespeita-pare-e-causa-acidente-no-cidade-nova'
  },
  {
    id: 11,
    titulo: "Grave acidente entre motos deixa dois feridos em Franca",
    descricao: 'Um grave acidente envolvendo duas motocicletas foi registrado na avenida Major Elias Motta, no bairro Jardim São Luiz, em Franca, no final da tarde deste domingo, 13.',
    data: '14/10/2024',
    imagem: require('assets/imageMoto.webp'),
    link: 'https://sampi.net.br/franca/noticias/2861969/franca-e-regiao/2024/10/grave-acidente-entre-motos-deixa-dois-feridos-em-franca'
  },
  {
    id: 12,
    titulo: "Motoqueiro fica em estado grave após acidente com ciclista",
    descricao: 'Um motociclista de 18 anos ficou em estado grave e um outro rapaz numa bicicleta sofreu ferimentos leves após se envolverem em um acidente de trânsito na noite desta sexta-feira, 11, na rua Érico Veríssimo, no Miramontes, zona norte de Franca.',
    data: '11/10/2024',
    imagem: require('assets/imageSamu.webp'),
    link: 'https://sampi.net.br/franca/noticias/2861969/franca-e-regiao/2024/10/grave-acidente-entre-motos-deixa-dois-feridos-em-franca'
  },
];

const NoticiasScreen = () => { // Componente da tela de notícias
  const [selecionarNoticia, setSelecionarNoticia] = useState(null); // Estado para selecionar notícia

  const ApertarNoticia = (noticia) => { // Função para selecionar notícia
    setSelecionarNoticia(noticia); // Atualiza o estado com a notícia selecionada
  };

  const SelecionarVoltar = () => { // Função para voltar para a lista de notícias
    setSelecionarNoticia(null);  // Limpa o estado da notícia selecionada
  };

  if (selecionarNoticia) { // Verifica se uma notícia foi selecionada
    return ( // Retorna a interface da notícia selecionada
      <View style={{ flex: 1 }}>
        <TouchableOpacity style={styles.voltarButton} onPress={SelecionarVoltar}>
          <View style={styles.voltarButtonContent}>
            <FontAwesome5 name="newspaper" size={24} color="#FFF" />
            <Text style={styles.voltarButtonText}>Voltar para notícias</Text>
          </View>
        </TouchableOpacity>
        <WebView source={{ uri: selecionarNoticia.link }} style={styles.webView} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {noticias.map(noticia => ( // Mapeia as notícias
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

const styles = StyleSheet.create({ // Estilos do componente
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
  voltarButton: {
    position: 'absolute',
    top: 10,
    left: 20,
    right: 20,
    zIndex: 1,
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  voltarButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  voltarButtonText: {
    color: '#FFF',
    fontSize: 16,
    marginLeft: 10, // Espaçamento entre o ícone e o texto
  },
  webView: {
    flex: 1,
    marginTop: 60,
  },
});

export default NoticiasScreen; // Exporta o componente da tela de notícias