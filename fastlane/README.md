# Fastlane Configuration

Este diretório contém a configuração do Fastlane para automação de builds e versionamento do aplicativo React Native.

## 📋 Pré-requisitos

### 1. Ruby e Bundler

O Fastlane requer Ruby e Bundler. Verifique se estão instalados:

```bash
ruby --version  # Deve ser >= 2.6.10
bundler --version
```

Se não estiverem instalados:

- **macOS**: Ruby geralmente vem pré-instalado. Para Bundler: `gem install bundler`
- **Linux**: Use `rbenv` ou `rvm` para gerenciar versões do Ruby

### 2. Instalar Dependências

Instale as gems do projeto (incluindo Fastlane):

```bash
bundle install
```

Isso instalará todas as dependências definidas no `Gemfile` na raiz do projeto.

## 🏗️ Estrutura

```
fastlane/
├── Fastfile          # Orquestração de versão e builds (root)
├── Appfile           # Configuração compartilhada (root)
└── README.md         # Esta documentação

android/fastlane/
├── Fastfile          # Builds e versionamento Android
└── Appfile           # Configuração Android

ios/fastlane/
├── Fastfile          # Builds e versionamento iOS
└── Appfile           # Configuração iOS
```

## 🚀 Uso

### Versionamento Automático

O Fastlane sincroniza a versão entre `package.json`, Android (`build.gradle`) e iOS (`project.pbxproj`).

#### Bump Patch (0.0.1 → 0.0.2)

```bash
npm run bump:patch
```

#### Bump Minor (0.0.1 → 0.1.0)

```bash
npm run bump:minor
```

#### Bump Major (0.0.1 → 1.0.0)

```bash
npm run bump:major
```

**O que acontece:**

1. Incrementa a versão no `package.json`
2. Atualiza `versionName` no Android (`android/app/build.gradle`)
3. Incrementa `versionCode` no Android automaticamente
4. Atualiza `MARKETING_VERSION` no iOS (`project.pbxproj`)
5. Incrementa `CURRENT_PROJECT_VERSION` (build number) no iOS automaticamente

### Builds Android

#### Build Debug (APK)

```bash
npm run build:android:debug
# ou
npm run build:android
```

**Output:** `android/app/build/outputs/apk/debug/app-debug.apk`

#### Build Release (AAB)

```bash
npm run build:android:release
```

**Output:** `android/app/build/outputs/bundle/release/app-release.aab`

### Builds iOS

#### Build Debug

```bash
npm run build:ios:debug
# ou
npm run build:ios
```

#### Build Release (IPA)

```bash
npm run build:ios:release
```

**Output:** `~/Library/Developer/Xcode/Archives/`

**Nota:** Builds iOS requerem:

- macOS com Xcode instalado
- Certificados de desenvolvimento configurados (para release)
- Provisioning profiles configurados

### Comandos Diretos do Fastlane

Você também pode usar o Fastlane diretamente:

```bash
# Na raiz do projeto
cd fastlane
bundle exec fastlane bump_patch
bundle exec fastlane build_android build_type:release

# No diretório Android
cd android/fastlane
bundle exec fastlane build_debug
bundle exec fastlane increment_version version:1.2.3

# No diretório iOS
cd ios/fastlane
bundle exec fastlane build_release
bundle exec fastlane increment_version version:1.2.3
```

## 📝 Lanes Disponíveis

### Root (`fastlane/Fastfile`)

- `version` - Bump version em todas as plataformas
- `bump_patch` - Incrementa patch version
- `bump_minor` - Incrementa minor version
- `bump_major` - Incrementa major version
- `build_android` - Build Android (debug ou release)
- `build_ios` - Build iOS (debug ou release)

### Android (`android/fastlane/Fastfile`)

- `build_debug` - Build APK de debug
- `build_release` - Build AAB de release
- `increment_version` - Atualiza versionName e incrementa versionCode

### iOS (`ios/fastlane/Fastfile`)

- `build_debug` - Build de debug
- `build_release` - Build IPA de release
- `increment_version` - Atualiza MARKETING_VERSION e incrementa CURRENT_PROJECT_VERSION

## 🔧 Configuração

### Android

O `Appfile` do Android contém:

- `app_identifier`: Bundle identifier do app

### iOS

O `Appfile` do iOS contém:

- `app_identifier`: Bundle identifier do app
- `apple_team_id`: (Opcional) ID do time Apple Developer
- `apple_id`: (Opcional) Email da conta Apple Developer

**Para builds de release iOS**, você precisará configurar:

1. Certificados de distribuição na Apple Developer
2. Provisioning profiles
3. Descomentar e preencher `apple_team_id` e `apple_id` no `ios/fastlane/Appfile`

## 🧪 Testes

### Testar Versionamento

```bash
# 1. Verificar versão atual
cat package.json | grep version
cat android/app/build.gradle | grep versionName
cat ios/FeriasControlTemp.xcodeproj/project.pbxproj | grep MARKETING_VERSION

# 2. Bump patch
npm run bump:patch

# 3. Verificar se todas as versões foram atualizadas
cat package.json | grep version
cat android/app/build.gradle | grep versionName
cat ios/FeriasControlTemp.xcodeproj/project.pbxproj | grep MARKETING_VERSION
```

### Testar Builds

```bash
# Android Debug
npm run build:android:debug
ls -lh android/app/build/outputs/apk/debug/app-debug.apk

# Android Release
npm run build:android:release
ls -lh android/app/build/outputs/bundle/release/app-release.aab

# iOS (requer macOS)
npm run build:ios:debug
```

## ⚠️ Troubleshooting

### Erro: "bundle: command not found"

Instale o Bundler:

```bash
gem install bundler
```

### Erro: "Could not find gem 'fastlane'"

Instale as dependências:

```bash
bundle install
```

### Erro no build iOS: "No signing certificate"

Para builds de release iOS, configure os certificados:

1. Abra o projeto no Xcode
2. Configure os certificados e provisioning profiles
3. Ou use `match` do Fastlane (não incluído neste setup básico)

### Erro: "Permission denied" no Gradle

Torne o script gradlew executável:

```bash
chmod +x android/gradlew
```

## 📚 Recursos

- [Fastlane Documentation](https://docs.fastlane.tools/)
- [Fastlane Actions](https://docs.fastlane.tools/actions/)
- [React Native Build Guide](https://reactnative.dev/docs/signed-apk-android)

## 🔐 Segurança

⚠️ **Importante para Produção:**

- NÃO commite certificados ou keystores no repositório
- Use variáveis de ambiente para credenciais sensíveis
- Configure signing configs adequados para release builds
- Considere usar `match` do Fastlane para gerenciar certificados (futuro)

## 🎯 Próximos Passos (Futuro)

- Integração com CI/CD (GitHub Actions, GitLab CI)
- Upload automático para TestFlight/Play Store
- Gerenciamento de certificados com `match`
- Screenshots automatizados
- Beta testing automation
