// src/screens/CadastroClienteScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { addCliente } from '../services/ClienteService';

export default function CadastroClienteScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');

  const handleCadastro = async () => {
    if (!nome || !email || !telefone) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    const result = await addCliente({ nome, email, telefone });
    if (result.success) {
      Alert.alert("Sucesso", "Cliente cadastrado!");
      setNome('');
      setEmail('');
      setTelefone('');
      navigation.goBack();
    } else {
      Alert.alert("Erro", "Não foi possível cadastrar o cliente.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Cliente</Text>
      <TextInput
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Telefone"
        value={telefone}
        onChangeText={setTelefone}
        style={styles.input}
        keyboardType="phone-pad"
      />
      <TouchableOpacity style={styles.button} onPress={handleCadastro}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 15 },
  button: { backgroundColor: '#3498db', padding: 15, borderRadius: 8 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' }
});
