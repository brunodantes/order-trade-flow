---
name: nextjs-api-client
description: 'Use when implementing or debugging the HTTP communication between the Next.js frontend and the backend in the order-trade-flow project. Triggers: fetch API call, POST NewOrderSingle, API route, Server Action, error handling, response display, loading state, CORS, environment variables for backend URL, type-safe request/response, OrderResult component.'
---

# Next.js API Client — NewOrderSingle

## When to Use
- Sending a new order from the frontend form to the backend
- Handling success and error responses from the backend
- Configuring the backend base URL via environment variables
- Displaying the API response in `<OrderResult>`
- Adding loading/disabled states to the submit button

## Architecture Decision

Use a **client component with `fetch`** (not a Server Action) because the form is fully interactive and the response must be displayed inline without a page reload.

```
[NewOrderSingleForm]  → POST /api/orders  →  [Next.js Route Handler]  →  [Backend]
                      ←  { orderId, ... } ←
```

The Next.js route handler proxies the request, keeping backend URL and any auth tokens server-side.

## Environment Variables

In `order-generator/.env.local`:

```bash
BACKEND_URL=http://localhost:5000   # Never expose with NEXT_PUBLIC_ prefix
```

> `NEXT_PUBLIC_` variables are bundled into the browser. Backend URL and credentials must NEVER use this prefix.

## Route Handler — `app/api/orders/route.ts`

```ts
import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL

export async function POST(req: NextRequest) {
  if (!BACKEND_URL) {
    return NextResponse.json(
      { error: 'Backend URL não configurado.' },
      { status: 500 }
    )
  }

  const body = await req.json()

  try {
    const upstream = await fetch(`${BACKEND_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const data = await upstream.json()

    return NextResponse.json(data, { status: upstream.status })
  } catch (err) {
    console.error('[POST /api/orders]', err)
    return NextResponse.json(
      { error: 'Falha ao conectar com o backend.' },
      { status: 502 }
    )
  }
}
```

## Client-side Fetch — Inside `NewOrderSingleForm`

```ts
// lib/api/orders.ts
import type { NewOrderSingleFormValues } from '@/lib/schemas/order'

export type OrderApiResponse =
  | { success: true;  data: unknown }
  | { success: false; error: string; status: number }

export async function submitOrder(
  values: NewOrderSingleFormValues
): Promise<OrderApiResponse> {
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  })

  const data = await res.json()

  if (!res.ok) {
    return {
      success: false,
      error: data?.error ?? `Erro ${res.status}`,
      status: res.status,
    }
  }

  return { success: true, data }
}
```

## Form Submit Handler

In `NewOrderSingleForm.tsx`:

```tsx
const [result, setResult] = useState<OrderApiResponse | null>(null)
const [isSubmitting, setIsSubmitting] = useState(false)

const onSubmit = async (values: NewOrderSingleFormValues) => {
  setIsSubmitting(true)
  setResult(null)
  try {
    const response = await submitOrder(values)
    setResult(response)
  } finally {
    setIsSubmitting(false)
  }
}
```

## Submit Button with Loading State

```tsx
<Button type="submit" disabled={isSubmitting} className="w-full">
  {isSubmitting ? 'Enviando...' : 'Enviar Ordem'}
</Button>
```

## OrderResult Component

File: `app/components/orders/OrderResult.tsx`

```tsx
import type { OrderApiResponse } from '@/lib/api/orders'

interface OrderResultProps {
  result: OrderApiResponse | null
}

export function OrderResult({ result }: OrderResultProps) {
  if (!result) return null

  if (!result.success) {
    return (
      <div className="rounded-md bg-red-50 border border-red-200 p-4 mt-4">
        <p className="text-sm font-medium text-red-800">Erro ao enviar ordem</p>
        <p className="text-sm text-red-700 mt-1">{result.error}</p>
      </div>
    )
  }

  return (
    <div className="rounded-md bg-green-50 border border-green-200 p-4 mt-4">
      <p className="text-sm font-medium text-green-800">Ordem enviada com sucesso</p>
      <pre className="text-xs text-green-700 mt-2 overflow-auto">
        {JSON.stringify(result.data, null, 2)}
      </pre>
    </div>
  )
}
```

## Rules & Pitfalls

| Rule | Reason |
|------|--------|
| Always proxy via Next.js route handler | Keeps backend URL server-side; avoids CORS issues |
| Never use `NEXT_PUBLIC_BACKEND_URL` | Would expose backend to browser |
| Always check `res.ok` before reading `.json()` | Non-2xx responses still return JSON with error details |
| Reset `result` to `null` on each submit | Prevents stale success/error UI persisting |
| Disable button while `isSubmitting` | Prevents duplicate submission |
| Catch network errors with try/catch | `fetch` throws on network failure, not on HTTP errors |
