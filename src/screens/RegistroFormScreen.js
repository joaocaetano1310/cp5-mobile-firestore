import React, { useState } from 'react';
import { Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';

import { useAuth } from '../contexts/AuthContext';
import { criarRegistro, atualizarRegistro } from '../services/registrosService';
import { validarRegistro, mascaraData, mensagemErroFirestore } from '../utils/validacao';
import { Campo, Botao, Aviso, estilos } from '../components/ui';

// Mesma tela para cadastrar (Create) e editar (Update):
// se vier "registro" nos parâmetros da rota, ela entra em modo edição.
export default function RegistroFormScreen({ navigation, route }) {
  const { usuario } = useAuth();
  const registro = route.params?.registro;
  const editando = !!registro;

  const [disciplina, setDisciplina] = useState(registro?.disciplina ?? '');
  const [assunto, setAssunto] = useState(registro?.assunto ?? '');
  const [duracao, setDuracao] = useState(registro?.duracao != null ? String(registro.duracao) : '');
  const [data, setData] = useState(registro?.data ?? '');
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  async function aoSalvar() {
    setErro('');

    const problema = validarRegistro({ disciplina, assunto, duracao, data });
    if (problema) {
      setErro(problema);
      return;
    }

    const dados = {
      disciplina: disciplina.trim(),
      assunto: assunto.trim(),
      duracao: Number(String(duracao).replace(',', '.')),
      data: data.trim(),
    };

    setSalvando(true);
    try {
      if (editando) {
        await atualizarRegistro(usuario.uid, registro.id, dados);
      } else {
        await criarRegistro(usuario.uid, dados);
      }
      // Volta para a lista com uma mensagem de sucesso
      navigation.navigate('Registros', {
        feedback: editando ? 'Registro atualizado com sucesso!' : 'Registro cadastrado com sucesso!',
      });
    } catch (e) {
      console.log('Erro ao salvar registro:', e);
      setErro(mensagemErroFirestore(e.code));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={[estilos.tela, { justifyContent: 'flex-start', paddingTop: 24 }]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={estilos.titulo}>{editando ? 'Editar registro' : 'Novo registro'}</Text>
        <Text style={estilos.subtitulo}>
          {editando ? 'Altere os dados e salve' : 'Registre uma sessão de estudo'}
        </Text>

        <Aviso tipo="erro" texto={erro} />

        <Campo
          rotulo="Disciplina"
          placeholder="Ex.: Mobile Application Development"
          value={disciplina}
          onChangeText={setDisciplina}
          autoCapitalize="sentences"
        />
        <Campo
          rotulo="Assunto estudado"
          placeholder="Ex.: Firestore e CRUD"
          value={assunto}
          onChangeText={setAssunto}
          autoCapitalize="sentences"
        />
        <Campo
          rotulo="Duração (minutos)"
          placeholder="Ex.: 90"
          value={duracao}
          onChangeText={setDuracao}
          keyboardType="numeric"
        />
        <Campo
          rotulo="Data"
          placeholder="DD/MM/AAAA"
          value={data}
          onChangeText={(t) => setData(mascaraData(t))}
          keyboardType="numeric"
          maxLength={10}
        />

        <Botao titulo={editando ? 'Salvar alterações' : 'Cadastrar'} onPress={aoSalvar} carregando={salvando} />
        <Botao
          titulo="Cancelar"
          variante="secundaria"
          onPress={() => navigation.goBack()}
          disabled={salvando}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
