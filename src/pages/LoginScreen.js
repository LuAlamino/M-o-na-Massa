import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome"; // Para ícones

export default function Login({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Verifica se o usuário já está logado ao abrir a tela
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        navigation.replace("Home"); // Redireciona para a tela Home se o usuário já estiver logado
      }
    };

    checkUserLoggedIn();
  }, []);

    const exibirUsuarioLogado = async () => {
  const userData = await AsyncStorage.getItem("user");
  
};

// Chame a função para exibir o usuário logado
exibirUsuarioLogado();
  // Função para lidar com o login
  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Erro", "Por favor, preencha os campos corretamente.");
      return;
    }

    // Verifica se é o administrador fixo
    if (username === "admin" && password === "admin123") {
      await AsyncStorage.setItem(
        "user",
        JSON.stringify({ id: "admin", username: "admin", role: "admin" }) // Adiciona o ID do admin
      );
      navigation.replace("Home");
      return;
    }

    // Busca os usuários registrados no AsyncStorage
    const users = JSON.parse(await AsyncStorage.getItem("users")) || [];
    const user = users.find((u) => u.username === username && u.password === password);

    if (user) {
      await AsyncStorage.setItem(
        "user",
        JSON.stringify({ id: user.id, username: user.username, role: "user" }) // Adiciona o ID do usuário
      );
      console.log("Usuário logado:", { id: user.id, username: user.username, role: "user" }); // Log para depuração
      navigation.replace("Home");
    } else {
      Alert.alert("Erro", "Usuário ou senha incorretos.");
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/logo.png")} // Use a logo como plano de fundo
      style={styles.background}
      resizeMode="cover" // Ajusta a imagem para cobrir toda a tela
    >
      <View style={styles.container}>
        <Text style={styles.title}>Bem-vindo de volta!</Text>

        {/* Campo de usuário */}
        <View style={styles.inputContainer}>
          <Icon name="user" size={20} color="#999" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Nome de usuário"
            placeholderTextColor="#999"
            value={username}
            onChangeText={setUsername}
          />
        </View>

        {/* Campo de senha */}
        <View style={styles.inputContainer}>
          <Icon name="lock" size={20} color="#999" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {/* Botão de login */}
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        {/* Botão de registro */}
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.registerButtonText}>
            Não tem uma conta? <Text style={styles.registerHighlight}>Registre-se</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "90%",
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Fundo semi-transparente para melhorar a legibilidade
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: "#333",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#6a11cb",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#6a11cb",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  registerButton: {
    marginTop: 20,
  },
  registerButtonText: {
    color: "#666",
    fontSize: 16,
  },
  registerHighlight: {
    color: "#6a11cb",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});