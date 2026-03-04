# Proyectos_Personales

## 🌐 Ver en la web

El proyecto **Registro y Validación de Usuarios** está publicado en GitHub Pages:

👉 **https://aech18.github.io/Proyectos_Personales/**

## 🚀 Cómo funciona el despliegue

Este repositorio usa **GitHub Actions** para publicar automáticamente la carpeta `registro-usuarios/` en GitHub Pages cada vez que se hace un push a la rama `main`.

### Pasos para activarlo (una sola vez)

1. Ve a **Settings → Pages** en tu repositorio de GitHub.
2. En la sección **Build and deployment**, selecciona **Source: GitHub Actions**.
3. Haz un push a `main`; la acción `.github/workflows/deploy-pages.yml` se encargará del resto.

Después de unos segundos, la página estará disponible en:
`https://<tu-usuario>.github.io/<nombre-del-repo>/`

## 📁 Proyectos

### registro-usuarios
Formulario de registro e inicio de sesión con validación en tiempo real, hash de contraseñas (SHA-256) y persistencia en `localStorage`.