'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { SideSelect } from './SideSelect'
import { SymbolSelect } from './SymbolSelect'
import { QuantityInput } from './QuantityInput'
import { PriceInput } from './PriceInput'
import type { OrderFormErrors, OrderFormState } from '@/lib/types/order'
import { hasErrors, validateOrderForm } from '@/lib/validation/order'

const EMPTY_STATE: OrderFormState = {
  symbol: '',
  side: '',
  quantity: '',
  price: '',
}

export function NewOrderSingleForm() {
  const [values, setValues] = useState<OrderFormState>(EMPTY_STATE)
  const [errors, setErrors] = useState<OrderFormErrors>({})
  const [result, setResult] = useState<unknown>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(field: keyof OrderFormState) {
    return (value: string) => {
      setValues((prev) => ({ ...prev, [field]: value }))
      // clear the error for the field as the user edits it
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const validationErrors = validateOrderForm(values)
    if (hasErrors(validationErrors)) {
      setErrors(validationErrors)
      return
    }
    setIsSubmitting(true)
    setResult(null)
    try {
      // Placeholder: API integration will be added in the next step
      const payload = {
        symbol: values.symbol,
        side: values.side,
        quantity: Number(values.quantity),
        price: Number(values.price),
      }
      setResult({ status: 'ok', payload })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Nova Ordem</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <SymbolSelect
            value={values.symbol}
            onChange={handleChange('symbol')}
            error={errors.symbol}
          />
          <SideSelect
            value={values.side}
            onChange={handleChange('side')}
            error={errors.side}
          />
          <QuantityInput
            value={values.quantity}
            onChange={handleChange('quantity')}
            error={errors.quantity}
          />
          <PriceInput
            value={values.price}
            onChange={handleChange('price')}
            error={errors.price}
          />
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Enviando...' : 'Enviar Ordem'}
          </Button>
        </form>

        {result !== null && (
          <div className="mt-6 rounded-md border p-4 bg-muted">
            <p className="text-sm font-medium mb-2">Resposta:</p>
            <pre className="text-xs overflow-auto whitespace-pre-wrap break-all">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
