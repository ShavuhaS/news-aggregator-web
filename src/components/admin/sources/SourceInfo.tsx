import { Globe, ExternalLink } from 'lucide-react';

interface SourceInfoProps {
  name: string;
  url: string;
  logoUrl: string | null;
}

export function SourceInfo({ name, url, logoUrl }: SourceInfoProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-xl border border-muted bg-background flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
        {logoUrl ? (
          <img src={logoUrl} alt={name} className="h-full w-full object-contain p-1" />
        ) : (
          <Globe className="h-5 w-5 text-muted-foreground/30" />
        )}
      </div>
      <div className="flex flex-col gap-0.5 min-w-0">
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="font-bold text-foreground hover:text-primary transition-colors flex items-center gap-1.5"
        >
          <span className="truncate">{name}</span>
          <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity shrink-0" />
        </a>
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[9px] text-muted-foreground font-mono truncate max-w-[200px] hover:underline"
        >
          {url}
        </a>
      </div>
    </div>
  );
}
