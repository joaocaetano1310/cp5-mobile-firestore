import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';

import { auth, db } from './firebaseConfig';

// Estrutura no Firestore (subcoleção por usuário):
//
//   usuarios
//   └── {uid}
//       └── registros
//           └── {registroId}  -> { disciplina, assunto, duracao, data, criadoEm, atualizadoEm }
//
// Como o caminho começa pelo uid, cada usuário só enxerga os próprios registros.

function colecaoRegistros(uid) {
  return collection(db, 'usuarios', uid, 'registros');
}

// Ao reabrir o app, o Firebase Auth restaura o usuário do AsyncStorage de forma
// assíncrona. Esperamos isso terminar antes de falar com o Firestore, senão a
// primeira consulta iria sem login e as regras de segurança negariam o acesso.
export async function aguardarAuth() {
  await auth.authStateReady();
}

// CREATE
export async function criarRegistro(uid, dados) {
  await aguardarAuth();
  const ref = await addDoc(colecaoRegistros(uid), {
    ...dados,
    criadoEm: serverTimestamp(),
    atualizadoEm: serverTimestamp(),
  });
  return ref.id;
}

// READ (em tempo real): sempre que algo muda no Firestore a lista é atualizada.
// Retorna a função para parar de escutar (usar no cleanup do useEffect).
export function escutarRegistros(uid, aoReceber, aoErrar) {
  const consulta = query(colecaoRegistros(uid), orderBy('criadoEm', 'desc'));
  let cancelado = false;
  let parar = () => {};

  aguardarAuth()
    .then(() => {
      if (cancelado) return;
      parar = onSnapshot(
        consulta,
        (snapshot) => {
          const lista = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
          aoReceber(lista);
        },
        (erro) => aoErrar?.(erro)
      );
    })
    .catch((erro) => aoErrar?.(erro));

  return () => {
    cancelado = true;
    parar();
  };
}

// UPDATE
export async function atualizarRegistro(uid, id, dados) {
  await aguardarAuth();
  await updateDoc(doc(db, 'usuarios', uid, 'registros', id), {
    ...dados,
    atualizadoEm: serverTimestamp(),
  });
}

// DELETE
export async function excluirRegistro(uid, id) {
  await aguardarAuth();
  await deleteDoc(doc(db, 'usuarios', uid, 'registros', id));
}

// Usado ao excluir a conta: apaga todos os registros do usuário antes
// de remover o login (depois do deleteUser não haveria mais permissão).
export async function excluirTodosRegistros(uid) {
  await aguardarAuth();
  const snapshot = await getDocs(colecaoRegistros(uid));
  await Promise.all(snapshot.docs.map((d) => deleteDoc(d.ref)));
}
