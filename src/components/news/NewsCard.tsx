import { useState } from 'react';
import { NewsArticle } from '@/types/news';
import { Card } from '@/components/ui/card';
import { getSentimentDetails } from '@/lib/sentiment';
import { useAuthStore } from '@/store/useAuthStore';
import { NewsCardImage } from './card-parts/NewsCardImage';
import { NewsCardHeader } from './card-parts/NewsCardHeader';
import { NewsCardContent } from './card-parts/NewsCardContent';
import { NewsCardFooter } from './card-parts/NewsCardFooter';
import { ComplaintDialog } from './ComplaintDialog';
import { NewsEditDialog } from '@/components/admin/NewsEditDialog';

interface NewsCardProps {
  article: NewsArticle;
  variant?: 'default' | 'compact';
}

export function NewsCard({ article, variant = 'default' }: NewsCardProps) {
  const { user } = useAuthStore();
  const { color } = getSentimentDetails(article.sentimentScore);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const isAdmin = user?.role === 'ADMIN';

  return (
    <>
      <Card className="flex flex-col h-full overflow-hidden hover:shadow-md transition-all group border-muted/60">
        <div 
          className="h-1 w-full transition-colors duration-500" 
          style={{ backgroundColor: color }} 
        />
        
        <div className="flex flex-col h-full">
          <NewsCardImage 
            src={article.imageUrl} 
            title={article.title} 
            link={article.link} 
          />
          
          <NewsCardHeader 
            title={article.title}
            categoryName={article.category?.name}
            publishedAt={article.publishedAt}
            link={article.link}
            variant={variant}
          />

          <NewsCardContent 
            description={article.description} 
          />

          <NewsCardFooter 
            sentimentScore={article.sentimentScore} 
            link={article.link} 
            onComplaintClick={() => setIsActionDialogOpen(true)}
            variant={variant}
          />
        </div>
      </Card>

      {isAdmin ? (
        <NewsEditDialog
          newsId={article.id}
          open={isActionDialogOpen}
          onOpenChange={setIsActionDialogOpen}
        />
      ) : (
        <ComplaintDialog
          newsId={article.id}
          newsTitle={article.title}
          open={isActionDialogOpen}
          onOpenChange={setIsActionDialogOpen}
        />
      )}
    </>
  );
}
