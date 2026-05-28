import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SIDES } from '@/lib/types/order'

interface SideSelectProps {
  value: string
  onChange: (value: string) => void
  error?: string
}

export function SideSelect({ value, onChange, error }: SideSelectProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor="side">Lado</Label>
      <Select value={value} onValueChange={(v) => v !== null && onChange(v)}>
        <SelectTrigger id="side" aria-invalid={!!error}>
          <SelectValue placeholder="Selecione o lado" />
        </SelectTrigger>
        <SelectContent>
          {SIDES.map((s) => (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
