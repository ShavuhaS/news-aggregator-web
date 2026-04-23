import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, MessageSquareWarning, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ComplaintDialogProps {
  newsId: string;
  newsTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ComplaintDialog({ newsId, newsTitle, open, onOpenChange }: ComplaintDialogProps) {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [reason, setReason] = useState('');

  const mutation = useMutation({
    mutationFn: (reason: string) =>
      apiFetch(`/news/${newsId}/complaints`, {
        method: 'POST',
        body: JSON.stringify({ reason }),
      }),
    onSuccess: () => {
      toast.success('Вашу скаргу прийнято. Дякуємо за допомогу!');
      setReason('');
      onOpenChange(false);
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Не вдалося надіслати скаргу');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedReason = reason.trim();
    
    if (!trimmedReason) {
      toast.error('Будь ласка, вкажіть причину скарги');
      return;
    }
    
    if (trimmedReason.length < 10) {
      toast.error('Причина скарги має бути не менше 10 символів');
      return;
    }

    mutation.mutate(trimmedReason);
  };

  if (!isAuthenticated && open) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Потрібна авторизація
            </DialogTitle>
            <DialogDescription>
              Тільки зареєстровані користувачі можуть подавати скарги на новини.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4 items-center">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="sm:flex-1 hover:bg-accent transition-colors cursor-pointer">
              Скасувати
            </Button>
            <Button onClick={() => navigate('/login')} className="sm:flex-1 hover:opacity-90 transition-opacity cursor-pointer">
              Увійти
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg border-muted shadow-2xl">
        <DialogHeader className="space-y-1">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <MessageSquareWarning className="h-5 w-5 text-destructive" />
            Поскаржитись на новину
          </DialogTitle>
          <DialogDescription className="text-sm font-medium text-foreground">
            "{newsTitle}"
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div className="space-y-6">
            <div className="flex justify-between items-center px-1.5">
              <label 
                htmlFor="reason" 
                className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground"
              >
                Опишіть проблему:
              </label>
              <span className={`text-[9px] font-black ${reason.length < 10 ? 'text-destructive' : 'text-emerald-500'}`}>
                {reason.length} / 10+
              </span>
            </div>
            <Textarea
              id="reason"
              placeholder="Чому ця новина здається вам підозрілою або некоректною? (мінімум 10 символів)"
              className="min-h-[140px] resize-none focus-visible:ring-destructive/20 border-muted bg-muted/10 p-4 text-sm leading-relaxed"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={mutation.isPending}
            />
          </div>
          <p className="text-[10px] text-muted-foreground italic pl-1.5 opacity-70">
            Ваша скарга буде розглянута модератором протягом 24 годин.
          </p>

          <DialogFooter className="pt-4 items-center">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => onOpenChange(false)}
              disabled={mutation.isPending}
              className="font-bold uppercase text-[10px] tracking-widest hover:bg-muted/50 hover:text-foreground transition-all cursor-pointer"
            >
              Скасувати
            </Button>
            <Button 
              type="submit" 
              variant="destructive" 
              disabled={mutation.isPending || reason.trim().length < 10}
              className="font-black uppercase text-[10px] tracking-widest px-8 h-10 shadow-lg shadow-destructive/10 hover:shadow-destructive/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 disabled:grayscale disabled:scale-100"
            >
              {mutation.isPending ? (
                <Loader2 className="h-3 w-3 animate-spin mr-2" />
              ) : null}
              Надіслати скаргу
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
