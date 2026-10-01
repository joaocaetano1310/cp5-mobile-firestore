import React, { useState } from 'react';
import { Text, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';

import { useAuth } from '../contexts/AuthContext';
import { validarCadastro } from '../utils/validacao';
import { Campo, Botao, Aviso, estilos } from '../components/ui';

export default function CadastroScreen({ navigation }) {
  const { cadastrar } = useAuth();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function aoCadastrar() {
    setErro('');

    const problema = validarCadastro({ nome, email, senha, confirmarSenha });
    if (problema) {
      setErro(problema);
      return;
    }

    setCarregando(true);
    const resultado = await cadastrar({ nome, email, senha });
    setCarregando(false);

    if (!resultado.ok) setErro(resultado.erro);
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={estilos.tela} keyboardShouldPersistTaps="handled">
        <Text style={estilos.titulo}>Criar conta</Text>
        <Text style={estilos.subtitulo}>Preencha os dados abaixo</Text>

        <Aviso tipo="erro" texto={erro} />

        <Campo rotulo="Nome" placeholder="Seu nome completo" value={nome} onChangeText={setNome} autoCapitalize="words" />
        <Campo
          rotulo="E-mail"
          placeholder="seu@email.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <Campo rotulo="Senha" placeholder="Mínimo 6 caracteres" value={senha} onChangeText={setSenha} senha />
        <Campo
          rotulo="Confirmação de senha"
          placeholder="Repita a senha"
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          senha
        />

        <Botao titulo="Cadastrar" onPress={aoCadastrar} carregando={carregando} />

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={estilos.link}>Já tenho conta. Entrar</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
