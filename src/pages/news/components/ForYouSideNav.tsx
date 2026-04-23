import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight, LucideIcon } from 'lucide-react';

export interface SideNavItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface ForYouSideNavProps {
  items: SideNavItem[];
}

export function ForYouSideNav({ items }: ForYouSideNavProps) {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24 space-y-6">
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-2">Навігація</p>
          <nav className="flex flex-col gap-1">
            {items.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="group flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all hover:bg-accent hover:text-accent-foreground text-muted-foreground border border-transparent hover:border-muted"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <item.icon className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />
                <span className="truncate flex-1">{item.label}</span>
                <ChevronRight className="h-3 w-3 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
              </a>
            ))}
          </nav>
        </div>
        
        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 space-y-3">
          <p className="text-[10px] font-bold uppercase text-primary/70">Підказка</p>
          <p className="text-xs text-muted-foreground leading-relaxed">Клікніть на розділ для швидкого переходу. Налаштування доступні в профілі.</p>
          <Button variant="link" asChild className="h-auto p-0 text-[10px] uppercase font-black tracking-widest">
             <Link to="/profile/preferences">Редагувати вподобання</Link>
          </Button>
        </div>
      </div>
    </aside>
  );
}
