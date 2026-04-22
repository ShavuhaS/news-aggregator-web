import { Slider } from '@/components/ui/slider';
import { getSentimentDetails } from '@/lib/sentiment';

interface SentimentFilterProps {
  minSentiment: number;
  maxSentiment: number;
  onChange: (min: number, max: number) => void;
}

export function SentimentFilter({ minSentiment, maxSentiment, onChange }: SentimentFilterProps) {
  const minDetails = getSentimentDetails(minSentiment);
  const maxDetails = getSentimentDetails(maxSentiment);
  const MinIcon = minDetails.icon;
  const MaxIcon = maxDetails.icon;

  return (
    <div className="space-y-4">
      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex justify-between">
        <span>Діапазон настрою</span>
        <span className="text-primary tabular-nums font-black">
          {minSentiment.toFixed(1)} : {maxSentiment.toFixed(1)}
        </span>
      </label>
      <Slider
        min={-1}
        max={1}
        step={0.1}
        value={[minSentiment, maxSentiment]}
        onValueChange={(val) => {
          const [min, max] = val as number[];
          onChange(min, max);
        }}
        className="py-4"
      />
      <div className="flex justify-between items-center px-1">
        <div className="flex flex-col items-center gap-1">
          <MinIcon className="h-5 w-5 transition-colors" style={{ color: minDetails.color }} />
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Мін</span>
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-muted to-transparent mx-4" />
        <div className="flex flex-col items-center gap-1">
          <MaxIcon className="h-5 w-5 transition-colors" style={{ color: maxDetails.color }} />
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Макс</span>
        </div>
      </div>
    </div>
  );
}
