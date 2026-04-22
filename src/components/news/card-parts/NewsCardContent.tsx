import { FileText } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface NewsCardContentProps {
  description: string;
}

export function NewsCardContent({ description }: NewsCardContentProps) {
  return (
    <div className="p-4 pt-0 flex-1 flex flex-col">
      {description ? (
        <Tooltip>
          <TooltipTrigger 
            render={
              <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed cursor-default">
                {description}
              </p>
            } 
          />
          <TooltipContent className="max-w-[400px] text-sm leading-normal">
            {description}
          </TooltipContent>
        </Tooltip>
      ) : (
        <div className="flex-1 flex items-center justify-center py-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <FileText className="h-12 w-12" />
        </div>
      )}
    </div>
  );
}
