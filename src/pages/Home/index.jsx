import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Home({ navigation }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };

    checkUserLoggedIn();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("user"); // Remove o usuário do AsyncStorage
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }], // Reinicia a navegação para a tela de login
    });
  };

  const toLoginScreen = () => {
    navigation.navigate("Login");
  };

  const toRegisterScreen = () => {
    navigation.navigate("Register");
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ImageBackground
        source={require("../assets/background.jpg")} // Adicione uma imagem de fundo (opcional)
        style={styles.background}
      >
        <View style={styles.container}>
          {user ? (
            <>
              <Text style={styles.title}>
                Bem-vindo, <Text style={styles.highlight}>{user.username}</Text>
              </Text>
              <Text style={styles.subtitle}>Espero que MãoNaMassa possa te auxiliar a encontrar o serviço que precisa 😁</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.logoutButton} // Aplica o novo estilo
                onPress={handleLogout}
              >
                <Text style={styles.buttonText}>Deslogar</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.title}>
                Bem-vindo à{" "}
                <Text style={styles.highlight}>MãoNaMassa</Text>, o APP que une
                serviços domésticos à tecnologia de forma prática e fácil!
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.button}
                onPress={toLoginScreen}
              >
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.button, styles.secondaryButton]}
                onPress={toRegisterScreen}
              >
                <Text style={styles.buttonText}>Registrar</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ImageBackground>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginBottom: 30,
  },
  highlight: {
    color: "#FF6347",
  },
  button: {
    backgroundColor: "#FF6347",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    marginBottom: 15,
    width: "80%",
  },
  secondaryButton: {
    backgroundColor: "#333",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 25,
    textAlign: "left",
    color: "#555",
    marginBottom: 30,
    fontWeight: "bold",
    padding: 30,
  },
  logoutButton: {
    backgroundColor: "#333",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    width: "80%",
    position: "absolute", // Posiciona o botão de forma absoluta
    bottom: 50, // Distância do fundo da tela
    alignSelf: "center", // Centraliza horizontalmente
  },
});