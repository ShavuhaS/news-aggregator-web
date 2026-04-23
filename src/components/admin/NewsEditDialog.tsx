import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Tag, MapPin, AlertTriangle, Settings } from 'lucide-react';
import { NewsArticleDetails, Complaint } from '@/types/news';
import { CategoryFilter } from '@/components/news/filters/CategoryFilter';
import { EntitySelector } from '@/components/shared/EntitySelector';
import { NewsComplaintsAdmin } from './NewsComplaintsAdmin';
import { Badge } from '@/components/ui/badge';
import { PaginatedResponse } from '@/types/api';

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

  if (isArticleLoading && open) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="flex items-center justify-center h-60">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </DialogContent>
      </Dialog>
    );
  }

  const complaintsCount = complaintsData?.totalCount || 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto border-muted shadow-2xl p-0 gap-0">
        <div className="p-6 pb-0">
          <DialogHeader>
            <div className="flex justify-between items-start pr-10">
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <Settings className="h-6 w-6 text-primary" />
                Керування новиною
              </DialogTitle>
              {complaintsCount > 0 && (
                <Badge variant="destructive" className="h-6 px-2 gap-1.5 rounded-full animate-pulse border-2 border-background shadow-md">
                  <AlertTriangle className="h-3 w-3" />
                  <span className="text-[10px] font-black">{complaintsCount}</span>
                </Badge>
              )}
            </div>
            <DialogDescription className="line-clamp-1 font-medium text-foreground pt-1 italic">
              {article?.title}
            </DialogDescription>
          </DialogHeader>
        </div>

        <Tabs defaultValue="content" className="w-full mt-6">
          <TabsList className="flex h-12 w-full bg-muted/30 p-1 rounded-none border-y border-muted">
            <TabsTrigger value="content" className="flex-1 gap-2 font-bold uppercase text-[10px] tracking-widest cursor-pointer transition-all data-[state=active]:bg-background">
              <Tag className="h-3.5 w-3.5 text-primary" /> Категорія
            </TabsTrigger>
            <TabsTrigger value="locations" className="flex-1 gap-2 font-bold uppercase text-[10px] tracking-widest cursor-pointer transition-all data-[state=active]:bg-background border-x border-muted/50">
              <MapPin className="h-3.5 w-3.5 text-primary" /> Локації
            </TabsTrigger>
            <TabsTrigger value="complaints" className="flex-1 gap-2 font-bold uppercase text-[10px] tracking-widest cursor-pointer transition-all data-[state=active]:bg-background relative">
              <AlertTriangle className="h-3.5 w-3.5 text-destructive" /> Скарги
              {complaintsCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 bg-destructive text-destructive-foreground text-[9px] font-black rounded-full leading-none">
                  {complaintsCount}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <div className="p-6">
            <TabsContent value="content" className="mt-0 space-y-6 animate-in fade-in slide-in-from-bottom-2 outline-none">
              <div className="bg-muted/10 p-8 rounded-3xl border border-dashed border-muted-foreground/20">
                {article && (
                  <CategoryFilter 
                    value={article.categoryId} 
                    onChange={(id) => id && updateCategoryMutation.mutate(id)} 
                  />
                )}
              </div>
            </TabsContent>

            <TabsContent value="locations" className="mt-0 animate-in fade-in slide-in-from-bottom-2 outline-none">
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

            <TabsContent value="complaints" className="mt-0 animate-in fade-in slide-in-from-bottom-2 outline-none">
              <NewsComplaintsAdmin 
                newsId={newsId} 
                onNewsDeleted={() => onOpenChange(false)} 
                onUpdate={refetchComplaints}
              />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
