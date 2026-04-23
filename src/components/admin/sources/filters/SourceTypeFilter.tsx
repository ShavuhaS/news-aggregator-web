import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ParserSourceType } from '@/types/parser';

interface SourceTypeFilterProps {
  value: ParserSourceType[];
  onChange: (value: ParserSourceType[]) => void;
}

const TYPES: ParserSourceType[] = ['RSS', 'JSON', 'HTML'];

export function SourceTypeFilter({ value, onChange }: SourceTypeFilterProps) {
  return (
    <div className="space-y-2.5">
      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">
        Типи джерел
      </label>
      <ToggleGroup
        multiple
        value={value}
        onValueChange={(val: string[]) => onChange(val as ParserSourceType[])}
        className="justify-start gap-1 bg-muted/50 p-1 rounded-xl w-fit border border-muted"
      >
        {TYPES.map((type) => (
          <ToggleGroupItem 
            key={type} 
            value={type} 
            className="h-8 px-4 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all data-[state=on]:bg-primary/90 data-[state=on]:text-primary-foreground data-[state=on]:shadow-md data-[state=on]:shadow-primary/30"
          >
            {type}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
