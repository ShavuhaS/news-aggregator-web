import { Input } from '@/components/ui/input';
import { HTMLMapping } from '@/types/parser';
import { SourceDateFormatsField } from './SourceDateFormatsField';

interface HTMLMappingFieldsProps {
  value: HTMLMapping;
  onChange: (value: HTMLMapping) => void;
}

export function HTMLMappingFields({ value, onChange }: HTMLMappingFieldsProps) {
  const handleChange = (field: keyof HTMLMapping, val: any) => {
    onChange({ ...value, [field]: val });
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <div className="col-span-full space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Елемент новини (Selector)</label>
          <Input 
            value={value.itemsSelector || ''} 
            onChange={(e) => handleChange('itemsSelector', e.target.value)}
            placeholder=".news-item"
            className="font-mono text-xs h-10"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Заголовок (Selector)</label>
          <Input 
            value={value.titleSelector || ''} 
            onChange={(e) => handleChange('titleSelector', e.target.value)}
            placeholder="h2"
            className="font-mono text-xs h-10"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Атрибут заголовка</label>
          <Input 
            value={value.titleAttr || ''} 
            onChange={(e) => handleChange('titleAttr', e.target.value)}
            placeholder="innerText"
            className="font-mono text-xs h-10"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Посилання (Selector)</label>
          <Input 
            value={value.linkSelector || ''} 
            onChange={(e) => handleChange('linkSelector', e.target.value)}
            placeholder="a"
            className="font-mono text-xs h-10"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Атрибут посилання</label>
          <Input 
            value={value.linkAttr || ''} 
            onChange={(e) => handleChange('linkAttr', e.target.value)}
            placeholder="href"
            className="font-mono text-xs h-10"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Зображення (Selector)</label>
          <Input 
            value={value.imageUrlSelector || ''} 
            onChange={(e) => handleChange('imageUrlSelector', e.target.value)}
            placeholder="img"
            className="font-mono text-xs h-10"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Атрибут зображення</label>
          <Input 
            value={value.imageUrlAttr || ''} 
            onChange={(e) => handleChange('imageUrlAttr', e.target.value)}
            placeholder="src"
            className="font-mono text-xs h-10"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Дата публікації (Selector)</label>
          <Input 
            value={value.publishedAtSelector || ''} 
            onChange={(e) => handleChange('publishedAtSelector', e.target.value)}
            placeholder=".date"
            className="font-mono text-xs h-10"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Атрибут дати</label>
          <Input 
            value={value.publishedAtAttr || ''} 
            onChange={(e) => handleChange('publishedAtAttr', e.target.value)}
            placeholder="datetime"
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
