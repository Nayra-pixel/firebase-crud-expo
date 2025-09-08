import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
  Platform,
} from "react-native";

import TodoItem from "../components/TodoItem";
import useTodos from "../hooks/FunctionsCrud";
import AuthService from "../services/AuthService";

export default function TaskScreen({ user }) {
  const {
    todos,
    editingId,
    setEditingId,
    createTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
  } = useTodos(user);

  const [title, setTitle] = useState("");

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await updateTodo(editingId, title);
        setEditingId(null);
      } else {
        await createTodo(title);
      }
      setTitle("");
    } catch (e) {
      Alert.alert("Erro", e.message);
    }
  };

  const handleToggle = async (item) => {
    try {
      await toggleTodo(item.id, !item.done);
    } catch {
      Alert.alert("Erro", "Não foi possível atualizar.");
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setTitle(item.title);
  };

  const handleDelete = (item) => {
    Alert.alert("Excluir", `Deseja excluir "${item.title}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteTodo(item.id);
          } catch (e) {
            Alert.alert("Erro", "Falha ao excluir: " + e.message);
          }
        },
      },
    ]);
  };

  const handleLogout = async () => {
    try {
      await AuthService.logout();
    } catch (e) {
      Alert.alert("Erro", e.message);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.h1}>Minhas Tarefas</Text>

        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>

        <View style={styles.form}>
          <TextInput
            placeholder={editingId ? "Edite o título..." : "Nova tarefa..."}
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
          />
          <TouchableOpacity
            onPress={handleSubmit}
            style={[styles.primaryBtn, editingId && styles.primaryBtnEdit]}
          >
            <Text style={styles.primaryBtnText}>
              {editingId ? "Atualizar" : "Adicionar"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listHeader}>
          <Text style={styles.counter}>Total: {todos.length}</Text>
          <Text style={styles.hint}>
            {Platform.select({
              ios: "Toque para concluir/retomar",
              android: "Toque para concluir/retomar",
              web: "Clique para concluir/retomar",
            })}
          </Text>
        </View>

        <FlatList
          data={todos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TodoItem
              item={item}
              onToggle={handleToggle}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
          contentContainerStyle={{ paddingBottom: 40 }}
          ListEmptyComponent={
            <Text style={styles.empty}>
              Nenhuma tarefa ainda. Adicione uma! ✨
            </Text>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f6f7fb" },
  container: {
    flex: 1,
    padding: 16,
    maxWidth: 720,
    width: "100%",
    alignSelf: "center",
  },
  h1: { fontSize: 28, fontWeight: "700", marginBottom: 12, color: "#111" },
  form: { flexDirection: "row", gap: 8, marginBottom: 12 },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  primaryBtn: {
    backgroundColor: "#111827",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnEdit: { backgroundColor: "#2563eb" },
  primaryBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  counter: { color: "#374151" },
  hint: { color: "#6b7280", fontSize: 12 },
  empty: {
    textAlign: "center",
    color: "#6b7280",
    marginTop: 40,
    fontSize: 16,
  },
  logoutBtn: {
    alignSelf: "flex-end",
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#fdecea",
    borderRadius: 8,
  },
  logoutText: { color: "#c0392b", fontWeight: "600" },
});
