import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { uk } from 'date-fns/locale';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface NewsCardHeaderProps {
  title: string;
  categoryName?: string;
  publishedAt: string | null;
  link: string;
}

export function NewsCardHeader({ title, categoryName, publishedAt, link }: NewsCardHeaderProps) {
  return (
    <div className="p-4 pb-2 space-y-2">
      <div className="flex justify-between items-start gap-2">
        <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider h-5 px-2">
          {categoryName || 'Без категорії'}
        </Badge>
        <span className="text-[10px] text-muted-foreground font-semibold whitespace-nowrap">
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
              <h3 className="font-bold leading-tight text-lg line-clamp-3">{title}</h3>
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
