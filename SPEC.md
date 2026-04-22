# LegalPro - Plataforma de Suscripción de Protección Legal

## Product Overview

**Nombre:** LegalPro  
**Descripción:** Plataforma SaaS de suscripción para protección legal en Ecuador con coberturas laborales, familiares, civiles, penales, empresariales y constitucionales.  
**Target:** Empresas y empleados que requieren asistencia legal continua.

---

## Tech Stack

| Componente | Tecnología |
|------------|------------|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Estilos | Tailwind CSS + shadcn/ui |
| Database | Railway PostgreSQL + Drizzle ORM |
| Auth | NextAuth.js (Google OAuth) |
| Payments | Payphone (Ecuador) |
| Deploy | Railway |

---

## Features

### Público General
- Landing page informativa con servicios legales
- Plans de suscripción visibles
- Proceso de contratación rápido (go-to-market sin fricción)
- Checkout con Payphone

### Cliente Suscrito
- Portal del cliente con sus coberturas contratadas
- Panel de estado de suscripción (activa/inactiva)
- Historial de pagos
- Acceso a servicios según coberturas contratadas

### Administrador
- Dashboard con métricas de suscripción
- Gestión de clientes y suscripciones
- Seguimiento de cobros (migrando desde Excel)
- Panel de cobertura por cliente

---

## Coberturas del Servicio

| # | Cobertura | Descripción |
|---|-----------|-------------|
| 1 | Laboral | Asesoramiento en conflictos laborales |
| 2 | Demandas de Alimentos | Tramites y representación en demandas de alimentos |
| 3 | Violencia Intrafamiliar | Protección y asesoramiento en casos de VIF |
| 4 | Civil | Conflictos civiles y contratos |
| 5 | Bienes | Tramites de propiedad y bienes |
| 6 | Compra Venta y Legalización | Asesoría en transacciones comerciales |
| 7 | Asesoría Penal | Defensa y representación penal |
| 8 | Asesoría Empresarial y Mercantil | Consultas para empresas |
| 9 | Constitucional | Amparos y derechos constitucionales |

---

## Database Schema (Core)

```sql
-- users (clientes)
users: id, name, email, phone, cedula, created_at

-- subscriptions
subscriptions: id, user_id, status, start_date, end_date, plan_id

-- plans (planes de suscripción)
plans: id, name, price, coverage_ids[]

-- coverages (coberturas disponibles)
coverages: id, name, description, slug

-- subscription_coverages
subscription_coverages: subscription_id, coverage_id, active

-- payments
payments: id, subscription_id, amount, date, status, payment_method
```

---

## Estructura de Planes Sugerida

| Plan | Coberturas | Precio Sugerido |
|------|------------|-----------------|
| Básico | Laboral, Civil, Bienes | $15/mes |
| Familiar | Laboral, Alimentos, VIF, Civil | $25/mes |
| Empresarial | Laboral, Civil, Empresarial, Penal | $40/mes |
| Premium | Todas las coberturas | $50/mes |

---

## UI/UX Principles

- **Go-to-Market rápido**: Proceso de contratación en máximo 3 pasos
- **Claro y directo**: Información de coberturas fácil de entender
- **Confiable**: Diseño profesional que transmita seguridad legal
- **Responsive**: Funcional en móviles para acceso rápido

---

## Referencia de Datos

- Excel actual en: `CONTROL DE VENTAS/CONTROL VENTAS 2026/ENE-2026/`
- Formato actual: Control de ventas y pagos mensuales por cliente
- Objetivo: Migrar gestión a plataforma web gradualmente