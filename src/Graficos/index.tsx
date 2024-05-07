import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Graficos() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gráficos</Text>
      <Text style={styles.text}>Aqui você pode adicionar seus gráficos e visualizações de dados!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
});
