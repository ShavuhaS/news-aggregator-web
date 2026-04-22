import { useAuthStore } from '@/store/useAuthStore';
import { EntitySelector } from '@/components/shared/EntitySelector';
import { MapPin } from 'lucide-react';

export function LocationPreferences() {
  const { user, fetchProfile } = useAuthStore();

  if (!user) return null;

  return (
    <EntitySelector
      title="Відстежувані локації"
      description="Новини з цих місць будуть у вашій стрічці"
      icon={<MapPin className="h-5 w-5 text-primary" />}
      searchPlaceholder="Пошук міст або адрес..."
      searchEndpoint="/news/locations"
      addEndpoint={(id) => `/user/profile/locations/${id}`}
      removeEndpoint={(id) => `/user/profile/locations/${id}`}
      queryKey="locations"
      labelKey="address"
      preferredItems={user.preferredLocations?.map(l => ({ id: l.id, label: l.address })) || []}
      onUpdate={fetchProfile}
    />
  );
}
