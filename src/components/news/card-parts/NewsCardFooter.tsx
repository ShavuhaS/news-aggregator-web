import { ExternalLink, MessageSquareWarning, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { getSentimentDetails } from '@/lib/sentiment';
import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/lib/utils';

interface NewsCardFooterProps {
  sentimentScore: number | null;
  link: string;
  onComplaintClick: () => void;
  variant?: 'default' | 'compact';
}

export function NewsCardFooter({ sentimentScore, link, onComplaintClick, variant = 'default' }: NewsCardFooterProps) {
  const { user } = useAuthStore();
  const { color, icon: EmotionIcon, label } = getSentimentDetails(sentimentScore);
  const percentage = Math.round(Math.abs(sentimentScore ?? 0) * 100);
  const isAdmin = user?.role === 'ADMIN';
  const isCompact = variant === 'compact';

  return (
    <div className={cn(
      "px-4 pb-4 pt-3 flex items-center justify-between gap-2 border-t bg-muted/5 mt-auto",
      isCompact && "px-3 pb-3 pt-2.5 flex-wrap"
    )}>
      <Tooltip>
        <TooltipTrigger 
          render={
            <div className={cn(
              "flex items-center gap-2 bg-background/80 px-2.5 py-1.5 rounded-full border border-muted/50 shadow-sm cursor-help hover:bg-background transition-colors text-foreground shrink-0",
              isCompact && "gap-1.5 px-2 py-1"
            )}>
              <EmotionIcon className={cn("h-4 w-4 transition-colors", isCompact && "h-3.5 w-3.5")} style={{ color }} />
              <span className={cn("text-xs font-black tabular-nums", isCompact && "text-[10px]")} style={{ color }}>
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

      <div className="flex items-center gap-1 ml-auto">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer",
            isCompact && "h-8 w-8"
          )}
          onClick={onComplaintClick}
          title={isAdmin ? "Редагувати новину" : "Поскаржитись на новину"}
        >
          {isAdmin ? (
            <Settings className={cn("h-4 w-4", isCompact && "h-3.5 w-3.5")} />
          ) : (
            <MessageSquareWarning className={cn("h-4 w-4", isCompact && "h-3.5 w-3.5")} />
          )}
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className={cn(
            "h-9 px-4 gap-2 text-xs font-bold shadow-sm shrink-0",
            isCompact && "h-8 px-3 gap-1.5 text-[10px]"
          )} 
          asChild
        >
          <a href={link} target="_blank" rel="noopener noreferrer">
            <span className={cn(isCompact && "hidden xs:inline")}>Читати</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </Button>
      </div>
    </div>
  );
}
