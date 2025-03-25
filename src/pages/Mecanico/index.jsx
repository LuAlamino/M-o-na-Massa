import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { recuperarCadastros, removerCadastro } from "../../storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Mecanico({ navigation }) {
  const [mecanicos, setMecanicos] = useState([]);
  const [cidades, setCidades] = useState([
    "Todas",
    "Sorocaba",
    "Itu",
    "Votorantim",
    "Araçoiaba da Serra",
    "Mairinque",
    "Alumínio",
  ]);
  const [cidadeSelecionada, setCidadeSelecionada] = useState("Todas");
  const [user, setUser] = useState(null); // Estado para armazenar o usuário logado

  // Carrega os mecânicos e verifica o usuário logado ao abrir a tela
  useEffect(() => {
    carregarMecanicos();
    carregarUsuarioLogado(); // Carrega o usuário logado
  }, []);

  // Atualiza a lista de mecânicos quando a tela recebe foco
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      carregarMecanicos(); // Recarrega os mecânicos quando a tela recebe foco
    });

    return unsubscribe;
  }, [navigation]);

  // Carrega o usuário logado
  const carregarUsuarioLogado = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData)); // Define o usuário logado
    }
  };

  // Carrega os mecânicos
  const carregarMecanicos = async () => {
    const cadastros = await recuperarCadastros();
    const mecanicosFiltrados = cadastros.filter(
      (cadastro) => cadastro.job === "Mecânico"
    );
    setMecanicos(mecanicosFiltrados);
  };

  // Função para excluir um mecânico
  const handleDelete = async (id, registroUserId) => {
    // Verifica se o usuário é admin ou o criador do registro
    if (user?.role !== "admin" && user?.id !== registroUserId) {
      Alert.alert("Erro", "Você não tem permissão para excluir este registro.");
      return;
    }

    Alert.alert(
      "Remover Mecânico",
      "Tem certeza que deseja excluir este mecânico?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          onPress: async () => {
            await removerCadastro(id); // Remove do AsyncStorage
            carregarMecanicos(); // Atualiza a lista de mecânicos
          },
          style: "destructive",
        },
      ]
    );
  };

  // Filtra os mecânicos com base na cidade selecionada
  const mecanicosFiltrados =
    cidadeSelecionada === "Todas"
      ? mecanicos
      : mecanicos.filter((mecanico) => mecanico.city === cidadeSelecionada);

  // Navega para a tela de detalhes do mecânico
  const verDetalhes = (mecanico) => {
    navigation.navigate("DetalhesMecanico", {
      mecanico,
      onDelete: handleDelete, // Passa a função de exclusão
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mecânicos 👨‍🔧🚗</Text>

      {/* Filtro de cidade */}
      <Text style={styles.subtitle}>Cidades:</Text>
      <View style={styles.filtroContainer}>
        {cidades.map((cidade) => (
          <TouchableOpacity
            key={cidade}
            style={[
              styles.filtroBotao,
              cidadeSelecionada === cidade && styles.filtroBotaoSelecionado,
            ]}
            onPress={() => setCidadeSelecionada(cidade)}
          >
            <Text
              style={[
                styles.filtroTexto,
                cidadeSelecionada === cidade && styles.filtroTextoSelecionado,
              ]}
            >
              {cidade}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Lista de mecânicos */}
      {mecanicosFiltrados.length > 0 ? (
        <FlatList
          data={mecanicosFiltrados}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => verDetalhes(item)}>
              <Image source={{ uri: item.profilePhoto }} style={styles.profilePhoto} />
              <View style={styles.cardContent}>
                <Text style={styles.cardText}>Nome: {item.name}</Text>
                <Text style={styles.cardText}>E-mail: {item.email}</Text>
                <Text style={styles.cardText}>Idade: {item.age} anos</Text>
                <Text style={styles.cardText}>Experiência: {item.experience} anos</Text>
                <Text style={styles.cardText}>Telefone: {item.phone}</Text>
                <Text style={styles.cardText}>Cidade: {item.city}</Text>
              </View>

              {/* Exibe o botão de exclusão apenas para o admin ou o criador do registro */}
              {(user?.role === "admin" || user?.id === item.userId) && (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(item.id, item.userId)}
                >
                  <Text style={styles.deleteButtonText}>Excluir</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={styles.noResults}>
          Nenhum mecânico {cidadeSelecionada !== "Todas" ? `em ${cidadeSelecionada}` : ""} cadastrado.
        </Text>
      )}
    </View>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5", // Fundo mais suave
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333", // Cor mais escura para o título
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#555", // Cor mais suave para o subtítulo
  },
  filtroContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  filtroBotao: {
    backgroundColor: "#e0e0e0", // Cor de fundo mais suave
    padding: 12,
    borderRadius: 10,
    width: "48%",
    alignItems: "center",
    marginBottom: 10,
    elevation: 2, // Sombra sutil
  },
  filtroBotaoSelecionado: {
    backgroundColor: "#007bff",
  },
  filtroTexto: {
    color: "#333",
    fontSize: 16,
    fontWeight: "500", // Peso médio para o texto
  },
  filtroTextoSelecionado: {
    color: "#fff",
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 3, // Sombra mais pronunciada
    flexDirection: "row",
    alignItems: "center",
  },
  profilePhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
  },
  cardText: {
    fontSize: 16,
    marginVertical: 3,
    color: "#444", // Cor mais suave para o texto
  },
  deleteButton: {
    backgroundColor: "#ff4d4d",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  noResults: {
    textAlign: "center",
    fontSize: 18,
    color: "#888",
    marginTop: 20,
  },
});