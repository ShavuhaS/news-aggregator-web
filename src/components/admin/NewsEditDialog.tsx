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
import { NewsArticleDetails } from '@/types/news';
import { CategoryFilter } from '@/components/news/filters/CategoryFilter';
import { EntitySelector } from '@/components/shared/EntitySelector';
import { NewsComplaintsAdmin } from './NewsComplaintsAdmin';

interface NewsEditDialogProps {
  newsId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewsEditDialog({ newsId, open, onOpenChange }: NewsEditDialogProps) {
  const queryClient = useQueryClient();

  const { data: article, isLoading, refetch: refetchDetails } = useQuery({
    queryKey: ['news-details', newsId],
    queryFn: () => apiFetch<NewsArticleDetails>(`/news/${newsId}`),
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

  if (isLoading || !article) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="flex items-center justify-center h-60">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto border-muted shadow-2xl p-0 gap-0">
        <div className="p-6 pb-0">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Settings className="h-6 w-6 text-primary" />
              Керування новиною
            </DialogTitle>
            <DialogDescription className="line-clamp-1 font-medium text-foreground pt-1 italic">
              {article.title}
            </DialogDescription>
          </DialogHeader>
        </div>

        <Tabs defaultValue="content" className="w-full mt-6">
          <TabsList className="flex h-12 w-full bg-muted/30 p-1 rounded-none border-y border-muted">
            <TabsTrigger value="content" className="flex-1 gap-2 font-bold uppercase text-xs tracking-widest cursor-pointer transition-all data-[state=active]:bg-background">
              <Tag className="h-3.5 w-3.5 text-primary" /> Категорія
            </TabsTrigger>
            <TabsTrigger value="locations" className="flex-1 gap-2 font-bold uppercase text-xs tracking-widest cursor-pointer transition-all data-[state=active]:bg-background border-x border-muted/50">
              <MapPin className="h-3.5 w-3.5 text-primary" /> Локації
            </TabsTrigger>
            <TabsTrigger value="complaints" className="flex-1 gap-2 font-bold uppercase text-xs tracking-widest cursor-pointer transition-all data-[state=active]:bg-background">
              <AlertTriangle className="h-3.5 w-3.5 text-destructive" /> Скарги
            </TabsTrigger>
          </TabsList>

          <div className="p-6">
            <TabsContent value="content" className="mt-0 space-y-6 animate-in fade-in slide-in-from-bottom-2 outline-none">
              <div className="bg-muted/10 p-8 rounded-3xl border border-dashed border-muted-foreground/20">
                <CategoryFilter 
                  value={article.categoryId} 
                  onChange={(id) => id && updateCategoryMutation.mutate(id)} 
                />
              </div>
            </TabsContent>

            <TabsContent value="locations" className="mt-0 animate-in fade-in slide-in-from-bottom-2 outline-none">
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
            </TabsContent>

            <TabsContent value="complaints" className="mt-0 animate-in fade-in slide-in-from-bottom-2 outline-none">
              <NewsComplaintsAdmin 
                newsId={newsId} 
                onNewsDeleted={() => onOpenChange(false)} 
              />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
