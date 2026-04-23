import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, CalendarDays, Info } from 'lucide-react';

interface SourceDateFormatsFieldProps {
  formats?: string[] | null;
  onChange: (formats: string[]) => void;
}

export function SourceDateFormatsField({ formats, onChange }: SourceDateFormatsFieldProps) {
  // Гарантуємо, що завжди працюємо з масивом
  const safeFormats = Array.isArray(formats) ? formats : [];

  const addFormat = () => onChange([...safeFormats, '']);
  
  const removeFormat = (index: number) => {
    const newFormats = [...safeFormats];
    newFormats.splice(index, 1);
    onChange(newFormats);
  };

  const updateFormat = (index: number, value: string) => {
    const newFormats = [...safeFormats];
    newFormats[index] = value;
    onChange(newFormats);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <CalendarDays className="h-3.5 w-3.5 text-primary" /> Варіанти форматів дати
        </label>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={addFormat}
          className="h-7 gap-1.5 font-bold uppercase text-[9px] tracking-widest px-2"
        >
          <Plus className="h-3 w-3" /> Додати формат
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {safeFormats.length === 0 ? (
          <p className="text-[10px] text-muted-foreground italic bg-muted/20 p-3 rounded-lg border border-dashed text-center">
            Використовуються стандартні формати системи
          </p>
        ) : (
          safeFormats.map((format, index) => (
            <div key={index} className="flex gap-2 items-center group">
              <span className="text-[9px] font-black text-muted-foreground w-4">{index + 1}.</span>
              <Input
                placeholder="Наприклад: DD.MM.YYYY HH:mm"
                value={format || ''}
                onChange={(e) => updateFormat(index, e.target.value)}
                className="h-9 font-mono text-[11px] flex-1 bg-background shadow-sm border-muted-foreground/10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeFormat(index)}
                className="h-9 w-9 text-destructive hover:bg-destructive/5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))
        )}
      </div>

      <div className="rounded-xl bg-muted/40 p-4 border border-muted-foreground/5 space-y-3">
        <div className="flex items-center gap-2 text-foreground font-bold text-[10px] uppercase tracking-widest">
          <Info className="h-3.5 w-3.5 text-primary" /> Доступні токени:
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-[10px]">
          <div className="flex flex-col gap-0.5">
            <span className="font-mono text-primary font-bold">YYYY / YY</span>
            <span className="text-muted-foreground">Рік (2026 / 26)</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-mono text-primary font-bold">MMMM / MMM</span>
            <span className="text-muted-foreground">Місяць (січня / січ)</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-mono text-primary font-bold">MM / M</span>
            <span className="text-muted-foreground">Місяць (04 / 4)</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-mono text-primary font-bold">DD / D</span>
            <span className="text-muted-foreground">День (23 / 3)</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-mono text-primary font-bold">HH / mm / ss</span>
            <span className="text-muted-foreground">Год / хв / сек</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-mono text-primary font-bold">rfc3339 / unix</span>
            <span className="text-muted-foreground">Стандартні формати</span>
          </div>
        </div>
      </div>
    </div>
  );
}
