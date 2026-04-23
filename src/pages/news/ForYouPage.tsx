import { useAuthStore } from '@/store/useAuthStore';
import { NewsSection } from '@/components/news/NewsSection';
import { Tag, MapPin, Navigation, Settings, LayoutGrid, Map } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ForYouSideNav, type SideNavItem } from './components/ForYouSideNav';
import { NewsSectionGroup } from './components/NewsSectionGroup';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { DEFAULT_NEARBY_DISTANCE, KYIV_COORDS } from '@/constants/news';

export function ForYouPage() {
  const { user } = useAuthStore();
  const [coords, setCoords] = useState(KYIV_COORDS);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        () => console.warn("Geolocation denied, using fallback (Kyiv)")
      );
    }
  }, []);

  if (!user) return null;

  const hasPreferences = user.preferredCategories.length > 0 || user.preferredLocations.length > 0;

  const sideNavItems: SideNavItem[] = [
    { id: 'nearby', label: 'Локальні', icon: Navigation },
    ...user.preferredCategories.map(c => ({ id: `cat-${c.id}`, label: c.name, icon: Tag })),
    ...user.preferredLocations.map(l => ({ id: `loc-${l.id}`, label: l.address, icon: MapPin })),
  ];

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <div className={cn(
        "grid gap-12",
        hasPreferences ? "grid-cols-1 lg:grid-cols-[1fr_240px]" : "grid-cols-1"
      )}>
        
        <div className="space-y-16">
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight italic text-primary underline decoration-primary/20 underline-offset-8">Для вас</h1>
            <p className="text-muted-foreground text-lg font-medium">Ваша персональна добірка на основі вподобань</p>
          </div>

          <div className="space-y-20">
            <NewsSection 
              id="nearby"
              title="Локальні новини"
              icon={Navigation}
              queryParam="nearby"
              queryValue="true"
              href="/nearby" 
              isNearby={true}
              nearbyParams={{ ...coords, dist: DEFAULT_NEARBY_DISTANCE }}
            />

            {user.preferredCategories.length > 0 && (
              <NewsSectionGroup label="Ваші теми" icon={LayoutGrid}>
                {user.preferredCategories.map((cat) => (
                  <NewsSection 
                    key={cat.id}
                    id={`cat-${cat.id}`}
                    title={cat.name}
                    icon={Tag}
                    queryParam="categoryId"
                    queryValue={cat.id}
                    href={`/search?categoryId=${cat.id}`}
                  />
                ))}
              </NewsSectionGroup>
            )}

            {user.preferredLocations.length > 0 && (
              <NewsSectionGroup label="Ваші місця" icon={Map}>
                {user.preferredLocations.map((loc) => (
                  <NewsSection 
                    key={loc.id}
                    id={`loc-${loc.id}`}
                    title={loc.address}
                    icon={MapPin}
                    queryParam="locationId"
                    queryValue={loc.id}
                    href={`/search?locationId=${loc.id}`}
                  />
                ))}
              </NewsSectionGroup>
            )}
          </div>

          {!hasPreferences && (
            <div className="text-center py-24 border-2 border-dashed rounded-[3rem] bg-muted/5 border-muted/50 transition-all hover:bg-muted/10">
                <div className="bg-background w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border border-muted/20 group">
                  <Settings className="h-10 w-10 text-muted-foreground/30 animate-spin-slow group-hover:text-primary/50 transition-colors" />
                </div>
                <h3 className="text-2xl font-bold mb-2 tracking-tight">Налаштуйте свою стрічку</h3>
                <p className="text-muted-foreground font-medium max-w-sm mx-auto text-lg leading-relaxed">
                  Оберіть цікаві вам теми та міста у профілі, щоб ми могли сформувати для вас ідеальну добірку новин.
                </p>
                <Button asChild className="mt-8 h-12 px-8 font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-primary/20 cursor-pointer">
                  <Link to="/profile/preferences">
                    Налаштувати вподобання
                  </Link>
                </Button>
            </div>
          )}
        </div>

        {hasPreferences && <ForYouSideNav items={sideNavItems} />}
      </div>
    </div>
  );
}
