import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { uk } from 'date-fns/locale';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface NewsCardHeaderProps {
  title: string;
  categoryName?: string;
  publishedAt: string | null;
  link: string;
  variant?: 'default' | 'compact';
}

export function NewsCardHeader({ title, categoryName, publishedAt, link, variant = 'default' }: NewsCardHeaderProps) {
  const isCompact = variant === 'compact';

  return (
    <div className={cn("p-4 pb-2 space-y-2", isCompact && "p-3 pb-1.5")}>
      <div className="flex flex-wrap items-center justify-between gap-y-1 gap-x-2">
        <Badge 
          variant="outline" 
          className={cn(
            "font-bold uppercase tracking-wider h-5 px-2 shrink-0",
            isCompact && "text-[9px] h-4 px-1.5"
          )}
        >
          {categoryName || 'Без категорії'}
        </Badge>
        <span className={cn(
          "text-[10px] text-muted-foreground font-semibold whitespace-nowrap",
          isCompact && "text-[9px]"
        )}>
          {publishedAt
            ? formatDistanceToNow(new Date(publishedAt), { addSuffix: true, locale: uk })
            : 'Щойно'}
        </span>
      </div>

      <Tooltip>
        <TooltipTrigger 
          render={
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:text-primary transition-colors"
            >
              <h3 className={cn(
                "font-bold leading-tight text-lg line-clamp-3",
                isCompact && "text-base"
              )}>
                {title}
              </h3>
            </a>
          }
        />
        <TooltipContent className="max-w-[300px] text-xs font-medium">
          {title}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
