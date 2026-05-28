export const SYMBOLS = ['PETR4', 'VALE3', 'VIIA4'] as const
export type OrderSymbol = (typeof SYMBOLS)[number]

export const SIDES = [
  { value: 'B', label: 'Compra' },
  { value: 'S', label: 'Venda' },
] as const
export type OrderSide = 'B' | 'S'

export interface NewOrderSingleValues {
  symbol: OrderSymbol
  side: OrderSide
  quantity: number
  price: number
}

/** Raw string state kept by the form before parsing */
export interface OrderFormState {
  symbol: string
  side: string
  quantity: string
  price: string
}

export type OrderFormErrors = Partial<Record<keyof OrderFormState, string>>
