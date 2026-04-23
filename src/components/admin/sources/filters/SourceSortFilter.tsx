import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { SortAsc, SortDesc, ListOrdered } from 'lucide-react';
import { ParserSourceSortField, ParserSortDir } from '@/types/parser';

interface SourceSortFilterProps {
  sortBy?: ParserSourceSortField;
  sortDir?: ParserSortDir;
  onChange: (field: ParserSourceSortField, dir: ParserSortDir) => void;
}

const SORT_FIELDS: { value: ParserSourceSortField; label: string }[] = [
  { value: ParserSourceSortField.NAME, label: 'За назвою' },
  { value: ParserSourceSortField.TYPE, label: 'За типом' },
  { value: ParserSourceSortField.LAST_PARSED_AT, label: 'За датою парсингу' },
  { value: ParserSourceSortField.CREATED_AT, label: 'За датою додавання' },
  { value: ParserSourceSortField.ACTIVE, label: 'За статусом' },
];

export function SourceSortFilter({ sortBy, sortDir, onChange }: SourceSortFilterProps) {
  const currentLabel = SORT_FIELDS.find(f => f.value === sortBy)?.label;

  return (
    <div className="space-y-2.5">
      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 px-1">
        <ListOrdered className="h-3.5 w-3.5 text-primary" /> Сортування
      </label>
      <div className="flex gap-2">
        <Select 
          value={sortBy} 
          onValueChange={(val) => onChange(val as ParserSourceSortField, sortDir || ParserSortDir.DESC)}
        >
          <SelectTrigger className="h-10 rounded-xl bg-background border-muted-foreground/20 focus:ring-primary/20 flex-1">
            <SelectValue>
              {currentLabel || "Оберіть поле"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="rounded-xl border-muted shadow-xl">
            {SORT_FIELDS.map((field) => (
              <SelectItem key={field.value} value={field.value} className="text-xs font-medium cursor-pointer">
                {field.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <ToggleGroup
          value={sortDir ? [sortDir] : []}
          onValueChange={(val) => {
            if (val.length > 0) {
              onChange(sortBy || ParserSourceSortField.CREATED_AT, val[0] as ParserSortDir);
            }
          }}
          className="bg-muted/50 p-1 rounded-xl border border-muted h-10 shrink-0"
        >
          <ToggleGroupItem 
            value={ParserSortDir.ASC} 
            className="h-8 w-8 p-0 rounded-lg data-[state=on]:bg-primary/90 data-[state=on]:text-primary-foreground data-[state=on]:shadow-sm transition-all"
          >
            <SortAsc className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem 
            value={ParserSortDir.DESC} 
            className="h-8 w-8 p-0 rounded-lg data-[state=on]:bg-primary/90 data-[state=on]:text-primary-foreground data-[state=on]:shadow-sm transition-all"
          >
            <SortDesc className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
}
