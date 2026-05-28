import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface PriceInputProps {
  value: string
  onChange: (value: string) => void
  error?: string
}

export function PriceInput({ value, onChange, error }: PriceInputProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor="price">Preço (R$)</Label>
      <Input
        id="price"
        type="number"
        min={0.01}
        max={999.99}
        step={0.01}
        placeholder="Ex: 28.50"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
