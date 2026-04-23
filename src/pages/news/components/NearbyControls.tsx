import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Loader2, RotateCcw } from 'lucide-react';
import { DEFAULT_NEARBY_DISTANCE } from '@/constants/news';

interface NearbyControlsProps {
  search: string;
  onSearchChange: (value: string) => void;
  isFetching: boolean;
  dist: number;
  onDistChange: (value: number) => void;
  lat: number;
  lon: number;
  onReset: () => void;
}

export function NearbyControls({
  search,
  onSearchChange,
  isFetching,
  dist,
  onDistChange,
  lat,
  lon,
  onReset,
}: NearbyControlsProps) {
  const hasChanges = search !== '' || dist !== DEFAULT_NEARBY_DISTANCE;

  return (
    <div className="space-y-6 bg-muted/30 p-6 rounded-3xl border border-muted/50 h-fit relative z-10">
      <div className="flex items-center justify-between">
        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          Налаштування пошуку
        </label>
        {hasChanges && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onReset}
            className="h-7 px-2 text-[10px] font-black uppercase tracking-wider text-muted-foreground hover:text-primary gap-1.5"
          >
            <RotateCcw className="h-3 w-3" />
            Скинути
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2 px-1">
          <Search className="h-3.5 w-3.5 text-primary" /> Пошук у радіусі
        </label>
        <div className="relative">
          <Input 
            placeholder="Ключові слова..." 
            className="bg-background h-11 pr-10 rounded-xl"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {isFetching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />}
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center px-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-primary" /> Дистанція
          </label>
          <span className="text-primary font-black tabular-nums bg-primary/10 px-2 py-1 rounded-lg text-sm border border-primary/20">
            {dist} км
          </span>
        </div>
        
        <div className="px-1 py-2">
          <Slider
            min={1}
            max={200}
            step={1}
            value={dist}
            onValueChange={(val) => onDistChange(val as number)}
            className="cursor-pointer"
          />
        </div>

        <div className="flex justify-between text-[9px] font-black text-muted-foreground uppercase tracking-widest px-1">
          <span>1 км</span>
          <span>100 км</span>
          <span>200 км</span>
        </div>
      </div>

      <div className="pt-4 border-t border-muted">
         <div className="text-[10px] text-muted-foreground space-y-1 bg-background/50 p-3 rounded-2xl border border-muted/50">
            <p className="font-bold uppercase tracking-[0.1em] opacity-40 mb-1">Центр пошуку:</p>
            <p className="font-mono text-[9px] truncate selection:bg-primary/20">{lat.toFixed(6)}, {lon.toFixed(6)}</p>
         </div>
         <p className="text-[9px] text-muted-foreground mt-4 leading-relaxed italic opacity-70 px-1 text-center">
           Клікніть по карті, щоб змінити координати.
         </p>
      </div>
    </div>
  );
}
