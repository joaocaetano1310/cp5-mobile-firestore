import React, { useState } from 'react';
import { Text, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';

import { useAuth } from '../contexts/AuthContext';
import { validarEmailRecuperacao } from '../utils/validacao';
import { Campo, Botao, Aviso, estilos } from '../components/ui';

export default function EsqueciSenhaScreen({ navigation }) {
  const { recuperarSenha } = useAuth();

  const [email, setEmail] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function aoRecuperar() {
    setErro('');
    setSucesso('');

    const problema = validarEmailRecuperacao(email);
    if (problema) {
      setErro(problema);
      return;
    }

    setCarregando(true);
    const resultado = await recuperarSenha(email);
    setCarregando(false);

    if (resultado.ok) {
      setSucesso(
        'Se o e-mail estiver cadastrado, você receberá as instruções para redefinir sua senha.'
      );
      setEmail('');
    } else {
      setErro(resultado.erro);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={estilos.tela} keyboardShouldPersistTaps="handled">
        <Text style={estilos.titulo}>Esqueci minha senha</Text>
        <Text style={estilos.subtitulo}>
          Informe seu e-mail e enviaremos um link para redefinir a senha.
        </Text>

        <Aviso tipo="erro" texto={erro} />
        <Aviso tipo="sucesso" texto={sucesso} />

        <Campo
          rotulo="E-mail"
          placeholder="seu@email.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <Botao titulo="Enviar link de recuperação" onPress={aoRecuperar} carregando={carregando} />

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={estilos.link}>Voltar para o login</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
