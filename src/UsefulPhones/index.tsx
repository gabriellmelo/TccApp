import React from 'react';
import { Text, StyleSheet, TouchableOpacity, Linking, ScrollView } from 'react-native';

const TelefonesUteisScreen = () => {
  const phones = [
    { label: 'Polícia Militar', number: '190' },
    { label: 'Corpo de Bombeiros', number: '193' },
    { label: 'SAMU', number: '192' },
    { label: 'Polícia Civil', number: '197' },
    { label: 'Polícia Federal', number: '194' },
    { label: 'PRF (Polícia Rodoviária Federal)', number: '191' },
    { label: 'ViaPaulista', number: '0800 001 1255' },
  ];

  const EscolherTelefone = (number: string) => {
    Linking.openURL(`tel:${number}`);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {phones.map((phone, index) => (
        <TouchableOpacity key={index} style={styles.phoneButton} onPress={() => EscolherTelefone(phone.number)}>
          <Text style={styles.phoneText}>{phone.label}: {phone.number}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  phoneButton: {
    marginVertical: 10,
    padding: 16,
    backgroundColor: '#007BFF',
    borderRadius: 10,
    width: '100%',
  },
  phoneText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default TelefonesUteisScreen;
