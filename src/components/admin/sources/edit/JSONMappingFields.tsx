import { Input } from '@/components/ui/input';
import { JSONMapping } from '@/types/parser';
import { SourceDateFormatsField } from './SourceDateFormatsField';

interface JSONMappingFieldsProps {
  value: JSONMapping;
  onChange: (value: JSONMapping) => void;
}

export function JSONMappingFields({ value, onChange }: JSONMappingFieldsProps) {
  const handleChange = (field: keyof JSONMapping, val: any) => {
    onChange({ ...value, [field]: val });
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <div className="col-span-full space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Шлях до списку (JSON Path)</label>
          <Input 
            value={value.itemsPath || ''} 
            onChange={(e) => handleChange('itemsPath', e.target.value)}
            placeholder="data.articles"
            className="font-mono text-xs h-10"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Заголовок (Path)</label>
          <Input 
            value={value.titlePath || ''} 
            onChange={(e) => handleChange('titlePath', e.target.value)}
            placeholder="title"
            className="font-mono text-xs h-10"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Опис (Path)</label>
          <Input 
            value={value.descriptionPath || ''} 
            onChange={(e) => handleChange('descriptionPath', e.target.value)}
            placeholder="summary"
            className="font-mono text-xs h-10"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Посилання (Path)</label>
          <Input 
            value={value.linkPath || ''} 
            onChange={(e) => handleChange('linkPath', e.target.value)}
            placeholder="url"
            className="font-mono text-xs h-10"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Зображення (Path)</label>
          <Input 
            value={value.imageUrlPath || ''} 
            onChange={(e) => handleChange('imageUrlPath', e.target.value)}
            placeholder="image"
            className="font-mono text-xs h-10"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Дата публікації (Path)</label>
          <Input 
            value={value.publishedAtPath || ''} 
            onChange={(e) => handleChange('publishedAtPath', e.target.value)}
            placeholder="created_at"
            className="font-mono text-xs h-10"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Логотип джерела (Path)</label>
          <Input 
            value={value.logoPath || ''} 
            onChange={(e) => handleChange('logoPath', e.target.value)}
            placeholder="source.logo"
            className="font-mono text-xs h-10"
          />
        </div>
      </div>

      <div className="pt-6 border-t border-muted/50">
        <SourceDateFormatsField 
          formats={value.dateFormat || []} 
          onChange={(formats) => handleChange('dateFormat', formats)} 
        />
      </div>
    </div>
  );
}
