import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export interface DataTableColumn {
  header: string;
  className?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn[];
  data: T[] | undefined;
  isLoading: boolean;
  renderRow: (item: T) => ReactNode;
  emptyState?: ReactNode;
  skeletonCount?: number;
  skeletonHeight?: string;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  isLoading,
  renderRow,
  emptyState,
  skeletonCount = 5,
  skeletonHeight = "h-12",
  className,
}: DataTableProps<T>) {
  return (
    <Card className={cn("border-muted/60 shadow-sm overflow-hidden", className)}>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse text-left">
            <thead>
              <tr className="bg-muted/30 border-b border-muted/50">
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className={cn(
                      "px-6 py-4 font-black uppercase text-[10px] tracking-widest text-muted-foreground whitespace-nowrap",
                      column.className
                    )}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-muted/40">
              {isLoading ? (
                Array.from({ length: skeletonCount }).map((_, i) => (
                  <tr key={i}>
                    {columns.map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <Skeleton className={cn("w-full rounded-lg", skeletonHeight)} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : !data || data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-24 text-center">
                    {emptyState || (
                      <p className="text-muted-foreground italic font-medium">Даних не знайдено</p>
                    )}
                  </td>
                </tr>
              ) : (
                data.map(renderRow)
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
