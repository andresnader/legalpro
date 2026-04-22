# LegalPro

Plataforma de suscripción de protección legal para Ecuador.

## Quick Start

```bash
# Clone
git clone https://github.com/TU_USUARIO/legalpro.git
cd legalpro

# Install
npm install

# Run
npm run dev
```

## Configurar Variables

Copia `.env.example` a `.env` y configura:

```env
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

## Desplegar en Railway

1. Conecta el repo de GitHub a Railway
2. Añade las variables de entorno
3. Despliega