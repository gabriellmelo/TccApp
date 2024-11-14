import React from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import Swiper from 'react-native-swiper';

const images = [ // Imagens para exibição
  require('assets/acidente_1.jpg'), // Importa a imagem
  require('assets/acidente_2.jpg'),
  require('assets/acidente_3.jpg'),
  require('assets/acidente_4.jpg'),
  require('assets/acidente_5.jpg'),
  require('assets/acidente_6.jpg')
];

const { height } = Dimensions.get('window'); // Pega as dimensões da tela

const DicasSegurancaScreen = () => { // Componente da tela de dicas de segurança
  return (
    <View style={styles.container}>
      <Swiper // Componente Swiper para exibir as imagens
        loop={false} // Desabilita o loop
        showsPagination={true} // Exibe a paginação
        dot={<View style={styles.dot} />} // Estilo do ponto
        activeDot={<View style={styles.activeDot} />} // Estilo do ponto ativo
        paginationStyle={styles.pagination} // Estilo da paginação
      >
        {images.map((image, index) => ( // Mapeia as imagens
          <View style={styles.slide} key={index}> 
            <View style={styles.imageWrapper}>
              <Image source={image} style={styles.image} resizeMode="contain" />  
            </View>
          </View>
        ))}
      </Swiper>
    </View>
  );
};

const styles = StyleSheet.create({ // Estilos do componente
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingBottom: height * 0.2,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  imageWrapper: {
    width: '90%',
    height: '95%',
    marginTop: 20,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#eee',
    borderWidth: 0.5,
    borderColor: '#007BFF',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  activeDot: {
    backgroundColor: '#007BFF',
    width: 12,
    height: 12,
    borderRadius: 6,
    margin: 5,
  },
  dot: {
    backgroundColor: '#ccc',
    width: 10,
    height: 10,
    borderRadius: 5,
    margin: 5,
  },
  pagination: {
    top: height * 0.9,
    position: 'absolute',
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DicasSegurancaScreen; // Exporta o componente
