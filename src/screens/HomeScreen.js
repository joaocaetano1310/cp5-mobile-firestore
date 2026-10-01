import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

import { useAuth } from '../contexts/AuthContext';
import { Botao, cores, estilos } from '../components/ui';

export default function HomeScreen({ navigation }) {
  const { usuario } = useAuth();

  return (
    <ScrollView contentContainerStyle={[estilos.tela, { justifyContent: 'flex-start', paddingTop: 48 }]}>
      <Text style={estilos.titulo}>Olá, {usuario?.nome || 'usuário'} 👋</Text>
      <Text style={estilos.subtitulo}>Controle de Estudos</Text>

      <View style={local.cartao}>
        <Text style={local.cartaoTitulo}>Seus registros de estudo</Text>
        <Text style={local.cartaoTexto}>
          Cadastre, consulte, edite e exclua suas sessões de estudo. Os dados ficam salvos no Cloud
          Firestore e só você consegue vê-los.
        </Text>
      </View>

      <Botao titulo="Meus registros" onPress={() => navigation.navigate('Registros')} />
      <Botao titulo="Novo registro" variante="secundaria" onPress={() => navigation.navigate('CadastroRegistro')} />
      <Botao titulo="Minha conta / Perfil" variante="secundaria" onPress={() => navigation.navigate('Perfil')} />
    </ScrollView>
  );
}

const local = StyleSheet.create({
  cartao: {
    backgroundColor: cores.cartao,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  cartaoTitulo: { color: cores.texto, fontSize: 16, fontWeight: '700', marginBottom: 6 },
  cartaoTexto: { color: cores.textoFraco, fontSize: 14, lineHeight: 20 },
});
