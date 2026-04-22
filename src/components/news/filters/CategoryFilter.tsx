import { Tag } from 'lucide-react';
import { ComboboxFilter } from '@/components/shared/ComboboxFilter';

interface CategoryFilterProps {
  value?: string;
  onChange: (value: string) => void;
}

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  return (
    <ComboboxFilter
      value={value}
      onChange={onChange}
      label="Категорія"
      placeholder="Вибрано"
      searchPlaceholder="Пошук категорії..."
      emptyMessage="Категорій не знайдено."
      allLabel="Всі категорії"
      icon={Tag}
      queryKey="categories"
      searchEndpoint="/news/categories"
      labelKey="name"
    />
  );
}
