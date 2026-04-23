import { Input } from '@/components/ui/input';
import { Clock, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SourceScheduleFieldsProps {
  value: string;
  onChange: (value: string) => void;
}

const PRESETS = [
  { label: 'Кожні 15 хв', value: '*/15 * * * *' },
  { label: 'Щогодини', value: '0 * * * *' },
  { label: 'Кожні 3 год', value: '0 */3 * * *' },
  { label: 'Щодня о 00:00', value: '0 0 * * *' },
];

export function SourceScheduleFields({ value, onChange }: SourceScheduleFieldsProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-bold flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          Cron вираз
        </label>
        <div className="flex gap-2">
          <Input 
            value={value} 
            onChange={(e) => onChange(e.target.value)}
            placeholder="* * * * *"
            className="font-mono text-base tracking-widest"
          />
        </div>
        <p className="text-xs text-foreground/80 font-medium flex items-start gap-1.5 px-1 leading-relaxed">
          <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-primary" />
          Формат: хвилина (0-59) година (0-23) день_місяця (1-31) місяць (1-12) день_тижня (0-6)
        </p>
      </div>

      <div className="space-y-3">
        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          Швидкі пресети
        </label>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <Badge
              key={preset.value}
              variant={value === preset.value ? 'default' : 'outline'}
              className="cursor-pointer px-3 py-1.5 transition-all hover:border-primary/50"
              onClick={() => onChange(preset.value)}
            >
              {preset.label}
            </Badge>
          ))}
        </div>
      </div>

      {value && (
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
          <p className="text-xs font-medium text-foreground leading-relaxed">
            Парсинг буде запускатися відповідно до заданого розкладу. 
            Переконайтеся, що вираз відповідає вашим потребам, щоб не перевантажувати джерело.
          </p>
        </div>
      )}
    </div>
  );
}
