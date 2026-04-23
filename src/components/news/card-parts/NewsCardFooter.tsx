import { ExternalLink, MessageSquareWarning } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { getSentimentDetails } from '@/lib/sentiment';

interface NewsCardFooterProps {
  sentimentScore: number | null;
  link: string;
  onComplaintClick: () => void;
}

export function NewsCardFooter({ sentimentScore, link, onComplaintClick }: NewsCardFooterProps) {
  const { color, icon: EmotionIcon, label } = getSentimentDetails(sentimentScore);
  const percentage = Math.round(Math.abs(sentimentScore ?? 0) * 100);

  return (
    <div className="px-4 pb-4 pt-3 flex justify-between items-center gap-2 border-t bg-muted/5 mt-auto">
      <Tooltip>
        <TooltipTrigger 
          render={
            <div className="flex items-center gap-2 bg-background/80 px-2.5 py-1.5 rounded-full border border-muted/50 shadow-sm cursor-help hover:bg-background transition-colors text-foreground">
              <EmotionIcon className="h-4 w-4 transition-colors" style={{ color }} />
              <span className="text-xs font-black tabular-nums" style={{ color }}>
                {percentage}%
              </span>
            </div>
          }
        />
        <TooltipContent>
          <p className="text-xs font-bold">
            {label}: {(sentimentScore ?? 0).toFixed(2)}
          </p>
        </TooltipContent>
      </Tooltip>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
          onClick={onComplaintClick}
          title="Поскаржитись на новину"
        >
          <MessageSquareWarning className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" className="h-9 px-4 gap-2 text-xs font-bold shadow-sm" asChild>
          <a href={link} target="_blank" rel="noopener noreferrer">
            Читати
            <ExternalLink className="h-3 w-3" />
          </a>
        </Button>
      </div>
    </div>
  );
}
