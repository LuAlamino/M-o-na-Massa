import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "../pages/Home";
import Settings from "../pages/Settings";
import Diarista from "../pages/Diarista";
import Encanador from "../pages/Encanador";
import ScrollViewScreen from "../pages/ScrollViewScreen";
import DetalhesDiarista from "../pages/Diarista/DetalhesDiarista";
import DetalheEncanador from "../pages/Encanador/DetalheEncanador";
import DetalhesJardineiro from "../pages/Jardineiro/DetalhesJardineiro";
import DetalhesMecanico from "../pages/Mecanico/DetalhesMecanico";
import { Ionicons } from "@expo/vector-icons";
import Pedreiro from "../pages/Pedreiro";
import DetalhesPedreiro from "../pages/Pedreiro/DetalhePedreiro";
import Jardineiro from "../pages/Jardineiro";
import Mecanico from "../pages/Mecanico";
import RegisterScreen from "../pages/RegisterScreen";
import LoginScreen from "../pages/LoginScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Configuração do Tab Navigator
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "Cadastrar") {
            iconName = "person-add";
          } else if (route.name === "Diarista") {
            iconName = "man-outline";
          } else if (route.name === "Encanador") {
            iconName = "hammer-outline";
          } else if (route.name === "Pedreiro") {
            iconName = "construct";
          } else if (route.name === "Jardineiro") {
            iconName = "leaf-outline";
          } else if (route.name === "Mecanico") {
            iconName = "car-outline"; // Ícone para mecânico
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerShown: false,
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "#bbb",
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Cadastrar" component={Settings} />
      <Tab.Screen name="Diarista" component={Diarista} />
      <Tab.Screen name="Encanador" component={Encanador} />
      <Tab.Screen name="Pedreiro" component={Pedreiro} />
      <Tab.Screen name="Jardineiro" component={Jardineiro} />
      <Tab.Screen name="Mecanico" component={Mecanico} />
    </Tab.Navigator>
  );
}

// Configuração do Stack Navigator global
export default function Routes() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Verificação se o usuário está logado
  useEffect(() => {
    const checkLoginStatus = async () => {
      const user = await AsyncStorage.getItem("user");
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        
          
        <Stack.Screen name="Home" component={TabNavigator} />
        
          
        
        
        <Stack.Screen name="ScrollViewScreen" component={ScrollViewScreen} />
        <Stack.Screen name="DetalhesDiarista" component={DetalhesDiarista} />
        <Stack.Screen name="DetalheEncanador" component={DetalheEncanador} />
        <Stack.Screen name="DetalhesJardineiro" component={DetalhesJardineiro} />
        <Stack.Screen name="DetalhesMecanico" component={DetalhesMecanico} />
        <Stack.Screen name="DetalhesPedreiro" component={DetalhesPedreiro} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
