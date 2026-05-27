---
name: order-form-validation
description: 'Use when implementing or debugging validation for the NewOrderSingle order form. Triggers: zod schema, react-hook-form validation, field constraints (symbol enum PETR4/VALE3/VIIA4, side Compra/Venda, quantity positive integer under 100000, price positive decimal multiple of 0.01 under 1000), FormMessage error display, form submission guard, client-side validation rules.'
---

# Order Form Validation — NewOrderSingle

## When to Use
- Defining or updating zod schemas for the order form
- Adding or fixing validation rules for any order field
- Wiring react-hook-form with zod via `zodResolver`
- Debugging why a field passes or fails validation
- Ensuring consistent error messages in Portuguese

## Dependencies

```bash
npm install react-hook-form @hookform/resolvers zod
```

## Zod Schema — `newOrderSingleSchema`

File location: `order-generator/lib/schemas/order.ts`

```ts
import { z } from 'zod'

export const SYMBOLS = ['PETR4', 'VALE3', 'VIIA4'] as const
export const SIDES   = ['B', 'S'] as const   // B = Compra, S = Venda

export const newOrderSingleSchema = z.object({
  symbol: z.enum(SYMBOLS, {
    errorMap: () => ({ message: 'Selecione um ativo válido.' }),
  }),

  side: z.enum(SIDES, {
    errorMap: () => ({ message: 'Selecione um lado válido.' }),
  }),

  quantity: z
    .number({ invalid_type_error: 'Informe a quantidade.' })
    .int('A quantidade deve ser um número inteiro.')
    .positive('A quantidade deve ser maior que zero.')
    .max(99_999, 'A quantidade deve ser menor que 100.000.'),

  price: z
    .number({ invalid_type_error: 'Informe o preço.' })
    .positive('O preço deve ser maior que zero.')
    .max(999.99, 'O preço deve ser menor que R$ 1.000,00.')
    .refine(
      (v) => Number((v * 100).toFixed(0)) % 1 === 0,   // always true — guard below
      'O preço deve ser múltiplo de R$ 0,01.'
    )
    .refine(
      (v) => {
        const str = v.toFixed(2)
        return parseFloat(str) === v || Math.abs(v * 100 - Math.round(v * 100)) < 1e-9
      },
      'O preço deve ser múltiplo de R$ 0,01.'
    ),
})

export type NewOrderSingleFormValues = z.infer<typeof newOrderSingleSchema>
```

### Validation Rules Summary

| Field      | Type    | Rules                                                        |
|------------|---------|--------------------------------------------------------------|
| `symbol`   | enum    | Must be one of: `PETR4`, `VALE3`, `VIIA4`                   |
| `side`     | enum    | Must be one of: `B` (Compra), `S` (Venda)                   |
| `quantity` | integer | `> 0`, `< 100 000` (max 99 999), must be whole number       |
| `price`    | decimal | `> 0`, `< 1 000`, multiple of `0.01` (2 decimal places max) |

## React Hook Form Integration

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { newOrderSingleSchema, type NewOrderSingleFormValues } from '@/lib/schemas/order'

const form = useForm<NewOrderSingleFormValues>({
  resolver: zodResolver(newOrderSingleSchema),
  defaultValues: {
    symbol: undefined,
    side:   undefined,
    quantity: undefined,
    price:    undefined,
  },
  mode: 'onBlur',   // validate on blur for better UX; errors clear on change
})
```

## Input onChange — Numeric Fields

`<Input type="number">` returns strings by default. Convert to `number` explicitly:

```tsx
// In QuantityInput and PriceInput components:
onChange={e => field.onChange(
  e.target.value === '' ? undefined : e.target.valueAsNumber
)}
```

This ensures zod receives a `number` (or `undefined` when empty) rather than a string, preventing `invalid_type_error` from masking the real constraint violation.

## Price Multiple-of-0.01 Validation

The simplest reliable check using floating-point arithmetic:

```ts
(v) => Math.round(v * 100) / 100 === Math.round(v * 100 * 1) / 100
// OR simply:
(v) => parseFloat(v.toFixed(2)) === v
```

Use this in the `.refine()` for `price`.

## Error Display

Use Shadcn's `<FormMessage />` inside every `<FormItem>`. It automatically reads the error from `react-hook-form`'s context — no manual error passing needed.

```tsx
<FormItem>
  <FormLabel>Quantidade</FormLabel>
  <FormControl>
    <Input ... />
  </FormControl>
  <FormMessage />   {/* ← renders zod error message automatically */}
</FormItem>
```

## Submit Guard

Only call the API when the form is valid. react-hook-form + zodResolver blocks `handleSubmit` from firing if any field is invalid:

```tsx
const onSubmit = async (values: NewOrderSingleFormValues) => {
  // values is fully typed and validated here — safe to send to API
}

<form onSubmit={form.handleSubmit(onSubmit)}>
```

## Testing Boundary Values

| Field      | Valid edge         | Invalid edge                  |
|------------|--------------------|-------------------------------|
| quantity   | 1, 99 999          | 0, 100 000, 1.5, -1, NaN      |
| price      | 0.01, 999.99       | 0, 1000, 0.001, -0.01, NaN    |
| symbol     | "PETR4"            | "BBAS3", "", undefined        |
| side       | "B", "S"           | "Compra", "buy", "", undefined |
