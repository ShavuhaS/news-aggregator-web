import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DateRangeFilterProps {
  from?: string;
  to?: string;
  onChange: (from?: string, to?: string) => void;
}

export function DateRangeFilter({ from, to, onChange }: DateRangeFilterProps) {
  const dateFrom = from ? new Date(from) : undefined;
  const dateTo = to ? new Date(to) : undefined;

  return (
    <div className="space-y-3">
      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
        <CalendarIcon className="h-4 w-4 text-primary" /> Період
      </label>
      <Popover>
        <PopoverTrigger 
          render={
            <Button
              variant="outline"
              className={cn(
                'w-full justify-start text-left font-medium h-10',
                !from && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
              {dateFrom ? (
                dateTo ? (
                  <>
                    {format(dateFrom, 'dd.MM.yy')} - {format(dateTo, 'dd.MM.yy')}
                  </>
                ) : (
                  format(dateFrom, 'dd.MM.yy')
                )
              ) : (
                <span>Оберіть період</span>
              )}
            </Button>
          }
        />
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateFrom}
            selected={{
              from: dateFrom,
              to: dateTo,
            }}
            onSelect={(range) => {
              onChange(
                range?.from?.toISOString(),
                range?.to?.toISOString()
              );
            }}
            locale={uk}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
