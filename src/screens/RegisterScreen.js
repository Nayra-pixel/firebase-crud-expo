import React, { useState } from "react";
import { View, TextInput, Button, Alert, StyleSheet, Text, TouchableOpacity } from "react-native";
import AuthService from "../services/AuthService";

export default function RegisterScreen({ goToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    console.log("Tentando registrar:", email, password); // 🔍 debug
    try {
      await AuthService.register(email, password);
      Alert.alert("Sucesso", "Conta criada! Agora faça login.");
      goToLogin(); // volta pro login
    } catch (e) {
      console.error("Erro no cadastro:", e); // 🔍 debug
      Alert.alert("Erro", e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Conta</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Cadastrar" onPress={handleRegister} />
      <TouchableOpacity onPress={goToLogin} style={styles.linkBtn}>
        <Text style={styles.linkText}>Já tenho conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, marginBottom: 10, padding: 8, borderRadius: 6 },
  linkBtn: { marginTop: 16, alignItems: "center" },
  linkText: { color: "#2563eb", fontWeight: "600" },
});
