import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const carouselItems = [
  {
    title: "Bem-vindo!",
    text: "O aplicativo foi desenvolvido para fornecer uma visão detalhada sobre a recorrência de acidentes na cidade de Franca, usando dados de fontes oficiais. Nossa missão é democratizar o acesso a essas informações, tornando os dados de acidentes acessíveis a todos. ",
    icon: "info"
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
  }
];

const { width, height } = Dimensions.get('window');

const CarouselScreen = ({ navigation }) => {
  const handleIndexChanged = (index) => {
    if (index === carouselItems.length - 1) {
      setTimeout(() => {
        navigation.navigate('Home');
      }, 4000); 
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Swiper
        loop={false}
        showsPagination={true}
        onIndexChanged={handleIndexChanged}
        containerStyle={styles.swiperContainer} 
        style={styles.swiper} 
        activeDotStyle={styles.activeDot}
        dotStyle={styles.dot}
      >
        {carouselItems.map((item, index) => (
          <View style={styles.slide} key={index}>
            <Icon name={item.icon} size={50} color="#322153" style={styles.icon} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.text}>{item.text}</Text>
          </View>
        ))}
      </Swiper>
      <TouchableOpacity style={styles.skipButton} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.skipButtonText}>Pular</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#322153',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    color: '#666',
  },
  activeDot: {
    backgroundColor: '#322153',
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
    backgroundColor: '#322153',
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

export default CarouselScreen;