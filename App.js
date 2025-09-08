import React, { useEffect, useState } from "react";
import AuthService from "./src/services/AuthService";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import TaskScreen from "./src/screens/TaskScreen";
import { View, Text, ActivityIndicator } from "react-native";

export default function App() {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true); // 👈 controla estado inicial
  const [screen, setScreen] = useState("login"); // login | register | tasks

  useEffect(() => {
    const unsub = AuthService.onAuthChanged((u) => {
      setUser(u);
      if (u) {
        setScreen("tasks");
      } else {
        setScreen("login");
      }
      setInitializing(false); // 👈 só libera UI depois que Firebase responder
    });
    return () => unsub();
  }, []);

  // ⏳ enquanto ainda não sabemos se tem usuário
  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={{ marginTop: 12 }}>Carregando...</Text>
      </View>
    );
  }

  if (!user && screen === "login") {
    return (
      <LoginScreen
        onLogin={() => setScreen("tasks")}
        goToRegister={() => setScreen("register")}
      />
    );
  }

  if (!user && screen === "register") {
    return <RegisterScreen goToLogin={() => setScreen("login")} />;
  }

  if (user && screen === "tasks") {
    return <TaskScreen user={user} />;
  }

  return null;
}
