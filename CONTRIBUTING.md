# 🤝 Guía de Contribución

Primero que todo, ¡gracias por tu interés en contribuir a Voice Legacy Builder!

## Código de Conducta

Este proyecto adhiere a un Código de Conducta que esperamos todas las contribuciones respeten. Al participar, se espera que mantengas un ambiente respetuoso e inclusivo.

## Tipos de Contribuciones

### 🐛 Reportar Bugs
1. Verifica que el bug no haya sido reportado antes
2. Abre un [issue](https://github.com/tu-usuario/voiceLegacyBuilder/issues) con:
   - Título descriptivo
   - Descripción clara del problema
   - Pasos para reproducir
   - Comportamiento esperado vs actual
   - Screenshots si aplica
   - Tu sistema (OS, versión Node, etc)

### ✨ Sugerir Mejoras
1. Usa el template de [Feature Request](https://github.com/tu-usuario/voiceLegacyBuilder/issues/new?template=feature_request.md)
2. Describe el problema que resuelve
3. Propone una solución clara

### 🔧 Submitting Pull Requests

#### Configuración local
```bash
# 1. Fork el repositorio en GitHub
# 2. Clona tu fork
git clone https://github.com/TU_USUARIO/voiceLegacyBuilder.git
cd voiceLegacyBuilder

# 3. Agrega upstream
git remote add upstream https://github.com/ORIGINAL_OWNER/voiceLegacyBuilder.git

# 4. Crea una rama
git checkout -b feature/descriptivo-nombre
```

#### Desarrollo
```bash
# Instala dependencias
npm install

# Inicia servidor de desarrollo
npm start

# En otra terminal, ejecuta linter y tests
npm run lint
npm test
```

#### Antes de hacer push
```bash
# Formatea código
npm run format

# Verifica linting
npm run lint

# Ejecuta tests
npm test

# Verifica build
npm run build
```

#### Commit messages
Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): mensaje descriptivo

body (opcional)
footer (opcional)
```

**Tipos válidos:**
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Formateo (sin cambiar código)
- `refactor`: Refactorización
- `perf`: Mejora de rendimiento
- `test`: Agregar o actualizar tests
- `ci`: Cambios en CI/CD

**Ejemplos:**
```
feat(audio): agregar compresión de archivos WAV
fix(storage): resolver crash al acceder a AsyncStorage
docs: actualizar instrucciones de instalación
test: agregar tests para synthesisService
```

#### Crear Pull Request
1. Push tu rama: `git push origin feature/descriptivo-nombre`
2. Abre PR en GitHub
3. Completa el template de PR con:
   - Descripción clara de cambios
   - Issue relacionado (#123)
   - Screenshots si es UI
   - Checklist de testing

## 📋 Checklist para PR

- [ ] Mi código sigue los estilos del proyecto
- [ ] He ejecutado `npm run format` y `npm run lint`
- [ ] He agregado tests para nuevas funciones
- [ ] Todos los tests pasan: `npm test`
- [ ] He actualizado la documentación
- [ ] Mi PR tiene una descripción clara
- [ ] No tengo conflictos con main

## 🎯 Áreas de Enfoque

Estamos buscando ayuda particularmente en:

### 🔴 Prioridad Alta
- [ ] Implementar modelos de ML reales (Glow-TTS, HiFi-GAN)
- [ ] Agregar TensorFlow Lite integration
- [ ] Mejorar UI/UX
- [ ] Performance optimization
- [ ] Tests comprehensivos

### 🟡 Prioridad Media
- [ ] Documentación de API
- [ ] Más validaciones de seguridad
- [ ] Traducción a otros idiomas
- [ ] Mejoras de accesibilidad

### 🟢 Prioridad Baja
- [ ] Ejemplos adicionales
- [ ] Snippets de código
- [ ] Mejoras menores de UI

## 📚 Estructura del Proyecto

```
src/
├── components/      # Componentes reutilizables
├── screens/         # Pantallas principales
├── services/        # Lógica de negocio
├── constants/       # Config y constantes
├── hooks/           # Custom React hooks
├── utils/           # Utilidades
└── models/          # Modelos ML (vacío - necesita archivos)
```

## 🧪 Escribir Tests

```javascript
// Ejemplo: services/__tests__/audioService.test.js
import { requestRecordingPermission } from '../audioService';

describe('audioService', () => {
  it('debe solicitar permisos de micrófono', async () => {
    const result = await requestRecordingPermission();
    expect(result).toBe(true);
  });
});
```

## 🔐 Seguridad

- **Nunca** commits API keys o secrets
- Valida **siempre** input del usuario
- Usa librerías de seguridad establecidas
- Reporta vulnerabilidades de forma responsable

## ❓ Preguntas?

- Abre una [Discussion](https://github.com/tu-usuario/voiceLegacyBuilder/discussions)
- Email: contact@voicelegacy.app

---

¡Gracias por tu contribución! 🎉