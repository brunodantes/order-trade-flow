import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface QuantityInputProps {
  value: string
  onChange: (value: string) => void
  error?: string
}

export function QuantityInput({ value, onChange, error }: QuantityInputProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor="quantity">Quantidade</Label>
      <Input
        id="quantity"
        type="number"
        min={1}
        max={99999}
        step={1}
        placeholder="Ex: 100"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
