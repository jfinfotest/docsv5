# Despliegue en GitHub Pages

Este proyecto incluye una configuración específica para desplegar en GitHub Pages que lee documentos de la carpeta `docs`.

## Configuración Automática

### 1. Workflow de GitHub Actions

El archivo `.github/workflows/deploy.yml` contiene un workflow que:
- Se ejecuta automáticamente en cada push a la rama `main`
- Instala dependencias
- Ejecuta el build optimizado para GitHub Pages
- Despliega automáticamente el sitio

### 2. Scripts de Build

Se han agregado scripts específicos en `package.json`:

```bash
# Build para GitHub Pages
npm run build:github

# Preview local del build de GitHub Pages
npm run preview:github
```

## Configuración Manual

### Paso 1: Configurar el repositorio

1. **Actualizar la base URL**: Edita `vite.config.github.ts` y cambia:
   ```typescript
   base: '/docsv1/', // Cambia por el nombre de tu repositorio
   ```
   Por ejemplo, si tu repositorio se llama `mi-documentacion`:
   ```typescript
   base: '/mi-documentacion/',
   ```

### Paso 2: Habilitar GitHub Pages

1. Ve a la configuración de tu repositorio en GitHub
2. Navega a **Settings** > **Pages**
3. En **Source**, selecciona **GitHub Actions**
4. El workflow se ejecutará automáticamente en el próximo push

### Paso 3: Estructura de documentos

Asegúrate de que tus documentos estén en la carpeta `docs/` con la siguiente estructura:

```
docs/
├── file-manifest.json
├── v1.0/
│   ├── en/
│   │   └── *.md
│   └── es/
│       └── *.md
└── v2.0/
    ├── en/
    │   └── *.md
    └── es/
        └── *.md
```

## Características del Build de GitHub Pages

### Optimizaciones incluidas:
- ✅ **Code splitting**: Separación automática de vendors, mermaid y markdown
- ✅ **Minificación avanzada**: Usando Terser con eliminación de console.log
- ✅ **Sin sourcemaps**: Para reducir el tamaño del bundle
- ✅ **Archivo .nojekyll**: Para evitar procesamiento de Jekyll
- ✅ **Base URL configurada**: Para funcionar correctamente en subdirectorios

### Tamaños de bundle optimizados:
- Vendor (React): ~140KB
- Markdown: ~442KB
- Mermaid: ~530KB
- Main: ~1.1MB

## Comandos útiles

```bash
# Desarrollo local
npm run dev

# Build para GitHub Pages
npm run build:github

# Preview del build de GitHub Pages
npm run preview:github

# Actualizar manifest de archivos
npm run update-file-manifest
```

## Solución de problemas

### El sitio no carga correctamente
1. Verifica que la `base` URL en `vite.config.github.ts` coincida con el nombre de tu repositorio
2. Asegúrate de que GitHub Pages esté configurado para usar GitHub Actions

### Los documentos no se cargan
1. Verifica que la carpeta `docs/` contenga el `file-manifest.json`
2. Ejecuta `npm run update-file-manifest` para regenerar el manifest

### Errores de build
1. Verifica que todas las dependencias estén instaladas: `npm install`
2. Limpia la caché: `rm -rf node_modules/.vite`

## Dominio personalizado (opcional)

Para usar un dominio personalizado:
1. Agrega tu dominio en el archivo `.github/workflows/deploy.yml`:
   ```yaml
   cname: tu-dominio.com
   ```
2. Configura los registros DNS de tu dominio para apuntar a GitHub Pages