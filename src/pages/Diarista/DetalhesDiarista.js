import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  TextInput,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function DetalhesDiarista({ route, navigation }) {
  const { diarista } = route.params;
  const [isAdmin, setIsAdmin] = useState(false);
  const [comentario, setComentario] = useState(""); // Estado para o comentário
  const [comentarios, setComentarios] = useState([]); // Estado para a lista de comentários
  const [user, setUser] = useState(null); // Estado para o usuário logado

  // Carrega os dados do usuário logado e os comentários ao abrir a tela
  useEffect(() => {
    const loadUserAndComments = async () => {
      const userData = JSON.parse(await AsyncStorage.getItem("user"));
      setUser(userData); // Define o usuário logado

      // Verifica se é admin
      setIsAdmin(userData?.username === "admin");

      // Carrega os comentários da diarista
      const comentariosSalvos = JSON.parse(await AsyncStorage.getItem(`comentarios_${diarista.id}`)) || [];
      setComentarios(comentariosSalvos);
    };

    loadUserAndComments();
  }, [diarista.id]);

  // Função para adicionar um comentário
  const adicionarComentario = async () => {
    if (!comentario.trim()) {
      Alert.alert("Erro", "Por favor, digite um comentário.");
      return;
    }

    const novoComentario = {
      id: new Date().getTime(), // ID único baseado no timestamp
      usuario: user.username, // Nome do usuário logado
      userId: user.id, // ID do usuário logado
      texto: comentario, // Texto do comentário
    };

    // Atualiza a lista de comentários
    const novaListaComentarios = [...comentarios, novoComentario];
    setComentarios(novaListaComentarios);

    // Salva no AsyncStorage
    await AsyncStorage.setItem(`comentarios_${diarista.id}`, JSON.stringify(novaListaComentarios));

    // Limpa o campo de comentário
    setComentario("");
  };

  // Função para excluir um comentário
  const excluirComentario = async (id) => {
    const novaListaComentarios = comentarios.filter((comentario) => comentario.id !== id);
    setComentarios(novaListaComentarios);

    // Salva no AsyncStorage
    await AsyncStorage.setItem(`comentarios_${diarista.id}`, JSON.stringify(novaListaComentarios));

    Alert.alert("Sucesso", "Comentário excluído com sucesso.");
  };

  // Função para denunciar um comentário
  const denunciarComentario = (id) => {
    Alert.alert(
      "Denúncia enviada",
      "Sua denúncia foi enviada com sucesso.",
      [
        {
          text: "OK",
          onPress: () => console.log("Denúncia confirmada"), // Ação após confirmar
        },
      ]
    );
  };

  // Função para excluir a diarista (apenas para o criador ou admin)
  const handleDelete = async () => {
    Alert.alert(
      "Excluir Diarista",
      "Tem certeza que deseja excluir este diarista?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          onPress: async () => {
            const cadastros = JSON.parse(await AsyncStorage.getItem("users")) || [];
            const novosCadastros = cadastros.filter((u) => u.id !== diarista.id);
            await AsyncStorage.setItem("users", JSON.stringify(novosCadastros));
            Alert.alert("Sucesso", "Diarista excluído.");
            navigation.goBack(); // Voltar para a tela anterior após a exclusão
          },
        },
      ]
    );
  };

  // Verifica se o usuário logado pode excluir o registro (criador ou admin)
  const podeExcluirRegistro = (registroUserId) => {
    return user?.id === registroUserId || isAdmin;
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: diarista.profilePhoto }} style={styles.profilePhoto} />
      <Text style={styles.title}>{diarista.name}</Text>
      <Text style={styles.info}>E-mail: {diarista.email}</Text>
      <Text style={styles.info}>Idade: {diarista.age}</Text>
      <Text style={styles.info}>Experiência: {diarista.experience} anos</Text>
      <Text style={styles.info}>Telefone: {diarista.phone}</Text>
      <Text style={styles.info}>Profissão: {diarista.job}</Text>

      {/* Campo para adicionar comentário */}
      <TextInput
        style={styles.input}
        placeholder="Deixe um comentário..."
        value={comentario}
        onChangeText={setComentario}
      />
      <TouchableOpacity style={styles.comentarButton} onPress={adicionarComentario}>
        <Text style={styles.comentarButtonText}>Comentar</Text>
      </TouchableOpacity>

      {/* Lista de comentários */}
      <Text style={styles.subtitle}>Comentários:</Text>
      {comentarios.length > 0 ? (
        <FlatList
          data={comentarios}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.comentarioContainer}>
              <Text style={styles.comentarioUsuario}>{item.usuario}:</Text>
              <Text style={styles.comentarioTexto}>{item.texto}</Text>
              <View style={styles.buttonsContainer}>
                {/* Botão de denúncia */}
                <TouchableOpacity style={styles.denunciarButton} onPress={() => denunciarComentario(item.id)}>
                  <Text style={styles.denunciarButtonText}>Denunciar</Text>
                </TouchableOpacity>
                {/* Botão de exclusão (apenas para o dono do comentário ou admin) */}
                {podeExcluirRegistro(item.userId) && (
                  <TouchableOpacity style={styles.excluirButton} onPress={() => excluirComentario(item.id)}>
                    <Text style={styles.excluirButtonText}>Excluir</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noComments}>Nenhum comentário ainda.</Text>
      )}

      {/* Botão de exclusão (apenas para o criador ou admin) */}
      {podeExcluirRegistro(diarista.userId) && (
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>Excluir Diarista</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  profilePhoto: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  info: {
    fontSize: 18,
    marginBottom: 5,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  comentarButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 20,
    marginBottom: 20,
    width: "80%",
  },
  comentarButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  comentarioContainer: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: "100%",
  },
  comentarioUsuario: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  comentarioTexto: {
    fontSize: 14,
    color: "#555",
  },
  noComments: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
  deleteButton: {
    marginTop: 20,
    backgroundColor: "#FF6347",
    padding: 15,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  denunciarButton: {
    backgroundColor: "#FF6347",
    padding: 5,
    borderRadius: 5,
    alignSelf: "flex-end",
  },
  denunciarButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  excluirButton: {
    backgroundColor: "#FF0000",
    padding: 5,
    borderRadius: 5,
    alignSelf: "flex-end",
    marginLeft: 5,
  },
  excluirButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});