import React from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const LoadingSpinner = () => {
  return (
    <View style={styles.container}>
      <LottieView
        source={require('./spinner.json')}
        autoPlay
        loop
        style={styles.spinner}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    width: 100,
    height: 100,
  },
});

export default LoadingSpinner;