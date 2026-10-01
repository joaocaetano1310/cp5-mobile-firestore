import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

import { auth, db } from '../services/firebaseConfig';
import { excluirTodosRegistros } from '../services/registrosService';
import { mensagemErroFirebase } from '../utils/validacao';

// A senha nunca é guardada aqui, só os dados de identificação da sessão.
const CHAVE_SESSAO = '@cp4auth:sessao';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregandoSessao, setCarregandoSessao] = useState(true);

  useEffect(() => {
    async function verificarSessaoSalva() {
      try {
        const json = await AsyncStorage.getItem(CHAVE_SESSAO);
        if (json) {
          setUsuario(JSON.parse(json));
        }
      } catch (e) {
        console.log('Erro ao ler sessão local:', e);
      } finally {
        setCarregandoSessao(false);
      }
    }
    verificarSessaoSalva();
  }, []);

  // Se o Firebase Auth informar que não há usuário logado (sessão expirada,
  // conta removida em outro lugar...), derrubamos a sessão local também.
  // Sem isso o app mostraria a área autenticada sem permissão no Firestore.
  useEffect(() => {
    const cancelar = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        AsyncStorage.removeItem(CHAVE_SESSAO).catch(() => {});
        setUsuario(null);
      }
    });
    return cancelar;
  }, []);

  async function salvarSessao(firebaseUser, nome) {
    const dados = {
      uid: firebaseUser.uid,
      nome: nome ?? firebaseUser.displayName ?? '',
      email: firebaseUser.email,
      criadoEm: firebaseUser.metadata?.creationTime ?? null,
    };
    await AsyncStorage.setItem(CHAVE_SESSAO, JSON.stringify(dados));
    setUsuario(dados);
    return dados;
  }

  async function limparSessao() {
    await AsyncStorage.removeItem(CHAVE_SESSAO);
    setUsuario(null);
  }

  async function cadastrar({ nome, email, senha }) {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), senha);
      await updateProfile(cred.user, { displayName: nome.trim() });

      // Documento do usuário no Firestore (nunca guarda a senha).
      // Se falhar, o cadastro continua valendo: o app só usa a subcoleção registros.
      try {
        await setDoc(doc(db, 'usuarios', cred.user.uid), {
          nome: nome.trim(),
          email: cred.user.email,
          criadoEm: serverTimestamp(),
        });
      } catch (e) {
        console.log('Não foi possível criar o documento do usuário:', e);
      }

      await salvarSessao(cred.user, nome.trim());
      return { ok: true };
    } catch (e) {
      return { ok: false, erro: mensagemErroFirebase(e.code) };
    }
  }

  async function entrar({ email, senha }) {
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), senha);
      await salvarSessao(cred.user);
      return { ok: true };
    } catch (e) {
      return { ok: false, erro: mensagemErroFirebase(e.code) };
    }
  }

  async function sair() {
    try {
      await signOut(auth);
    } catch (e) {
      console.log('Erro no signOut:', e);
    } finally {
      await limparSessao();
    }
    return { ok: true };
  }

  async function recuperarSenha(email) {
    try {
      await sendPasswordResetEmail(auth, email.trim());
      return { ok: true };
    } catch (e) {
      // Não revelamos se o e-mail existe ou não
      if (e.code === 'auth/user-not-found') return { ok: true };
      return { ok: false, erro: mensagemErroFirebase(e.code) };
    }
  }

  // O Firebase exige login recente para excluir a conta, então
  // pedimos a senha e reautenticamos antes do deleteUser.
  async function excluirConta(senha) {
    try {
      const atual = auth.currentUser;
      if (!atual) {
        await limparSessao();
        return { ok: false, erro: 'Sessão expirada. Faça login novamente.' };
      }

      const credencial = EmailAuthProvider.credential(atual.email, senha);
      await reauthenticateWithCredential(atual, credencial);

      // Apaga os dados do usuário no Firestore enquanto ele ainda está logado.
      try {
        await excluirTodosRegistros(atual.uid);
        await deleteDoc(doc(db, 'usuarios', atual.uid));
      } catch (e) {
        console.log('Erro ao apagar dados do Firestore:', e);
      }

      await deleteUser(atual);
      await limparSessao();
      return { ok: true };
    } catch (e) {
      return { ok: false, erro: mensagemErroFirebase(e.code) };
    }
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        autenticado: !!usuario,
        carregandoSessao,
        cadastrar,
        entrar,
        sair,
        recuperarSenha,
        excluirConta,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth precisa estar dentro de um AuthProvider');
  return ctx;
}
