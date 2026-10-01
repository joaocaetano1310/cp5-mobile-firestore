import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  StyleSheet,
} from 'react-native';

export const cores = {
  fundo: '#0F172A',
  cartao: '#1E293B',
  borda: '#334155',
  texto: '#F1F5F9',
  textoFraco: '#94A3B8',
  primaria: '#2563EB',
  perigo: '#DC2626',
  sucesso: '#16A34A',
};

export function Campo({ rotulo, senha, ...props }) {
  const [visivel, setVisivel] = useState(false);
  const ehSenha = !!senha;

  return (
    <View style={estilos.campoBloco}>
      <Text style={estilos.rotulo}>{rotulo}</Text>
      <View style={estilos.campoLinha}>
        <TextInput
          style={estilos.input}
          placeholderTextColor={cores.textoFraco}
          secureTextEntry={ehSenha && !visivel}
          autoCapitalize="none"
          {...props}
        />
        {ehSenha && (
          <TouchableOpacity onPress={() => setVisivel((v) => !v)} style={estilos.olho}>
            <Text style={estilos.olhoTexto}>{visivel ? 'Ocultar' : 'Mostrar'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export function Botao({ titulo, onPress, carregando, variante = 'primaria', disabled }) {
  const fundo =
    variante === 'perigo' ? cores.perigo : variante === 'secundaria' ? 'transparent' : cores.primaria;

  return (
    <TouchableOpacity
      style={[
        estilos.botao,
        { backgroundColor: fundo },
        variante === 'secundaria' && estilos.botaoSecundario,
        (carregando || disabled) && estilos.botaoDesativado,
      ]}
      onPress={onPress}
      disabled={carregando || disabled}
      activeOpacity={0.8}
    >
      {carregando ? (
        <ActivityIndicator color="#FFF" />
      ) : (
        <Text
          style={[
            estilos.botaoTexto,
            variante === 'secundaria' && { color: cores.textoFraco },
          ]}
        >
          {titulo}
        </Text>
      )}
    </TouchableOpacity>
  );
}

export function Aviso({ tipo = 'erro', texto }) {
  if (!texto) return null;
  const ehErro = tipo === 'erro';
  return (
    <View
      style={[
        estilos.aviso,
        {
          backgroundColor: ehErro ? '#7F1D1D' : '#14532D',
          borderColor: ehErro ? cores.perigo : cores.sucesso,
        },
      ]}
    >
      <Text style={estilos.avisoTexto}>{texto}</Text>
    </View>
  );
}

// Modal de confirmação (funciona no celular e no navegador, ao contrário do Alert com botões)
export function ConfirmarModal({
  visivel,
  titulo,
  mensagem,
  textoConfirmar = 'Confirmar',
  carregando,
  onConfirmar,
  onCancelar,
}) {
  return (
    <Modal visible={visivel} transparent animationType="fade" onRequestClose={onCancelar}>
      <View style={estilos.fundoModal}>
        <View style={estilos.caixaModal}>
          <Text style={estilos.tituloModal}>{titulo}</Text>
          <Text style={estilos.textoModal}>{mensagem}</Text>
          <View style={{ height: 12 }} />
          <Botao titulo={textoConfirmar} variante="perigo" onPress={onConfirmar} carregando={carregando} />
          <View style={{ height: 8 }} />
          <Botao titulo="Cancelar" variante="secundaria" onPress={onCancelar} disabled={carregando} />
        </View>
      </View>
    </Modal>
  );
}

export const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: cores.fundo,
    padding: 24,
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 28,
    fontWeight: '700',
    color: cores.texto,
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 15,
    color: cores.textoFraco,
    marginBottom: 28,
  },
  campoBloco: { marginBottom: 16 },
  rotulo: {
    fontSize: 13,
    color: cores.textoFraco,
    marginBottom: 6,
    fontWeight: '600',
  },
  campoLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.cartao,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 10,
  },
  input: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 16,
    color: cores.texto,
  },
  olho: { paddingHorizontal: 12 },
  olhoTexto: { color: cores.primaria, fontSize: 13, fontWeight: '600' },
  botao: {
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8,
  },
  botaoSecundario: { borderWidth: 1, borderColor: cores.borda },
  botaoDesativado: { opacity: 0.6 },
  botaoTexto: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  aviso: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  avisoTexto: { color: '#FFF', fontSize: 14 },
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
  link: {
    color: cores.primaria,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 18,
  },
});
