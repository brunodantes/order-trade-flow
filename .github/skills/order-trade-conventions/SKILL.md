---
name: order-trade-conventions
description: 'Use when creating new files, naming components, defining TypeScript types, or structuring folders in the order-trade-flow project. Triggers: project structure, naming conventions, TypeScript types for NewOrderSingle, folder layout, file naming, import aliases, where to put components/schemas/api clients, code organization.'
---

# Order Trade Flow — Project Conventions

## When to Use
- Creating any new file in the `order-generator` Next.js app
- Deciding where a component, schema, or utility belongs
- Defining or extending TypeScript types for orders
- Resolving import path questions (`@/` aliases)

## Project Folder Structure

```
order-trade-flow/
├── order-generator/              # Next.js frontend
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Home page — renders <NewOrderSingleForm>
│   │   ├── api/
│   │   │   └── orders/
│   │   │       └── route.ts      # POST proxy to backend
│   │   └── components/
│   │       └── orders/
│   │           ├── NewOrderSingleForm.tsx
│   │           ├── SymbolSelect.tsx
│   │           ├── SideSelect.tsx
│   │           ├── QuantityInput.tsx
│   │           ├── PriceInput.tsx
│   │           └── OrderResult.tsx
│   ├── lib/
│   │   ├── utils.ts              # cn() helper (Shadcn generated)
│   │   ├── schemas/
│   │   │   └── order.ts          # Zod schemas + inferred types
│   │   └── api/
│   │       └── orders.ts         # submitOrder() client function
│   ├── components/
│   │   └── ui/                   # Shadcn generated components (do not edit manually)
│   ├── .env.local                # BACKEND_URL (not committed)
│   └── tsconfig.json             # Path alias: "@/*" → "./*"
```

## File Naming

| Artifact              | Convention              | Example                      |
|-----------------------|-------------------------|------------------------------|
| React components      | PascalCase `.tsx`       | `NewOrderSingleForm.tsx`     |
| Hooks                 | camelCase `use*.ts`     | `useOrderForm.ts`            |
| Utilities / helpers   | camelCase `.ts`         | `formatPrice.ts`             |
| Zod schemas           | camelCase `.ts`         | `order.ts`                   |
| API client functions  | camelCase `.ts`         | `orders.ts`                  |
| Next.js route handler | `route.ts` (fixed name) | `app/api/orders/route.ts`    |
| Shadcn UI primitives  | kebab-case (generated)  | `components/ui/select.tsx`   |

## TypeScript Types

All domain types live in `lib/schemas/order.ts` and are inferred from the zod schema.

```ts
// lib/schemas/order.ts
export const SYMBOLS = ['PETR4', 'VALE3', 'VIIA4'] as const
export const SIDES   = ['B', 'S'] as const

export type Symbol = typeof SYMBOLS[number]   // 'PETR4' | 'VALE3' | 'VIIA4'
export type Side   = typeof SIDES[number]     // 'B' | 'S'

export interface NewOrderSingle {
  symbol:   Symbol
  side:     Side
  quantity: number   // positive integer, < 100 000
  price:    number   // positive decimal, multiple of 0.01, < 1 000
}
```

Do **not** define these types manually elsewhere — always import from `@/lib/schemas/order`.

## Import Aliases

The `tsconfig.json` maps `@/*` → `./` (project root of `order-generator/`).

```ts
// Correct
import { newOrderSingleSchema } from '@/lib/schemas/order'
import { SymbolSelect } from '@/app/components/orders/SymbolSelect'
import { Button } from '@/components/ui/button'

// Wrong — avoid relative paths for cross-directory imports
import { newOrderSingleSchema } from '../../../lib/schemas/order'
```

## Component Responsibilities

| Component               | Responsibility                                              |
|-------------------------|-------------------------------------------------------------|
| `NewOrderSingleForm`    | Owns form state (`useForm`), submit handler, `<OrderResult>` |
| `SymbolSelect`          | Renders symbol `<Select>` field; receives `control`         |
| `SideSelect`            | Renders side `<Select>` field; receives `control`           |
| `QuantityInput`         | Renders quantity `<Input>` field; receives `control`        |
| `PriceInput`            | Renders price `<Input>` field; receives `control`           |
| `OrderResult`           | Stateless display of `OrderApiResponse`; receives `result`  |

## "use client" Directive

Any component that uses `useForm`, `useState`, or browser event handlers must start with:

```tsx
'use client'
```

`NewOrderSingleForm` and all its sub-field components require this. `OrderResult` is stateless but still client-rendered (receives state as prop from a client parent) — no directive needed unless it uses hooks directly.

## Environment Variables

| Variable       | Where defined  | Accessible in         |
|----------------|----------------|-----------------------|
| `BACKEND_URL`  | `.env.local`   | Server only (route handler) |

Never prefix with `NEXT_PUBLIC_`. Add `.env.local` to `.gitignore`.

## Prohibited Patterns

- Do not use `any` — use `unknown` and narrow types.
- Do not edit files inside `components/ui/` manually — re-run `npx shadcn@latest add` instead.
- Do not call the backend directly from client components — always go through the Next.js route handler.
- Do not share form state via global state (Context/Zustand) for this form — `useForm` local state is sufficient.
