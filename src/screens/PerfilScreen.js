import React, { useState } from 'react';
import { View, Text, ScrollView, Modal, StyleSheet } from 'react-native';

import { useAuth } from '../contexts/AuthContext';
import { Campo, Botao, Aviso, cores, estilos } from '../components/ui';

export default function PerfilScreen() {
  const { usuario, sair, excluirConta } = useAuth();

  const [modalVisivel, setModalVisivel] = useState(false);
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [saindo, setSaindo] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  async function aoSair() {
    setSaindo(true);
    await sair();
    setSaindo(false);
  }

  function abrirConfirmacao() {
    setSenha('');
    setErro('');
    setModalVisivel(true);
  }

  async function aoExcluir() {
    setErro('');
    if (!senha) {
      setErro('Informe sua senha para confirmar.');
      return;
    }

    setExcluindo(true);
    const resultado = await excluirConta(senha);
    setExcluindo(false);

    if (resultado.ok) {
      setModalVisivel(false);
    } else {
      setErro(resultado.erro);
    }
  }

  return (
    <ScrollView contentContainerStyle={[estilos.tela, { justifyContent: 'flex-start', paddingTop: 32 }]}>
      <Text style={estilos.titulo}>Minha conta</Text>
      <Text style={estilos.subtitulo}>Informações básicas do seu perfil</Text>

      <View style={local.cartao}>
        <Linha rotulo="Nome" valor={usuario?.nome || '—'} />
        <Linha rotulo="E-mail" valor={usuario?.email || '—'} />
        <Linha rotulo="ID do usuário" valor={usuario?.uid || '—'} />
        {!!usuario?.criadoEm && <Linha rotulo="Conta criada em" valor={usuario.criadoEm} />}
      </View>

      <Botao titulo="Sair da conta" variante="secundaria" onPress={aoSair} carregando={saindo} />

      <View style={{ height: 12 }} />

      <Botao titulo="Excluir minha conta" variante="perigo" onPress={abrirConfirmacao} />

      <Modal visible={modalVisivel} transparent animationType="fade">
        <View style={local.fundoModal}>
          <View style={local.caixaModal}>
            <Text style={local.tituloModal}>Excluir conta</Text>
            <Text style={local.textoModal}>
              Tem certeza que deseja excluir sua conta? Essa ação não poderá ser desfeita.
            </Text>
            <Text style={local.textoModal}>
              Por segurança, confirme sua senha para continuar.
            </Text>

            <View style={{ height: 12 }} />

            <Aviso tipo="erro" texto={erro} />

            <Campo rotulo="Senha" placeholder="Sua senha" value={senha} onChangeText={setSenha} senha />

            <Botao
              titulo="Sim, excluir conta"
              variante="perigo"
              onPress={aoExcluir}
              carregando={excluindo}
            />
            <View style={{ height: 8 }} />
            <Botao
              titulo="Cancelar"
              variante="secundaria"
              onPress={() => setModalVisivel(false)}
              disabled={excluindo}
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

function Linha({ rotulo, valor }) {
  return (
    <View style={local.linha}>
      <Text style={local.linhaRotulo}>{rotulo}</Text>
      <Text style={local.linhaValor} numberOfLines={1}>
        {valor}
      </Text>
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
    marginBottom: 28,
  },
  linha: { marginBottom: 14 },
  linhaRotulo: { color: cores.textoFraco, fontSize: 12, fontWeight: '600', marginBottom: 2 },
  linhaValor: { color: cores.texto, fontSize: 16 },
  fundoModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: 24,
  },
  caixaModal: {
    backgroundColor: cores.fundo,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 14,
    padding: 20,
  },
  tituloModal: { color: cores.texto, fontSize: 20, fontWeight: '700', marginBottom: 10 },
  textoModal: { color: cores.textoFraco, fontSize: 14, lineHeight: 20, marginBottom: 6 },
});
