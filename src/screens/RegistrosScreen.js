import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';

import { useAuth } from '../contexts/AuthContext';
import { escutarRegistros, excluirRegistro } from '../services/registrosService';
import { mensagemErroFirestore } from '../utils/validacao';
import { Botao, Aviso, ConfirmarModal, cores, estilos } from '../components/ui';

export default function RegistrosScreen({ navigation, route }) {
  const { usuario } = useAuth();

  const [registros, setRegistros] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const [paraExcluir, setParaExcluir] = useState(null);
  const [excluindo, setExcluindo] = useState(false);

  // READ: carrega do Firestore e continua escutando mudanças
  useEffect(() => {
    const parar = escutarRegistros(
      usuario.uid,
      (lista) => {
        setRegistros(lista);
        setErro('');
        setCarregando(false);
      },
      (e) => {
        console.log('Erro ao carregar registros:', e);
        setErro(mensagemErroFirestore(e.code));
        setCarregando(false);
      }
    );
    return parar;
  }, [usuario.uid]);

  // Mensagem de sucesso vinda do formulário (cadastro/edição)
  useEffect(() => {
    const mensagem = route.params?.feedback;
    if (!mensagem) return;
    setSucesso(mensagem);
    navigation.setParams({ feedback: undefined });
    const t = setTimeout(() => setSucesso(''), 3500);
    return () => clearTimeout(t);
  }, [route.params?.feedback]);

  // DELETE (depois da confirmação)
  async function confirmarExclusao() {
    if (!paraExcluir) return;
    setExcluindo(true);
    try {
      await excluirRegistro(usuario.uid, paraExcluir.id);
      setParaExcluir(null);
      setErro('');
      setSucesso('Registro excluído com sucesso!');
      setTimeout(() => setSucesso(''), 3500);
    } catch (e) {
      console.log('Erro ao excluir registro:', e);
      setParaExcluir(null);
      setErro(mensagemErroFirestore(e.code));
    } finally {
      setExcluindo(false);
    }
  }

  function renderItem({ item }) {
    return (
      <View style={local.cartao}>
        <Text style={local.disciplina}>{item.disciplina}</Text>
        <Text style={local.assunto}>{item.assunto}</Text>
        <Text style={local.detalhe}>
          {item.duracao} min  ·  {item.data}
        </Text>

        <View style={local.acoes}>
          <TouchableOpacity
            style={local.botaoAcao}
            onPress={() => navigation.navigate('EditarRegistro', { registro: item })}
          >
            <Text style={local.textoEditar}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={local.botaoAcao} onPress={() => setParaExcluir(item)}>
            <Text style={local.textoExcluir}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (carregando) {
    return (
      <View style={[estilos.tela, { alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={cores.primaria} />
        <Text style={[estilos.subtitulo, { marginTop: 12 }]}>Carregando registros...</Text>
      </View>
    );
  }

  return (
    <View style={[estilos.tela, { justifyContent: 'flex-start', paddingTop: 16 }]}>
      <Aviso tipo="erro" texto={erro} />
      <Aviso tipo="sucesso" texto={sucesso} />

      <FlatList
        data={registros}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 16, flexGrow: 1 }}
        ListEmptyComponent={
          <View style={local.vazio}>
            <Text style={local.vazioTexto}>Nenhum registro encontrado.</Text>
          </View>
        }
      />

      <Botao titulo="Novo registro" onPress={() => navigation.navigate('CadastroRegistro')} />

      <ConfirmarModal
        visivel={!!paraExcluir}
        titulo="Excluir registro"
        mensagem="Tem certeza que deseja excluir este registro?"
        textoConfirmar="Sim, excluir"
        carregando={excluindo}
        onConfirmar={confirmarExclusao}
        onCancelar={() => setParaExcluir(null)}
      />
    </View>
  );
}

const local = StyleSheet.create({
  cartao: {
    backgroundColor: cores.cartao,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  disciplina: { color: cores.primaria, fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  assunto: { color: cores.texto, fontSize: 18, fontWeight: '700', marginTop: 4 },
  detalhe: { color: cores.textoFraco, fontSize: 14, marginTop: 6 },
  acoes: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: cores.borda,
    paddingTop: 8,
  },
  botaoAcao: { paddingHorizontal: 14, paddingVertical: 6 },
  textoEditar: { color: cores.primaria, fontWeight: '700', fontSize: 14 },
  textoExcluir: { color: '#F87171', fontWeight: '700', fontSize: 14 },
  vazio: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 48 },
  vazioTexto: { color: cores.textoFraco, fontSize: 16 },
});
