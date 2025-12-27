# Domain Layer


As interfaces pertencem à camada que define a abstração.

A abordagem domain-oriented da clean architecture usada nesse projeto irá definir a camada de interface de repositórios (ports) na camada de domínio. Uma outra abordagem seria a de colocar as interface de repositório na camada de application, mais perto de onde seria utilizada.

Os `ports` são contratos que as camadas definem para o mundo externo do que eles necessitam. A camada de infra então implementa esses contratos.

