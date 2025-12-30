# E2E Tests - Detox + Cucumber

End-to-end tests for the React Native application using Detox for UI automation and Cucumber for BDD-style test definitions.

## 📁 Structure

```
e2e/
├── features/              # Gherkin feature files (.feature)
│   ├── auth.feature
│   ├── request_vacation.feature
│   └── manager_dashboard.feature
├── steps/                 # Step definitions (.ts)
│   ├── auth.steps.ts
│   ├── request_vacation.steps.ts
│   └── manager_dashboard.steps.ts
├── support/              # Test support files
│   ├── init.ts           # Detox + Cucumber bootstrap
│   ├── world.ts          # Shared World (test state)
│   └── hooks.ts          # BeforeAll / AfterAll hooks
└── config/               # Configuration files
    ├── detox.config.js   # Detox configuration
    ├── jest.config.js    # Jest configuration for Cucumber
    ├── setup.js          # Global setup
    └── teardown.js       # Global teardown
```

## 🚀 Setup

### Prerequisites

1. **Detox CLI** (optional, for easier management):

   ```bash
   npm install -g detox-cli
   ```

2. **Android Setup**:
   - Android SDK installed
   - Android emulator created (e.g., `Pixel_5_API_33`)
   - Environment variables set:
     ```bash
     export ANDROID_HOME=$HOME/Library/Android/sdk
     export PATH=$PATH:$ANDROID_HOME/emulator
     export PATH=$PATH:$ANDROID_HOME/platform-tools
     ```

3. **iOS Setup**:
   - Xcode installed
   - iOS Simulator available
   - CocoaPods dependencies installed:
     ```bash
     cd ios && pod install
     ```

### Installation

1. **Install dependencies** (if not already done):

   ```bash
   npm install
   ```

2. **Build the app** (required before first test):

   ```bash
   # Android
   npm run build:android:debug

   # iOS
   npm run build:ios:debug
   ```

3. **Build Detox** (if needed):
   ```bash
   detox build -c android.debug
   # or
   detox build -c ios.debug
   ```

## 🧪 Running Tests

### Run All E2E Tests

```bash
npm run test:e2e
```

### Run Specific Feature

```bash
npm run test:e2e -- --grep "@auth"
```

### Run on Specific Platform

```bash
# Android
npm run test:e2e:android

# iOS
npm run test:e2e:ios
```

## 📝 Writing Tests

### Feature Files (Gherkin)

Feature files define **what** the user does in plain language:

```gherkin
# language: pt
Funcionalidade: Solicitar Férias
  Como um colaborador
  Eu quero solicitar minhas férias

  Cenário: Solicitar férias com sucesso
    Dado que estou logado como colaborador
    Quando eu solicito férias de "10/03/2025" até "15/03/2025"
    Então eu devo ver a solicitação no histórico
```

### Step Definitions

Step definitions define **how** the test is executed using Detox:

```typescript
When('eu solicito férias de {string} até {string}', async (start: string, end: string) => {
  await element(by.id('RequestVacationScreen_StartDateButton')).tap();
  // ... select dates
  await element(by.id('RequestVacationScreen_SubmitButton')).tap();
});
```

## 🔒 Architecture Rules

### ✅ DO

- Interact **only** with UI elements (testIDs, text, labels)
- Use Detox APIs (`element`, `by.id`, `waitFor`)
- Store test state in World object (user roles, IDs)
- Write steps that map clearly to Gherkin sentences

### ❌ DON'T

- Import UseCases, repositories, or container
- Mock hooks or domain logic
- Access business logic directly
- Create artificial test IDs (use existing ones)
- Add business logic to step definitions

## 🐛 Troubleshooting

### Detox Installation Issues

If Detox fails to install:

1. **Clean and retry**:

   ```bash
   rm -rf node_modules/detox
   npm install
   ```

2. **Manual iOS framework build** (if needed):
   ```bash
   cd node_modules/detox
   ./scripts/build_local_framework.ios.sh
   ```

### App Not Launching

1. **Check emulator/simulator is running**:

   ```bash
   # Android
   adb devices

   # iOS
   xcrun simctl list devices
   ```

2. **Rebuild the app**:
   ```bash
   npm run build:android:debug
   ```

### Tests Timing Out

- Increase timeout in `e2e/config/jest.config.js`
- Check app is actually launching
- Verify testIDs exist in the UI

## 📚 Resources

- [Detox Documentation](https://wix.github.io/Detox/)
- [Cucumber.js Documentation](https://github.com/cucumber/cucumber-js)
- [Gherkin Syntax](https://cucumber.io/docs/gherkin/)
