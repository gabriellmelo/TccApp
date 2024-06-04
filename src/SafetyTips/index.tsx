import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const DicasSegurancaScreen = () => {
  return (
    <View style={styles.container}>
      <WebView 
        source={{ uri: 'http://www.ccb.policiamilitar.sp.gov.br/portal_conteudo/_lib/file/midia/Dicas-acidentes-de-transito.jpg' }}
        style={styles.webview}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});

export default DicasSegurancaScreen;