# CP5 — App com Autenticação e Cloud Firestore

Aplicativo mobile de **Controle de Estudos** com Firebase Authentication e CRUD no Cloud Firestore.
Tecnologia em Desenvolvimento de Sistemas — 2TDS · Mobile Application Development · Prof. Fernando Pinéo

Evolução do CheckPoint 4: toda a autenticação foi mantida e foi adicionado o Cloud Firestore.

## Integrantes

| Nome                               | RM       |
| ---------------------------------- | -------- |
| João Victor Caetano Alves da Silva | 562074   |
| João Victor Bueno C da Silva       | 564115   |
| Felipe Furlanetto                  | RM562766 |

## Tema

**Controle de Estudos**: o usuário registra suas sessões de estudo (disciplina, assunto, duração e data).

## Descrição

Depois de entrar na conta, o usuário cadastra, consulta, edita e exclui os próprios registros de estudo.
Cada registro é salvo no Cloud Firestore dentro da subcoleção do usuário autenticado, então ninguém
enxerga os dados de outra conta.

### Funcionalidades

- **Autenticação (CP4):** cadastro, login, persistência da sessão, logout, recuperação de senha e exclusão da conta
- **Create:** formulário com 4 campos (disciplina, assunto, duração em minutos e data) e validação de campos vazios
- **Read:** listagem carregada do Firestore, com mensagem "Nenhum registro encontrado." quando está vazia
- **Update:** edição de um registro existente; a lista é atualizada após salvar
- **Delete:** exclusão com confirmação ("Tem certeza que deseja excluir este registro?") e feedback de sucesso
- **Isolamento:** cada usuário só lê e altera os registros do próprio `uid` (também garantido pelas regras do Firestore)
- **Perfil:** nome, e-mail, logout e exclusão de conta (que também apaga os registros do usuário)

## Tecnologias utilizadas

- React Native + Expo (SDK 57)
- React Navigation (native stack)
- Firebase Authentication
- Cloud Firestore
- AsyncStorage (persistência da sessão)

## Estrutura do Firestore

```
usuarios
└── {uid_do_usuario}              # nome, email, criadoEm (nunca a senha)
    └── registros
        ├── {registro_01}         # disciplina, assunto, duracao, data, criadoEm, atualizadoEm
        ├── {registro_02}
        └── {registro_03}
```

As regras de segurança estão em [`firestore.rules`](./firestore.rules): só o dono (`request.auth.uid == userId`)
lê ou escreve em `usuarios/{uid}` e em `usuarios/{uid}/registros/{id}`.

## Estrutura do projeto

```
src
├── components/ui.js               # campos, botões, avisos e modal de confirmação
├── contexts/AuthContext.js        # autenticação e sessão
├── navigation/RootNavigator.js    # stack pública e stack autenticada
├── screens/                       # Login, Cadastro, EsqueciSenha, Home, Registros,
│                                  # RegistroForm (cadastro/edição), Perfil
├── services/firebaseConfig.js     # inicialização do Firebase (Auth + Firestore)
├── services/registrosService.js   # operações CRUD no Firestore
└── utils/validacao.js             # validações e mensagens de erro
```

## Como instalar

```
npm install
npx expo install --fix
```

### Configurar o Firebase

1. No [console do Firebase](https://console.firebase.google.com), abra o projeto e ative **Authentication → E-mail/senha**.
2. Vá em **Firestore Database → Criar banco de dados** (modo produção).
3. Na aba **Regras**, cole o conteúdo de `firestore.rules` e clique em **Publicar**.
4. Se for usar outro projeto, troque as credenciais em `src/services/firebaseConfig.js`.

## Como executar

```
npx expo start
```

Leia o QR Code com o Expo Go, ou pressione `a` para Android, `i` para iOS e `w` para o navegador.

## Demonstração

Vídeo: _(colar o link aqui)_
