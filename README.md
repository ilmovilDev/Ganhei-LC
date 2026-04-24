---
# 🗓 SEMANA 1 — FUNDACIÓN (DATA + CORE)

## 🎯 Objetivo
Base sólida: DB + Schemas + Types + Service
---

## 📦 Tareas

### 1. Prisma (DB)

- [ ] Modelos: User, Day, Earning
- [ ] Enum App
- [ ] Constraint único: (date + userId)

### 2. Schemas (Zod)

- [ ] createEarningSchema
- [ ] updateEarningSchema
- [ ] deleteEarningSchema
- [ ] getEarningsSchema
- [ ] getDayByIdSchema

### 3. Types

- [ ] Inputs (z.infer)
- [ ] DTOs
- [ ] ViewModels

---

## 🔥 4. Service (CRÍTICO)

Implementar en orden:

- [ ] createEarning (transaction + upsert Day)
- [ ] getEarnings (por mes)
- [ ] getDayById
- [ ] updateEarning (ownership check)
- [ ] deleteEarning (ownership check)

---

## ✅ Criterios de aceptación

- [ ] No se duplican Days
- [ ] Earnings se crean correctamente
- [ ] Multi-tenant seguro (userId)
- [ ] Queries funcionan sin errores

---

## 🧪 Testing manual

- Crear earning
- Obtener earnings
- Editar
- Eliminar
- Ver DB directamente

---

## 🚫 NO avanzar si:

- Service falla
- Hay inconsistencias en DB

---

# 🗓 SEMANA 2 — BACKEND + DATA FLOW

## 🎯 Objetivo

Conectar frontend con backend correctamente

---

## 📦 Tareas

### 5. Actions

Orden:

- [ ] create-earning.ts
- [ ] get-earnings.ts
- [ ] get-day-by-id.ts
- [ ] update-earning.ts
- [ ] delete-earning.ts

---

### Estructura obligatoria:
