import { PageSizeSelector } from './pagination/PageSizeSelector';
import { PageInput } from './pagination/PageInput';

interface PaginationProps {
  page: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function Pagination({
  page,
  pageSize,
  totalPages,
  totalCount,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  if (totalCount === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-muted/50 mt-6">
      <PageSizeSelector 
        pageSize={pageSize} 
        totalCount={totalCount} 
        onPageSizeChange={onPageSizeChange} 
      />

      <PageInput 
        page={page} 
        totalPages={totalPages} 
        onPageChange={onPageChange} 
      />
    </div>
  );
}
