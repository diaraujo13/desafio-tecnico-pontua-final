# Pontua – Gestão de Férias (React Native)

## Visão Geral do Projeto

Este projeto é uma aplicação **mobile em React Native** desenvolvida como parte de um desafio técnico, com o objetivo de implementar um **sistema de solicitação, aprovação e visualização de férias**, seguindo os princípios de **Clean Architecture**, separação de responsabilidades e boas práticas de engenharia de software.

A aplicação cobre todo o fluxo funcional de férias:

- Solicitação de férias
- Aprovação / rejeição por gestores
- Visualização de histórico
- Consulta de detalhes de uma solicitação

O foco principal do projeto não é apenas a funcionalidade, mas a **qualidade arquitetural**, testabilidade e manutenibilidade do código.

---

## Stack Utilizada

### Mobile / UI

- **React Native**
- **TypeScript**
- **React Navigation**
- **React Hooks**
- **React Native Animated**

### Arquitetura e Domínio

- **Clean Architecture**
- **Use Cases isolados**
- **Result Pattern (`Result<T, DomainError>`)** do Railway Oriented Programming
- **Dependency Injection via Composition Root**

### Testes

- **Jest**
- **@testing-library/react-native**
- **@testing-library/react-hooks**
- **Testes unitários por camada**

### Infraestrutura

- **AsyncStorage**
- **API Client desacoplado**
- **Mocks e Stubs para testes**

---

## Decisões Arquiteturais

### 1. Clean Architecture por Camadas

O projeto é organizado nas seguintes camadas:

- **Domain**
  - Entidades
  - Value Objects
  - Erros de domínio
- **Application**
  - Use Cases (casos de uso)
- **Infrastructure**
  - API Clients
  - Storage
- **Presentation**
  - Hooks (adaptadores)
  - Screens
  - Componentes de UI

Cada camada depende apenas de **abstrações**, nunca de implementações concretas.

---

### 2. Hooks como Adaptadores Puros

Os hooks da camada de apresentação:

- Apenas consomem Use Cases
- Gerenciam estado de UI (`loading`, `error`, `data`)
- Não contêm lógica de negócio
- Não realizam decisões de domínio

Isso garante:

- Testes simples
- Telas desacopladas do domínio
- Facilidade de manutenção

---

### 3. Composition Root

A injeção de dependência é centralizada em um **Composition Root** (`src/main/container.ts`), responsável por:

- Instanciar Use Cases
- Resolver dependências
- Garantir singletons quando necessário

Nenhuma camada conhece implementações concretas fora do Composition Root.

---

### 4. Result Pattern

Todos os Use Cases retornam:

```
Result<T, DomainError>
```

Benefícios:

- Elimina uso de `throw`
- Evita `instanceof`
- Facilita testes
- Torna falhas explícitas

---

## Instruções de Execução

### Pré-requisitos

- Node.js (versão LTS)
- Yarn ou npm
- Ambiente React Native configurado
  - Android Studio e/ou Xcode
  - CocoaPods (para iOS)

### Instalação

```sh
yarn install
# ou
npm install
```

### Executar o Metro

```sh
yarn start
# ou
npm start
```

### Executar no Android

```sh
yarn android
# ou
npm run android
```

### Executar no iOS

```sh
bundle install
bundle exec pod install
yarn ios
```

### Executar Testes

```sh
yarn test
```

---

## Pontos de Melhoria / Próximos Passos

- Implementar **testes de integração end-to-end**
- Melhorar cobertura de testes de UI
- Introduzir **feature flags**
- Refinar tratamento de erros globais
- Implementar cache mais sofisticado
- Internacionalização (i18n)
- Monitoramento e logging estruturado

---

## Considerações Finais

Este projeto foi desenvolvido com foco em:

- Clareza arquitetural
- Código previsível
- Facilidade de evolução
- Aderência a boas práticas modernas de engenharia

Ele está preparado para crescer de forma sustentável sem comprometer a qualidade técnica.
