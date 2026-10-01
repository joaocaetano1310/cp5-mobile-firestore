const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function emailValido(email) {
  return REGEX_EMAIL.test(String(email).trim());
}

export function validarCadastro({ nome, email, senha, confirmarSenha }) {
  if (!nome?.trim() || !email?.trim() || !senha || !confirmarSenha) {
    return 'Preencha todos os campos.';
  }
  if (nome.trim().length < 3) {
    return 'O nome deve ter pelo menos 3 caracteres.';
  }
  if (!emailValido(email)) {
    return 'Informe um e-mail válido.';
  }
  if (senha.length < 6) {
    return 'A senha deve ter pelo menos 6 caracteres.';
  }
  if (senha !== confirmarSenha) {
    return 'As senhas não conferem.';
  }
  return null;
}

export function validarLogin({ email, senha }) {
  if (!email?.trim() || !senha) {
    return 'Preencha e-mail e senha.';
  }
  if (!emailValido(email)) {
    return 'Informe um e-mail válido.';
  }
  return null;
}

export function validarEmailRecuperacao(email) {
  if (!email?.trim()) return 'Informe seu e-mail.';
  if (!emailValido(email)) return 'Informe um e-mail válido.';
  return null;
}

// ---------- CP5: registros de estudo ----------

// Aplica a máscara DD/MM/AAAA enquanto o usuário digita.
export function mascaraData(texto) {
  const n = String(texto).replace(/\D/g, '').slice(0, 8);
  if (n.length <= 2) return n;
  if (n.length <= 4) return `${n.slice(0, 2)}/${n.slice(2)}`;
  return `${n.slice(0, 2)}/${n.slice(2, 4)}/${n.slice(4)}`;
}

export function dataValida(texto) {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(texto);
  if (!m) return false;
  const dia = Number(m[1]);
  const mes = Number(m[2]);
  const ano = Number(m[3]);
  const d = new Date(ano, mes - 1, dia);
  return d.getFullYear() === ano && d.getMonth() === mes - 1 && d.getDate() === dia;
}

export function validarRegistro({ disciplina, assunto, duracao, data }) {
  if (!disciplina?.trim() || !assunto?.trim() || !String(duracao).trim() || !data?.trim()) {
    return 'Preencha todos os campos.';
  }
  if (disciplina.trim().length < 2) {
    return 'Informe o nome da disciplina.';
  }
  if (assunto.trim().length < 3) {
    return 'O assunto deve ter pelo menos 3 caracteres.';
  }
  const minutos = Number(String(duracao).replace(',', '.'));
  if (!Number.isFinite(minutos) || minutos <= 0) {
    return 'A duração deve ser um número de minutos maior que zero.';
  }
  if (!dataValida(data)) {
    return 'Informe uma data válida no formato DD/MM/AAAA.';
  }
  return null;
}

// Mensagens para erros do Firestore
export function mensagemErroFirestore(codigo) {
  const mapa = {
    'permission-denied': 'Sem permissão para acessar estes dados. Verifique as regras do Firestore.',
    unavailable: 'Serviço indisponível. Verifique sua conexão com a internet.',
    'not-found': 'Registro não encontrado. Ele pode ter sido excluído.',
    'failed-precondition': 'O Firestore não está pronto. Confirme se o banco foi criado no console.',
  };
  return mapa[codigo] || 'Ocorreu um erro ao acessar o banco de dados. Tente novamente.';
}

// Traduz os códigos de erro do Firebase Auth para mensagens de usuário
export function mensagemErroFirebase(codigo) {
  const mapa = {
    'auth/invalid-email': 'E-mail inválido.',
    'auth/user-disabled': 'Esta conta foi desativada.',
    'auth/user-not-found': 'Credenciais inválidas.',
    'auth/wrong-password': 'Credenciais inválidas.',
    'auth/invalid-credential': 'Credenciais inválidas.',
    'auth/email-already-in-use': 'Este e-mail já está cadastrado.',
    'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres.',
    'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde.',
    'auth/network-request-failed': 'Falha de conexão. Verifique sua internet.',
    'auth/requires-recent-login': 'Por segurança, confirme sua senha novamente.',
    'auth/missing-password': 'Informe a senha.',
  };
  return mapa[codigo] || 'Ocorreu um erro. Tente novamente.';
}
