import { useState } from 'react';
import { NewsArticle } from '@/types/news';
import { Card } from '@/components/ui/card';
import { getSentimentDetails } from '@/lib/sentiment';
import { NewsCardImage } from './card-parts/NewsCardImage';
import { NewsCardHeader } from './card-parts/NewsCardHeader';
import { NewsCardContent } from './card-parts/NewsCardContent';
import { NewsCardFooter } from './card-parts/NewsCardFooter';
import { ComplaintDialog } from './ComplaintDialog';

interface NewsCardProps {
  article: NewsArticle;
}

export function NewsCard({ article }: NewsCardProps) {
  const { color } = getSentimentDetails(article.sentimentScore);
  const [isComplaintDialogOpen, setIsComplaintDialogOpen] = useState(false);

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
          />

          <NewsCardContent 
            description={article.description} 
          />

          <NewsCardFooter 
            sentimentScore={article.sentimentScore} 
            link={article.link} 
            onComplaintClick={() => setIsComplaintDialogOpen(true)}
          />
        </div>
      </Card>

      <ComplaintDialog
        newsId={article.id}
        newsTitle={article.title}
        open={isComplaintDialogOpen}
        onOpenChange={setIsComplaintDialogOpen}
      />
    </>
  );
}
