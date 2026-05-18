# Proyectos_Personales

## 🌐 Ver en la web

El proyecto **wc2026-shop** está publicado en GitHub Pages:

👉 **https://aech18.github.io/Proyectos_Personales/**

## 🚀 Cómo funciona el despliegue

Este repositorio usa **GitHub Actions** para publicar automáticamente la carpeta `wc2026-shop/` en GitHub Pages cada vez que se hace un push a la rama `main`.

### Pasos para activarlo (una sola vez)

1. Ve a **Settings → Pages** en tu repositorio de GitHub.
2. En la sección **Build and deployment**, selecciona **Source: GitHub Actions**.
3. Haz un push a `main`; la acción `.github/workflows/deploy-pages.yml` se encargará del resto.

Después de unos segundos, la página estará disponible en:
`https://<tu-usuario>.github.io/<nombre-del-repo>/`

## 📁 Proyectos

### wc2026-shop
Tienda temática del Mundial 2026 con catálogo de camisetas, carrito y finalización de compra por WhatsApp.

### registro-usuarios
Formulario de registro e inicio de sesión con validación en tiempo real, hash de contraseñas (SHA-256) y persistencia en `localStorage`.

### estefana-bistro
Página web de menú digital para restaurante/bistro, similar a los sitios generados por la plataforma Flavoo. Incluye:
- **Hero** con fondo fotográfico, nombre del restaurante y botón de WhatsApp
- **Barra de información** con horario, ubicación, domicilio y calificación
- **Menú digital** con categorías filtrables (Entradas, Principales, Postres, Bebidas) y precios
- **Carrito de pedido** deslizante con generación automática de mensaje de WhatsApp
- **Sección Nosotros** con historia y valores del bistro
- **Galería** fotográfica
- **Sección de Contacto** con mapa integrado y redes sociales
- **Botón flotante de WhatsApp** siempre visible
- Diseño **mobile-first** y completamente responsivo
