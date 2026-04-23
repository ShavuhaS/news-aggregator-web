import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Power, PowerOff } from 'lucide-react';

interface SourceStatusFilterProps {
  value?: boolean;
  onChange: (value: boolean | undefined) => void;
}

export function SourceStatusFilter({ value, onChange }: SourceStatusFilterProps) {
  const selectedValue = value === undefined ? 'all' : value ? 'active' : 'inactive';

  return (
    <div className="space-y-2.5">
      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">
        Статус
      </label>
      <ToggleGroup
        value={[selectedValue]}
        onValueChange={(val) => {
          const firstVal = val[0];
          if (!firstVal || firstVal === 'all') onChange(undefined);
          else onChange(firstVal === 'active');
        }}
        className="justify-start gap-1 bg-muted/50 p-1 rounded-xl w-fit border border-muted"
      >
        <ToggleGroupItem 
          value="all" 
          className="h-8 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all data-[state=on]:bg-foreground data-[state=on]:text-background data-[state=on]:shadow-sm"
        >
          Всі
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="active" 
          className="h-8 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all gap-1.5 text-emerald-600 data-[state=on]:bg-emerald-700 data-[state=on]:text-white data-[state=on]:shadow-md data-[state=on]:shadow-emerald-900/20"
        >
          <Power className="h-3 w-3" />
          On
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="inactive" 
          className="h-8 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all gap-1.5 text-amber-600 data-[state=on]:bg-amber-700 data-[state=on]:text-white data-[state=on]:shadow-md data-[state=on]:shadow-amber-900/20"
        >
          <PowerOff className="h-3 w-3" />
          Off
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
