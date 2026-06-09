# 🎤 Voice Legacy Builder

> **Entrena, guarda y sintetiza voces privadas localmente en tu dispositivo.**
> Sin servidores, sin APIs externas, tu privacidad garantizada.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![Platform](https://img.shields.io/badge/platform-Android%20%7C%20iOS%20%7C%20Web-blue)](https://expo.dev)

---

## 📋 Tabla de Contenidos

- [Características](#características)
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Desarrollo](#desarrollo)
- [Compilación](#compilación)
- [Despliegue](#despliegue)
- [Seguridad](#seguridad)
- [Contribución](#contribución)
- [Licencia](#licencia)

---

## ✨ Características

- ✅ **Privacidad Total**: Tu voz se procesa y almacena únicamente en tu dispositivo
- ✅ **Sin conexión requerida**: Funciona completamente offline
- ✅ **Multiplataforma**: Android, iOS y Web
- ✅ **Interfaz intuitiva**: Diseño oscuro y accesible
- ✅ **Entrenamiento local**: Crea un perfil biométrico de voz único
- ✅ **Síntesis de audio**: Genera audio con tu voz sintetizada
- ✅ **Almacenamiento seguro**: Datos encriptados localmente

---

## 🔧 Requisitos

### Software
- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0
- **Expo CLI**: `npm install -g expo-cli`
- **Java JDK**: 17+ (para Android)
- **Android Studio**: (para testing en Android)
- **Xcode**: (para testing en iOS en Mac)

### Hardware
- Micrófono funcional
- Almacenamiento: >= 100MB
- RAM: >= 1GB

---

## 📦 Instalación

### Clonar repositorio
```bash
git clone https://github.com/tu-usuario/voiceLegacyBuilder.git
cd voiceLegacyBuilder
```

### Instalar dependencias
```bash
npm install
```

### Verificar instalación
```bash
npm run doctor
```

---

## 🚀 Desarrollo

### Iniciar servidor Expo
```bash
npm start
```

Esto abrirá Expo Go. Escanea el código QR con tu dispositivo.

### Desarrollo por plataforma

#### Android
```bash
npm run android
```

#### iOS (solo en Mac)
```bash
npm run ios
```

#### Web
```bash
npm run web
```

### Testing
```bash
# Ejecutar tests
npm test

# Modo watch
npm test:watch

# Con coverage
npm test -- --coverage
```

### Linting
```bash
# Verificar código
npm run lint

# Formatear automáticamente
npm run format
```

---

## 🏗️ Compilación

### Build para producción

#### Android
```bash
npm run build:android
# O para release automático:
npm run android:release
```

#### iOS (Mac)
```bash
npm run build:ios
```

#### Web
```bash
npm run build:web
```

### Validación pre-build
```bash
npm run doctor
npm run lint
npm test
```

---

## 🌐 Despliegue

### Android (Google Play Store)
1. Crear cuenta en [Google Play Console](https://play.google.com/console)
2. Configurar EAS (Expo Application Services):
   ```bash
   eas init
   eas build --platform android
   eas submit --platform android
   ```

### iOS (Apple App Store)
1. Crear cuenta en [App Store Connect](https://appstoreconnect.apple.com)
2. Compilar en Mac:
   ```bash
   eas init
   eas build --platform ios
   eas submit --platform ios
   ```

### Web (Vercel/Netlify)
```bash
# Generar build web
npm run build:web

# Desplegar en Vercel
vercel deploy dist

# O en Netlify
netlify deploy --prod --dir dist
```

---

## 🔒 Seguridad

### Buenas prácticas implementadas
- ✅ Validación de entrada en todo UI
- ✅ Encriptación de datos locales
- ✅ Sin APIs externas (privacidad garantizada)
- ✅ Permisos mínimos solicitados
- ✅ Errores sanitizados

### Reportar vulnerabilidades
⚠️ **NO** abras un issue público para vulnerabilidades.
Envía un email a: security@voicelegacy.app

---

## 🤝 Contribución

¡Las contribuciones son bienvenidas!

### Pasos para contribuir
1. Fork el repositorio
2. Crea una rama: `git checkout -b feature/mi-feature`
3. Commit cambios: `git commit -m 'Add: descripción'`
4. Push: `git push origin feature/mi-feature`
5. Abre un Pull Request

### Estándares de código
- Usar Prettier para formato (se ejecuta automáticamente)
- Pasar linting: `npm run lint`
- Agregar tests para nuevas funciones
- Documentar cambios significativos

---

## 📄 Licencia

Este proyecto está licenciado bajo la [Licencia MIT](LICENSE).

---

## 📞 Contacto

- **Email**: contact@voicelegacy.app
- **GitHub Issues**: [Crear issue](https://github.com/tu-usuario/voiceLegacyBuilder/issues)
- **Reportar bugs**: [Bug Report](https://github.com/tu-usuario/voiceLegacyBuilder/issues/new?template=bug_report.md)

---

## 🙏 Agradecimientos

Desarrollado con ❤️ usando:
- [Expo](https://expo.dev)
- [React Native](https://reactnative.dev)
- [React](https://react.dev)

---

**⭐ Si este proyecto te fue útil, considera dejar una estrella en GitHub!**