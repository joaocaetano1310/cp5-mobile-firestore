import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';

import { useAuth } from '../contexts/AuthContext';
import { validarLogin } from '../utils/validacao';
import { Campo, Botao, Aviso, estilos } from '../components/ui';

export default function LoginScreen({ navigation }) {
  const { entrar } = useAuth();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function aoEntrar() {
    setErro('');

    const problema = validarLogin({ email, senha });
    if (problema) {
      setErro(problema);
      return;
    }

    setCarregando(true);
    const resultado = await entrar({ email, senha });
    setCarregando(false);

    if (!resultado.ok) setErro(resultado.erro);
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={estilos.tela} keyboardShouldPersistTaps="handled">
        <Text style={estilos.titulo}>Bem-vindo</Text>
        <Text style={estilos.subtitulo}>Entre com sua conta para continuar</Text>

        <Aviso tipo="erro" texto={erro} />

        <Campo
          rotulo="E-mail"
          placeholder="seu@email.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoComplete="email"
        />
        <Campo
          rotulo="Senha"
          placeholder="Sua senha"
          value={senha}
          onChangeText={setSenha}
          senha
        />

        <Botao titulo="Entrar" onPress={aoEntrar} carregando={carregando} />

        <TouchableOpacity onPress={() => navigation.navigate('EsqueciSenha')}>
          <Text style={estilos.link}>Esqueci minha senha</Text>
        </TouchableOpacity>

        <View style={{ height: 8 }} />

        <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
          <Text style={estilos.link}>Não tem conta? Cadastre-se</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
