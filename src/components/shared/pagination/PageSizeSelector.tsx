import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const PAGE_SIZE_OPTIONS = [12, 24, 48, 96];

interface PageSizeSelectorProps {
  pageSize: number;
  totalCount: number;
  onPageSizeChange: (pageSize: number) => void;
}

export function PageSizeSelector({ pageSize, totalCount, onPageSizeChange }: PageSizeSelectorProps) {
  return (
    <div className="flex items-center gap-2 text-muted-foreground text-xs font-bold uppercase tracking-widest">
      <span>Показати</span>
      <Select
        value={pageSize.toString()}
        onValueChange={(v) => onPageSizeChange(Number(v))}
      >
        <SelectTrigger className="h-8 w-[75px] bg-background cursor-pointer">
          <SelectValue placeholder={pageSize.toString()} />
        </SelectTrigger>
        <SelectContent>
          {PAGE_SIZE_OPTIONS.map((size) => (
            <SelectItem key={size} value={size.toString()}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span>із {totalCount}</span>
    </div>
  );
}
