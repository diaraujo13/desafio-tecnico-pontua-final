# language: pt
Funcionalidade: Dashboard do Gestor
  Como um gestor
  Eu quero ver e aprovar solicitações de férias pendentes
  Para gerenciar as férias da minha equipe

  Cenário: Gestor visualiza solicitações pendentes
    Dado que estou logado como gestor
    Quando eu acesso o dashboard
    Então eu devo ver a lista de solicitações pendentes

  Cenário: Gestor aprova uma solicitação de férias
    Dado que estou logado como gestor
    E existe uma solicitação de férias pendente
    Quando eu toco na solicitação pendente
    E toco no botão "Aprovar"
    Então a solicitação deve ter status "Aprovada"

  Cenário: Gestor rejeita uma solicitação de férias
    Dado que estou logado como gestor
    E existe uma solicitação de férias pendente
    Quando eu toco na solicitação pendente
    E toco no botão "Rejeitar"
    E preencho o motivo "Período não adequado"
    E toco no botão "Confirmar"
    Então a solicitação deve ter status "Reprovada"





