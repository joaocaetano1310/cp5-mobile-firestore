import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuth } from '../contexts/AuthContext';
import { cores } from '../components/ui';

import LoginScreen from '../screens/LoginScreen';
import CadastroScreen from '../screens/CadastroScreen';
import EsqueciSenhaScreen from '../screens/EsqueciSenhaScreen';
import HomeScreen from '../screens/HomeScreen';
import PerfilScreen from '../screens/PerfilScreen';
import RegistrosScreen from '../screens/RegistrosScreen';
import RegistroFormScreen from '../screens/RegistroFormScreen';

const Stack = createNativeStackNavigator();

const tema = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: cores.fundo,
    card: cores.fundo,
    text: cores.texto,
    border: cores.borda,
    primary: cores.primaria,
  },
};

// Área não autenticada
function StackAuth() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Cadastro" component={CadastroScreen} />
      <Stack.Screen name="EsqueciSenha" component={EsqueciSenhaScreen} />
    </Stack.Navigator>
  );
}

// Área AUTENTICADA
function StackApp() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Início' }} />
      <Stack.Screen name="Registros" component={RegistrosScreen} options={{ title: 'Meus registros' }} />
      <Stack.Screen
        name="CadastroRegistro"
        component={RegistroFormScreen}
        options={{ title: 'Novo registro' }}
      />
      <Stack.Screen
        name="EditarRegistro"
        component={RegistroFormScreen}
        options={{ title: 'Editar registro' }}
      />
      <Stack.Screen name="Perfil" component={PerfilScreen} options={{ title: 'Minha conta' }} />
    </Stack.Navigator>
  );
}

export default function RootNavigator() {
  const { autenticado, carregandoSessao } = useAuth();

  // Enquanto a sessão salva é lida, mostra um loading
  if (carregandoSessao) {
    return (
      <View style={local.carregando}>
        <ActivityIndicator size="large" color={cores.primaria} />
      </View>
    );
  }

  // Sem sessão, as telas autenticadas nem são montadas.
  return (
    <NavigationContainer theme={tema}>
      {autenticado ? <StackApp /> : <StackAuth />}
    </NavigationContainer>
  );
}

const local = StyleSheet.create({
  carregando: {
    flex: 1,
    backgroundColor: cores.fundo,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
