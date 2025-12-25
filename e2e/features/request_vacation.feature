# language: pt
Funcionalidade: Solicitar Férias
  Como um colaborador
  Eu quero solicitar minhas férias
  Para planejar meu período de descanso

  Cenário: Colaborador solicita férias com sucesso
    Dado que estou logado como colaborador
    E estou na tela de solicitação de férias
    Quando eu seleciono data de início "10/03/2025"
    E seleciono data de término "15/03/2025"
    E toco no botão "Enviar solicitação"
    Então eu devo ver a mensagem de sucesso
    E a solicitação deve aparecer no meu histórico com status "Pendente"

  Cenário: Validação de datas inválidas
    Dado que estou logado como colaborador
    E estou na tela de solicitação de férias
    Quando eu seleciono data de início "15/03/2025"
    E seleciono data de término "10/03/2025"
    E toco no botão "Enviar solicitação"
    Então eu devo ver uma mensagem de erro sobre datas inválidas





