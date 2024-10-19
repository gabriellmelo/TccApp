import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const itensCarrosel = [ // Itens do carrossel
  {
    title: "Bem-vindo!", // Título do slide
    text: "O aplicativo foi desenvolvido para fornecer uma visão detalhada sobre a recorrência de acidentes na cidade de Franca, usando dados de fontes oficiais. Nossa missão é democratizar o acesso a essas informações, tornando os dados de acidentes acessíveis a todos.",
    icon: "info" // Ícone do slide
  },
  {
    title: "Informações Detalhadas",
    text: "Veja informações detalhadas sobre acidentes nas principais vias da cidade. Saiba onde os acidentes ocorrem com maior frequência e os fatores envolvidos, ajudando você a tomar decisões mais seguras no trânsito.",
    icon: "description"
  },
  {
    title: "Notícias",
    text: "Fique atualizado com as últimas notícias sobre acidentes na cidade. Nosso app traz as informações mais recentes para mantê-lo informado sobre eventos e mudanças que podem impactar sua segurança no trânsito.",
    icon: "article"
  },
  {
    title: "Análise de Dados",
    text: "Explore uma análise aprofundada dos dados de acidentes de Franca nos últimos 5 anos. Entenda tendências, padrões e estatísticas importantes que podem ajudar na prevenção de futuros acidentes.",
    icon: "bar-chart"
  },
  {
    title: "Dicas de Segurança no Trânsito",
    text: "Aprimore sua segurança no trânsito com nossas dicas especializadas. Aprenda práticas recomendadas e medidas preventivas que você pode adotar para proteger a si mesmo e aos outros.",
    icon: "security"
  },
  {
    title: "Telefones Úteis",
    text: "Tenha à mão uma lista de telefones úteis dos órgãos de segurança. Em caso de emergência ou para reportar um acidente, você saberá exatamente para quem ligar.",
    icon: "phone"
  },
  {
    title: "Marcadores de Acidentes",
    text: "Os marcadores são utilizados para indicar a frequência de acidentes nas vias, com as cores representando o nível de gravidade.",
    icon: "location-on",
  },
];

const { width, height } = Dimensions.get('window'); // Obtém as dimensões da tela

const CarrosselScreen = ({ navigation }) => { // Componente do carrossel
  const [isUltimoSlide, setIsUltimoSlide] = useState(false); // Estado para verificar se está no último slide

  const MudancaIndice = (index) => { // Função para verificar o índice do slide
    if (index === itensCarrosel.length - 1) { // Verifica se está no último slide
      setIsUltimoSlide(true);
    } else { // Se não estiver no último slide, atualiza o estado
      setIsUltimoSlide(false);
    }
  };

  const Pular = () => { // Função para pular o carrossel
    navigation.navigate('Home'); // Navega para a tela inicial
  }; 

  return (
    <SafeAreaView style={styles.container}>
      <Swiper  // Componente do carrossel
        loop={false}  // Desabilita o loop do carrossel
        showsPagination={true} // Exibe a paginação
        onIndexChanged={MudancaIndice} // Chama a função ao mudar de slide
        containerStyle={styles.swiperContainer} // Estilo do container do carrossel
        style={styles.swiper} // Estilo do carrossel
        activeDotStyle={styles.activeDot} // Estilo do ponto ativo
        dotStyle={styles.dot} // Estilo do ponto
      >
        {itensCarrosel.map((item, index) => ( // Mapeia os itens do carrossel
          <View style={styles.slide} key={index}> 
            <Icon name={item.icon} size={50} color="#322153" style={styles.icon} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.text}>{item.text}</Text>
          </View>
        ))}
      </Swiper>
      {isUltimoSlide ? ( // Verifica se está no último slide
        <TouchableOpacity style={styles.skipButton} onPress={Pular}>
          <Text style={styles.skipButtonText}>Ir para o Mapa</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.skipButton} onPress={Pular}> 
          <Text style={styles.skipButtonText}>Pular</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({ // Estilos do componente
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  swiperContainer: {
    height: height * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  swiper: {
    marginTop: 110,
  },
  slide: {
    backgroundColor: '#fff',
    borderRadius: 10,
    height: height * 0.5,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: width * 0.8,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 8,
  },
  icon: {
    marginBottom: 20,
    color: '#007BFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#007BFF',
  },
  text: {
    fontSize: 16,
    textAlign: 'justify',
    marginTop: 10,
    color: '#666',
  },
  activeDot: {
    backgroundColor: '#007BFF',
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 3,
  },
  dot: {
    backgroundColor: '#ccc',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  skipButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.8,
  },
  skipButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default CarrosselScreen; // Exporta o componente do carrossel
