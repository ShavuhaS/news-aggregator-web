import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Tag, MapPin, AlertTriangle, Settings } from 'lucide-react';
import { NewsArticleDetails, Complaint } from '@/types/news';
import { CategoryFilter } from '@/components/news/filters/CategoryFilter';
import { EntitySelector } from '@/components/shared/EntitySelector';
import { NewsComplaintsAdmin } from './NewsComplaintsAdmin';
import { Badge } from '@/components/ui/badge';
import { PaginatedResponse } from '@/types/api';
import { FormDialog } from '@/components/shared/FormDialog';

interface NewsEditDialogProps {
  newsId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewsEditDialog({ newsId, open, onOpenChange }: NewsEditDialogProps) {
  const queryClient = useQueryClient();

  const { data: article, isLoading: isArticleLoading, refetch: refetchDetails } = useQuery({
    queryKey: ['news-details', newsId],
    queryFn: () => apiFetch<NewsArticleDetails>(`/news/${newsId}`),
    enabled: open,
  });

  const { data: complaintsData, refetch: refetchComplaints } = useQuery({
    queryKey: ['news-complaints-admin-list', newsId],
    queryFn: () => apiFetch<PaginatedResponse<Complaint>>(`/news/${newsId}/complaints?page=1&pageSize=50`),
    enabled: open,
  });

  const updateCategoryMutation = useMutation({
    mutationFn: (categoryId: string) => 
      apiFetch(`/news/${newsId}/category`, { method: 'PUT', body: JSON.stringify({ categoryId }) }),
    onSuccess: () => {
      toast.success('Категорію оновлено');
      refetchDetails();
      queryClient.invalidateQueries({ queryKey: ['news'] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const complaintsCount = complaintsData?.totalCount || 0;

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      icon={Settings}
      title="Керування новиною"
      description={article?.title}
      isPending={false} 
      isDirty={false}   
      onSubmit={() => onOpenChange(false)}
      submitLabel="Закрити"
      cancelLabel="Скасувати"
      maxWidth="sm:max-w-4xl"
    >
      {isArticleLoading ? (
        <div className="flex-1 flex items-center justify-center p-20">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary opacity-50" />
            <p className="text-muted-foreground font-medium animate-pulse">Отримання даних...</p>
          </div>
        </div>
      ) : (
        <Tabs defaultValue="content" className="flex-1 flex flex-col overflow-hidden">
          <div className="px-8 border-b border-muted bg-muted/5">
            <TabsList className="h-14 w-full justify-start gap-8 bg-transparent p-0">
              <TabsTrigger value="content" className="relative h-14 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 font-bold uppercase text-[11px] tracking-[0.1em] gap-2.5 cursor-pointer transition-all">
                <Tag className="h-4 w-4 text-muted-foreground group-data-[state=active]:text-primary" /> Категорія
              </TabsTrigger>
              <TabsTrigger value="locations" className="relative h-14 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 font-bold uppercase text-[11px] tracking-[0.1em] gap-2.5 cursor-pointer transition-all">
                <MapPin className="h-4 w-4 text-muted-foreground group-data-[state=active]:text-primary" /> Локації
              </TabsTrigger>
              <TabsTrigger value="complaints" className="relative h-14 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 font-bold uppercase text-[11px] tracking-[0.1em] gap-2.5 cursor-pointer transition-all">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-muted-foreground group-data-[state=active]:text-destructive" /> 
                  Скарги
                  {complaintsCount > 0 && (
                    <Badge variant="destructive" className="h-5 px-1.5 py-0 min-w-5 justify-center font-black text-[9px] rounded-full border-2 border-background">
                      {complaintsCount}
                    </Badge>
                  )}
                </div>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-muted">
            <TabsContent value="content" className="m-0 space-y-8 outline-none animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-muted/10 p-10 rounded-[2.5rem] border border-dashed border-muted-foreground/20 flex flex-col items-center">
                <div className="w-full max-w-sm">
                  {article && (
                    <CategoryFilter 
                      value={article.categoryId} 
                      onChange={(id) => id && updateCategoryMutation.mutate(id)} 
                    />
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="locations" className="m-0 outline-none animate-in fade-in slide-in-from-bottom-2 duration-300">
              {article && (
                <EntitySelector
                  title="Географічна прив'язка"
                  description="Управління місцями, з якими пов'язана дана новина"
                  icon={<MapPin className="h-5 w-5 text-primary" />}
                  searchPlaceholder="Пошук нових локацій..."
                  searchEndpoint="/news/locations"
                  addEndpoint={() => `/news/${newsId}/locations`}
                  removeEndpoint={(locId) => `/news/${newsId}/locations/${locId}`}
                  preferredItems={article.locations.map(l => ({ id: l.id, label: l.address }))}
                  queryKey="news-locations-admin"
                  labelKey="address"
                  onUpdate={refetchDetails}
                  asCard={false}
                  useBodyForAdd={true}
                />
              )}
            </TabsContent>

            <TabsContent value="complaints" className="m-0 outline-none animate-in fade-in slide-in-from-bottom-2 duration-300">
              <NewsComplaintsAdmin 
                newsId={newsId} 
                onNewsDeleted={() => onOpenChange(false)} 
                onUpdate={refetchComplaints}
              />
            </TabsContent>
          </div>
        </Tabs>
      )}
    </FormDialog>
  );
}
