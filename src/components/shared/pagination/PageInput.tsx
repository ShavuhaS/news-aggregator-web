import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PageInputProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function PageInput({ page, totalPages, onPageChange }: PageInputProps) {
  const [inputPage, setInputPage] = useState(page.toString());

  useEffect(() => {
    setInputPage(page.toString());
  }, [page]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setInputPage(value);
    }
  };

  const handleInputBlur = () => {
    const newPage = parseInt(inputPage);
    if (!isNaN(newPage) && newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    } else {
      setInputPage(page.toString());
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleInputBlur();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        className="font-bold uppercase text-[10px] tracking-widest h-9 px-4 cursor-pointer"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
      >
        Попередня
      </Button>

      <div className="flex items-center gap-2 mx-2">
        <Input
          className="h-8 w-12 text-center text-xs font-black p-0 bg-primary/5 border-primary/20 focus-visible:ring-primary/30"
          value={inputPage}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
        />
        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
          із {totalPages || 1}
        </span>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="font-bold uppercase text-[10px] tracking-widest h-9 px-4 cursor-pointer"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
      >
        Наступна
      </Button>
    </div>
  );
}
