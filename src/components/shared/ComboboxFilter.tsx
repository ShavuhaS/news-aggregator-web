import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { Check, ChevronsUpDown, LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { PaginatedResponse } from '@/types/api';
import { cn } from '@/lib/utils';

interface ComboboxFilterProps {
  value?: string;
  onChange: (value: string) => void;
  label: string;
  placeholder: string;
  searchPlaceholder: string;
  emptyMessage: string;
  allLabel: string;
  icon: LucideIcon;
  queryKey: string;
  searchEndpoint: string;
  labelKey: string;
}

export function ComboboxFilter({
  value,
  onChange,
  label,
  placeholder,
  searchPlaceholder,
  emptyMessage,
  allLabel,
  icon: Icon,
  queryKey,
  searchEndpoint,
  labelKey,
}: ComboboxFilterProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const { data } = useQuery({
    queryKey: [queryKey, search],
    queryFn: () => apiFetch<PaginatedResponse<any>>(`${searchEndpoint}?search=${search}&pageSize=50`),
  });

  const items = data?.data || [];
  const selectedItem = items.find((item) => item.id === value);

  return (
    <div className="space-y-2.5">
      <label className="h-5 text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 shrink-0">
        <Icon className="h-4 w-4 text-primary" /> {label}
      </label>
      <div className="h-10 w-full relative">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger 
            render={
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between h-full font-medium overflow-hidden border-muted-foreground/20 hover:border-primary/50 transition-colors"
              >
                <span className="truncate text-left">
                  {value ? selectedItem?.[labelKey] || placeholder : allLabel}
                </span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            }
          />
          <PopoverContent className="w-[250px] p-0 shadow-xl border-muted" align="start">
            <Command shouldFilter={false}>
              <CommandInput 
                placeholder={searchPlaceholder} 
                value={search}
                onValueChange={setSearch}
                className="h-11"
              />
              <CommandList className="max-h-[300px]">
                <CommandEmpty>{emptyMessage}</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    value="all"
                    onSelect={() => {
                      onChange('');
                      setOpen(false);
                    }}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        !value ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {allLabel}
                  </CommandItem>
                  {items.map((item) => (
                    <CommandItem
                      key={item.id}
                      value={item.id}
                      onSelect={() => {
                        onChange(item.id);
                        setOpen(false);
                      }}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          value === item.id ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      <span className="truncate">{item[labelKey]}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
