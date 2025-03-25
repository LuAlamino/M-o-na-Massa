import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function ScrollViewScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.tittle}>Scrollview</Text>
      <Text style={styles.item}>
        Scrollview teste teste teste teste teste teste teste teste teste teste
        teste teste
      </Text>
      <Text style={styles.item}>
        Scrollview teste teste teste teste teste teste teste teste teste teste
        teste teste
      </Text>
      <Text style={styles.item}>
        Scrollview teste teste teste teste teste teste teste teste teste teste
        teste teste
      </Text>

      {/* Botão para voltar */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  tittle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  item: {
    fontSize: 18,
    color: "red",
    margin: 10,
  },
  button: {
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});