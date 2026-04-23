import { Link, useLocation } from 'react-router-dom';
import { AuthStatus } from '@/components/AuthStatus';
import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { label: 'Для вас', href: '/for-you', protected: true },
  { label: 'Пошук', href: '/' },
  { label: 'Адмін', href: '/admin', protected: true, roles: ['ADMIN'] },
];

export function Header() {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-90">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">N</span>
            </div>
            <span className="text-xl font-bold tracking-tight hidden sm:inline-block">
              News Aggregator
            </span>
          </Link>
          
          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              if (
                item.protected &&
                (!user
                  ||
                (item.roles && !item.roles.includes(user.role))
              )) return null;
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "px-4 py-2 text-sm font-medium transition-colors rounded-md hover:bg-accent hover:text-accent-foreground",
                    location.pathname === item.href 
                      ? "text-foreground bg-accent" 
                      : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <AuthStatus />
        </div>
      </div>
    </header>
  );
}
