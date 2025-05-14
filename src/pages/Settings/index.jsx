import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { salvarCadastro } from "../../storage";

export default function Settings({ navigation, route }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [experience, setExperience] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedJob, setSelectedJob] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [user, setUser] = useState(null);

  // Verifica se o usuário está autenticado ao abrir a tela
  useEffect(() => {
    const checkAuth = async () => {
      const userData = await AsyncStorage.getItem("user");
      if (!userData) {
        navigation.navigate("Login"); // Redireciona para o Login se não estiver autenticado
      } else {
        setUser(JSON.parse(userData));
      }
    };

    checkAuth();
  }, []);

  // Função para escolher uma foto da galeria
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão necessária", "Precisamos de permissão para acessar sua galeria.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePhoto(result.assets[0].uri);
    }
  };

  // Função para enviar o cadastro
  const handleSubmit = async () => {
    const idadeNumero = parseInt(age, 10);
    const experienciaNumero = parseInt(experience, 10);
  
    if (!name || !email || !age || !selectedJob || !experience || !selectedCity || !phone) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }
  
    if (isNaN(idadeNumero) || idadeNumero < 18) {
      Alert.alert("Idade inválida", "Você deve ter pelo menos 18 anos para se cadastrar.");
      return;
    }
  
    const experienciaMaximaPermitida = idadeNumero - 15;
  
    if (
      isNaN(experienciaNumero) ||
      experienciaNumero < 1 ||
      experienciaNumero > experienciaMaximaPermitida
    ) {
      Alert.alert(
        "Experiência inválida",
        `Com ${idadeNumero} anos de idade, você pode informar no máximo ${experienciaMaximaPermitida} anos de experiência.`
      );
      return;
    }
  
    const novoCadastro = {
      id: Math.random().toString(),
      name,
      email,
      age: idadeNumero,
      experience: experienciaNumero,
      phone,
      job: selectedJob,
      city: selectedCity,
      profilePhoto,
      userId: user.id,
    };
  
    try {
      await salvarCadastro(novoCadastro);
      Alert.alert("Cadastro Realizado", "Seu cadastro foi salvo com sucesso!", [
        {
          text: "OK",
          onPress: () => {
            setName("");
            setEmail("");
            setAge("");
            setExperience("");
            setPhone("");
            setSelectedJob("");
            setSelectedCity("");
            setProfilePhoto(null);
  
            if (route.params?.onCadastroRealizado) {
              route.params.onCadastroRealizado();
            }
          },
        },
      ]);
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro ao salvar o cadastro.");
    }
  };

  // Função para selecionar a profissão
  const selectJob = (job) => {
    setSelectedJob(job);
  };

  // Função para selecionar a cidade
  const selectCity = (city) => {
    setSelectedCity(city);
  };

  // Se o usuário não estiver autenticado, não renderiza a tela
  if (!user) {
    return null; // Ou um loading spinner
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>📝 Cadastro</Text>

        {/* Exibe o nome do usuário logado */}
        <Text style={styles.welcomeText}>Olá, {user.username}! 👋</Text>

        {/* Campo para a foto de perfil */}
        <TouchableOpacity style={styles.profilePhotoContainer} onPress={pickImage}>
          {profilePhoto ? (
            <Image source={{ uri: profilePhoto }} style={styles.profilePhoto} />
          ) : (
            <Text style={styles.profilePhotoPlaceholder}>📷 Adicionar Foto</Text>
          )}
        </TouchableOpacity>

        {/* Campos de texto */}
        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Idade"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
          maxLength={2}
        />
        <TextInput
          style={styles.input}
          placeholder="Tempo de experiência (anos)"
          value={experience}
          onChangeText={setExperience}
          keyboardType="numeric"
          maxLength={2}
        />
        <TextInput
          style={styles.input}
          placeholder="Número de telefone"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          maxLength={11}
        />

        {/* Seleção de profissão */}
        <Text style={styles.subtitle}>Selecione sua profissão:</Text>
        <View style={styles.jobContainer}>
          {["Diarista", "Encanador", "Mecânico", "Pedreiro", "Jardineiro"].map((job) => (
            <TouchableOpacity
              key={job}
              style={[
                styles.jobButton,
                selectedJob === job && styles.selectedJobButton,
              ]}
              onPress={() => selectJob(job)}
            >
              <Text
                style={[
                  styles.jobButtonText,
                  selectedJob === job && styles.selectedJobButtonText,
                ]}
              >
                {job}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Seleção de cidade */}
        <Text style={styles.subtitle}>Selecione sua cidade:</Text>
        <View style={styles.jobContainer}>
          {["Sorocaba", "Itu", "Votorantim", "Araçoiaba da Serra", "Mairinque", "Alumínio"].map((city) => (
            <TouchableOpacity
              key={city}
              style={[
                styles.jobButton,
                selectedCity === city && styles.selectedJobButton,
              ]}
              onPress={() => selectCity(city)}
            >
              <Text
                style={[
                  styles.jobButtonText,
                  selectedCity === city && styles.selectedJobButtonText,
                ]}
              >
                {city}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Botão de enviar */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Enviar 🚀</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Estilos atualizados
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  welcomeText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    color: "#555",
  },
  profilePhotoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  profilePhotoPlaceholder: {
    color: "#666",
    fontSize: 16,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#444",
  },
  jobContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  jobButton: {
    backgroundColor: "#e0e0e0",
    padding: 15,
    borderRadius: 10,
    width: "48%",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  selectedJobButton: {
    backgroundColor: "#FF6347",
  },
  jobButtonText: {
    fontSize: 16,
    color: "#333",
  },
  selectedJobButtonText: {
    color: "#fff",
  },
  submitButton: {
    backgroundColor: "#FF6347",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});