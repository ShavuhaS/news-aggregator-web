import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';

export function AuthStatus() {
  const { user, isLoading, isAuthenticated, logout } = useAuthStore();

  if (isLoading) {
    return <span className="text-sm text-muted-foreground animate-pulse">Завантаження...</span>;
  }

  if (!isAuthenticated) {
    return (
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/register">Реєстрація</Link>
        </Button>
        <Button size="sm" asChild>
          <Link to="/login">Увійти</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Link to="/profile" className="flex flex-col items-end group">
        <span className="text-sm font-semibold group-hover:text-primary transition-colors">
          {user?.username}
        </span>
        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
          {user?.role}
        </span>
      </Link>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => logout()}
        className="h-8 px-3"
      >
        Вийти
      </Button>
    </div>
  );
}
