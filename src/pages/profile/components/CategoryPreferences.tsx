import { useAuthStore } from '@/store/useAuthStore';
import { EntitySelector } from '@/components/shared/EntitySelector';
import { Tag } from 'lucide-react';

export function CategoryPreferences() {
  const { user, fetchProfile } = useAuthStore();

  if (!user) return null;

  return (
    <EntitySelector
      title="Відстежувані категорії"
      description="Оберіть теми, які вас цікавлять найбільше"
      icon={<Tag className="h-5 w-5 text-primary" />}
      searchPlaceholder="Пошук тем (напр. Політика, Спорт...)"
      searchEndpoint="/news/categories"
      addEndpoint={(id) => `/user/profile/categories/${id}`}
      removeEndpoint={(id) => `/user/profile/categories/${id}`}
      queryKey="categories"
      labelKey="name"
      preferredItems={user.preferredCategories?.map(c => ({ id: c.id, label: c.name })) || []}
      onUpdate={fetchProfile}
    />
  );
}
