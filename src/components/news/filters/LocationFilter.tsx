import { MapPin } from 'lucide-react';
import { ComboboxFilter } from '@/components/shared/ComboboxFilter';

interface LocationFilterProps {
  value?: string;
  onChange: (value: string) => void;
}

export function LocationFilter({ value, onChange }: LocationFilterProps) {
  return (
    <ComboboxFilter
      value={value}
      onChange={onChange}
      label="Локація"
      placeholder="Вибрано"
      searchPlaceholder="Пошук локації..."
      emptyMessage="Локацій не знайдено."
      allLabel="Всі локації"
      icon={MapPin}
      queryKey="locations"
      searchEndpoint="/news/locations"
      labelKey="address"
    />
  );
}
