# language: pt
Funcionalidade: Autenticação
  Como um usuário do sistema
  Eu quero fazer login
  Para acessar minhas funcionalidades

  Cenário: Login bem-sucedido com credenciais válidas
    Dado que o app está aberto
    Quando eu faço login com email "joao@empresa.com" e senha "Senha@123"
    Então eu devo ver a tela inicial

  Cenário: Login falha com credenciais inválidas
    Dado que o app está aberto
    Quando eu faço login com email "invalid@empresa.com" e senha "wrongpassword"
    Então eu devo ver uma mensagem de erro

  Cenário: Login usando conta de demonstração
    Dado que o app está aberto
    Quando eu toco na conta de demonstração "COLLABORATOR"
    E toco no botão "Entrar"
    Então eu devo ver a tela inicial





