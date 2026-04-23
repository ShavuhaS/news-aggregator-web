import { RotateCcw } from 'lucide-react';
import { EmptyState } from '@/components/shared/EmptyState';

interface NewsEmptyStateProps {
  onReset: () => void;
}

export function NewsEmptyState({ onReset }: NewsEmptyStateProps) {
  return (
    <EmptyState
      title="Нічого не знайдено"
      description="Спробуйте змінити параметри пошуку або скинути фільтри, щоб побачити більше новин"
      action={{
        label: "Очистити все",
        icon: RotateCcw,
        onClick: onReset
      }}
    />
  );
}
