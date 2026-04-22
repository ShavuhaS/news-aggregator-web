import { AuthStatus } from '@/components/AuthStatus';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold tracking-tight">News Aggregator</h1>
          <nav className="hidden md:flex items-center gap-4 text-sm font-medium">
            <a href="/" className="transition-colors hover:text-foreground/80 text-foreground">Новини</a>
            <a href="/for-you" className="transition-colors hover:text-foreground/80 text-foreground/60">Для вас</a>
          </nav>
        </div>
        <AuthStatus />
      </div>
    </header>
  );
}
