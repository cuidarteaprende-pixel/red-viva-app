# Red Viva - Sistema de Cuidado de Adultos Mayores

Sistema de acompañamiento inteligente y ético para el cuidado interdisciplinario de adultos mayores.

## 🚀 Despliegue en Producción

### Variables de Entorno Requeridas

Asegúrate de configurar las siguientes variables de entorno en tu plataforma de hosting:

```env
NEXT_PUBLIC_RED_VIVA_WEBHOOK_URL=https://red-viva.app.n8n.cloud/webhook/red-viva-intake
NEXT_PUBLIC_SUPABASE_URL=https://tpwrhrrdortykvdzebwb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_aqui
```

### Comandos de Build

```bash
# Instalar dependencias
npm install

# Build de producción
npm run build

# Iniciar servidor de producción
npm start
```

### Configuración para Vercel

1. Conecta tu repositorio de GitHub
2. Configura las variables de entorno en el dashboard de Vercel
3. El build se ejecutará automáticamente

### Configuración para Netlify

1. Build command: `npm run build`
2. Publish directory: `.next`
3. Configura las variables de entorno en el dashboard

## 📁 Estructura del Proyecto

- `/app` - Páginas y rutas de Next.js
- `/components` - Componentes React reutilizables
- `/lib` - Utilidades y configuración de Supabase
- `/public` - Archivos estáticos

## 🔧 Desarrollo Local

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## ✅ Estado del Build

El proyecto está configurado correctamente y el build de producción es exitoso.

## 📝 Notas Importantes

- El proyecto usa Next.js 15.5.11
- Requiere Node.js 18 o superior
- La base de datos está en Supabase
- Los webhooks están configurados en n8n.cloud
