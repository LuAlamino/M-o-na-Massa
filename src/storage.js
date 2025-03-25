import AsyncStorage from "@react-native-async-storage/async-storage";

// Salvar um novo cadastro
export const salvarCadastro = async (novoCadastro) => {
  try {
    // Recupera os cadastros existentes
    const cadastrosExistentes = await AsyncStorage.getItem("cadastros");
    let cadastros = cadastrosExistentes ? JSON.parse(cadastrosExistentes) : [];

    // Adiciona o novo cadastro
    cadastros.push(novoCadastro);

    // Salva a lista atualizada no AsyncStorage
    await AsyncStorage.setItem("cadastros", JSON.stringify(cadastros));
  } catch (error) {
    console.error("Erro ao salvar cadastro:", error);
  }
};

// Recuperar todos os cadastros
export const recuperarCadastros = async () => {
  try {
    const cadastros = await AsyncStorage.getItem("cadastros");
    return cadastros ? JSON.parse(cadastros) : [];
  } catch (error) {
    console.error("Erro ao recuperar cadastros:", error);
    return [];
  }
};

// Remover um cadastro pelo ID
export const removerCadastro = async (id) => {
  try {
    // Recupera a lista atual de cadastros
    const cadastrosExistentes = await AsyncStorage.getItem("cadastros");
    let cadastros = cadastrosExistentes ? JSON.parse(cadastrosExistentes) : [];

    // Filtra removendo o cadastro com o ID correspondente
    const novaLista = cadastros.filter((cadastro) => cadastro.id !== id);

    // Salva a nova lista sem o item removido
    await AsyncStorage.setItem("cadastros", JSON.stringify(novaLista));
  } catch (error) {
    console.error("Erro ao remover cadastro:", error);
  }
};