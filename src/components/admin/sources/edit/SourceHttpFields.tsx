import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Globe } from 'lucide-react';

interface SourceHttpFieldsProps {
  headers?: Record<string, string> | null;
  onChange: (headers: Record<string, string>) => void;
}

export function SourceHttpFields({ headers, onChange }: SourceHttpFieldsProps) {
  const safeHeaders = headers || {};
  const headerList = Object.entries(safeHeaders);

  const addHeader = () => {
    // Ініціалізуємо новими порожніми рядками, а не undefined
    onChange({ ...safeHeaders, '': '' });
  };

  const removeHeader = (key: string) => {
    const newHeaders = { ...safeHeaders };
    delete newHeaders[key];
    onChange(newHeaders);
  };

  const updateHeader = (oldKey: string, newKey: string, value: string) => {
    const newHeaders = { ...safeHeaders };
    if (oldKey !== newKey) {
      delete newHeaders[oldKey];
    }
    newHeaders[newKey] = value || ''; // Гарантуємо порожній рядок замість undefined
    onChange(newHeaders);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold flex items-center gap-2">
          <Globe className="h-4 w-4 text-primary" />
          HTTP Заголовки
        </label>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={addHeader}
          className="h-8 gap-2 font-bold uppercase text-[10px] tracking-widest"
        >
          <Plus className="h-3 w-3" />
          Додати
        </Button>
      </div>

      <div className="space-y-3">
        {headerList.length === 0 ? (
          <p className="text-xs text-muted-foreground italic text-center py-4 border border-dashed rounded-xl">
            Заголовки не налаштовані
          </p>
        ) : (
          headerList.map(([key, value], index) => (
            <div key={index} className="flex gap-2 items-start">
              <Input
                placeholder="Ключ"
                value={key}
                onChange={(e) => updateHeader(key, e.target.value, value)}
                className="flex-1 font-mono text-xs"
              />
              <Input
                placeholder="Значення"
                value={value || ''} // Гарантуємо порожній рядок
                onChange={(e) => updateHeader(key, key, e.target.value)}
                className="flex-1 font-mono text-xs"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeHeader(key)}
                className="h-10 w-10 text-destructive hover:bg-destructive/5 shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
