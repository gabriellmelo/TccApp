import React from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import Swiper from 'react-native-swiper';

const images = [
  require('assets/acidente_1.jpg'),
  require('assets/acidente_2.jpg'),
  require('assets/acidente_3.jpg'),
  require('assets/acidente_4.jpg'),
  require('assets/acidente_5.jpg'),
  require('assets/acidente_6.jpg')
];

const { width, height } = Dimensions.get('window');

const DicasSegurancaScreen = () => {
  return (
    <View style={styles.container}>
      <Swiper
        loop={false}
        showsPagination={true}
        dot={<View style={styles.dot} />}
        activeDot={<View style={styles.activeDot} />}
        paginationStyle={styles.pagination}
      >
        {images.map((image, index) => (
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

const styles = StyleSheet.create({
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

export default DicasSegurancaScreen;
