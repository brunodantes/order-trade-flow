import type { OrderFormErrors, OrderFormState } from '@/lib/types/order'

export function validateOrderForm(values: OrderFormState): OrderFormErrors {
  const errors: OrderFormErrors = {}

  if (!values.symbol) {
    errors.symbol = 'Selecione um ativo.'
  }

  if (!values.side) {
    errors.side = 'Selecione um lado.'
  }

  const qty = Number(values.quantity)
  if (!values.quantity) {
    errors.quantity = 'Informe a quantidade.'
  } else if (isNaN(qty) || !Number.isInteger(qty) || qty <= 0) {
    errors.quantity = 'A quantidade deve ser um número inteiro positivo.'
  } else if (qty >= 100_000) {
    errors.quantity = 'A quantidade deve ser menor que 100.000.'
  }

  const price = Number(values.price)
  if (!values.price) {
    errors.price = 'Informe o preço.'
  } else if (isNaN(price) || price <= 0) {
    errors.price = 'O preço deve ser maior que zero.'
  } else if (price >= 1000) {
    errors.price = 'O preço deve ser menor que R$ 1.000,00.'
  } else if (Math.abs(price * 100 - Math.round(price * 100)) > 1e-9) {
    errors.price = 'O preço deve ser múltiplo de R$ 0,01.'
  }

  return errors
}

export function hasErrors(errors: OrderFormErrors): boolean {
  return Object.keys(errors).length > 0
}
