import React, { useState } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

const ExplorarDadosScreen = () => { // Componente da tela de exploração de dados
  const [loading, setLoading] = useState(true); // Estado para verificar se está carregando

  return ( // Retorna a interface da tela
    <View style={styles.container}>
      {loading && ( // Exibe o indicador de carregamento
        <View style={styles.loadingContainer}> 
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      <WebView // Componente WebView para exibir a página web
        source={{ uri: 'https://eda-acidentes-franca.streamlit.app/' }} // Fonte da página web
        style={{ flex: 1 }} // Estilo do componente
        onLoadEnd={() => setLoading(false)} // Altera o estado ao finalizar o carregamento
      />
    </View>
  );
};

const styles = StyleSheet.create({ // Estilos do componente
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject, // Ocupa toda a tela
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Para uma sobreposição leve
  },
});

export default ExplorarDadosScreen; // Exporta o componente da tela de exploração de dados
