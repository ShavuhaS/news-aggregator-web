import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

export interface ToggleFilterOption {
  value: string;
  label: string;
  icon?: LucideIcon;
  activeClass?: string; 
}

interface ToggleFilterProps {
  label: string;
  options: ToggleFilterOption[];
  value: string | string[];
  onChange: (value: any) => void;
  multiple?: boolean;
  className?: string;
  icon?: LucideIcon;
}

export function ToggleFilter({
  label,
  options,
  value,
  onChange,
  multiple = false,
  className,
  icon: LabelIcon,
}: ToggleFilterProps) {
  const safeValue = Array.isArray(value) ? value : value ? [value] : [];

  const handleValueChange = (val: string[]) => {
    if (multiple) {
      onChange(val);
    } else {
      onChange(val[0]);
    }
  };

  return (
    <div className={cn("space-y-2.5 min-w-0", className)}>
      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1 flex items-center gap-2 whitespace-nowrap">
        {LabelIcon && <LabelIcon className="h-3 w-3 text-primary" />}
        {label}
      </label>
      <ToggleGroup
        multiple={multiple}
        value={safeValue}
        onValueChange={handleValueChange}
        className="flex flex-wrap justify-start gap-1 bg-muted/50 p-1 rounded-xl w-fit border border-muted max-w-full"
      >
        {options.map((option) => (
          <ToggleGroupItem
            key={option.value}
            value={option.value}
            className={cn(
              "h-8 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all gap-1.5 whitespace-nowrap border border-transparent",
              "data-pressed:text-white data-pressed:shadow-md data-pressed:bg-slate-800/90 dark:data-pressed:bg-slate-100 dark:data-pressed:text-slate-900",
              option.activeClass
            )}
          >
            {option.icon && <option.icon className="h-3 w-3" />}
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
