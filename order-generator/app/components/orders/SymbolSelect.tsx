import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SYMBOLS } from '@/lib/types/order'

interface SymbolSelectProps {
  value: string
  onChange: (value: string) => void
  error?: string
}

export function SymbolSelect({ value, onChange, error }: SymbolSelectProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor="symbol">Símbolo</Label>
      <Select value={value} onValueChange={(v) => v !== null && onChange(v)}>
        <SelectTrigger id="symbol" aria-invalid={!!error}>
          <SelectValue placeholder="Selecione o ativo" />
        </SelectTrigger>
        <SelectContent>
          {SYMBOLS.map((s) => (
            <SelectItem key={s} value={s}>
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
