import React, { useEffect, useMemo, useState } from 'react';
import {
  SafeAreaView, View, Text, TextInput, TouchableOpacity,
  FlatList, Alert, StyleSheet, Platform
} from 'react-native';

import TodoRepository from './src/repositories/TodoRepository';
import Todo from './src/models/Todo';
import TodoItem from './src/components/TodoItem';
import AuthService from './src/services/AuthService';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';

export default function App() {
  const repo = useMemo(() => new TodoRepository(), []);
  const [user, setUser] = useState(null);
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [screen, setScreen] = useState("login"); // "login" | "register" | "tasks"

  // 🔐 observa login/logout
  useEffect(() => {
    const unsub = AuthService.onAuthChanged((u) => {
      setUser(u);
      if (u) setScreen("tasks");
      else setScreen("login");
    });
    return () => unsub();
  }, []);

  // 🔄 observa tarefas
  useEffect(() => {
    if (!user) return;
    const unsubscribe = repo.subscribe(user.uid, setTodos);
    return () => unsubscribe && unsubscribe();
  }, [user, repo]);

  // ➕ criar / atualizar
  const handleSubmit = async () => {
    const trimmed = title.trim();
    if (!trimmed) return Alert.alert('Validação', 'Digite um título.');
    try {
      if (editingId) {
        await repo.update(user.uid, editingId, { title: trimmed });
        setEditingId(null);
      } else {
        const todo = new Todo({ title: trimmed });
        await repo.create(user.uid, todo);
      }
      setTitle('');
    } catch (e) {
      Alert.alert('Erro', e?.message ?? 'Falha ao salvar.');
    }
  };

  // ✅ alternar concluído
  const handleToggle = async (item) => {
    try {
      await repo.toggleDone(user.uid, item.id, !item.done);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível atualizar.');
    }
  };

  // ✏️ editar
  const handleEdit = (item) => {
    setEditingId(item.id);
    setTitle(item.title);
  };

  // ❌ excluir
  const handleDelete = (item) => {
    Alert.alert('Excluir', `Deseja excluir "${item.title}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await repo.delete(user.uid, item.id);
          } catch (e) {
            Alert.alert('Erro', 'Falha ao excluir: ' + e.message);
          }
        }
      }
    ]);
  };

  // 🔄 logout
  const handleLogout = async () => {
    try {
      await AuthService.logout();
    } catch (e) {
      Alert.alert('Erro', e.message);
    }
  };

  // renderiza cada tarefa
  const renderItem = ({ item }) => (
    <TodoItem item={item} onToggle={handleToggle} onEdit={handleEdit} onDelete={handleDelete} />
  );

  // fluxos de tela
  if (screen === "login") return <LoginScreen onLogin={() => setScreen("tasks")} goToRegister={() => setScreen("register")} />;
  if (screen === "register") return <RegisterScreen goToLogin={() => setScreen("login")} />;

  // tela principal (lista de tarefas)
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.h1}>Minhas Tarefas</Text>

        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>

        <View style={styles.form}>
          <TextInput
            placeholder={editingId ? 'Edite o título...' : 'Nova tarefa...'}
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
            <Text style={styles.primaryBtnText}>{editingId ? 'Atualizar' : 'Adicionar'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listHeader}>
          <Text style={styles.counter}>Total: {todos.length}</Text>
          <Text style={styles.hint}>
            {Platform.select({
              ios: 'Toque para concluir/retomar',
              android: 'Toque para concluir/retomar',
              web: 'Clique para concluir/retomar'
            })}
          </Text>
        </View>

        <FlatList
          data={todos}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 40 }}
          ListEmptyComponent={<Text style={styles.empty}>Nenhuma tarefa ainda. Adicione uma! ✨</Text>}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f6f7fb' },
  container: { flex: 1, padding: 16, maxWidth: 720, width: '100%', alignSelf: 'center' },
  h1: { fontSize: 28, fontWeight: '700', marginBottom: 12, color: '#111' },
  form: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  input: { flex: 1, backgroundColor: '#fff', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, fontSize: 16, borderWidth: 1, borderColor: '#e5e7eb' },
  primaryBtn: { backgroundColor: '#111827', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  primaryBtnEdit: { backgroundColor: '#2563eb' },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  listHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  counter: { color: '#374151' },
  hint: { color: '#6b7280', fontSize: 12 },
  empty: { textAlign: 'center', color: '#6b7280', marginTop: 40, fontSize: 16 },
  logoutBtn: { alignSelf: 'flex-end', marginBottom: 10, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#fdecea', borderRadius: 8 },
  logoutText: { color: '#c0392b', fontWeight: '600' }
});
