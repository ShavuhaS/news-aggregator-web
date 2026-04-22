import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';

export function AuthStatus() {
  const { user, isLoading, isAuthenticated, logout } = useAuthStore();

  if (isLoading) {
    return <span className="text-sm text-muted-foreground">Завантаження...</span>;
  }

  if (!isAuthenticated) {
    return (
      <div className="flex gap-2">
        <Button variant="outline" size="sm">Реєстрація</Button>
        <Button size="sm">Увійти</Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-end">
        <span className="text-sm font-medium">{user?.username}</span>
        <span className="text-xs text-muted-foreground uppercase">{user?.role}</span>
      </div>
      <Button variant="ghost" size="sm" onClick={logout}>
        Вийти
      </Button>
    </div>
  );
}
