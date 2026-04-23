import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquareWarning, AlertCircle } from 'lucide-react';
import { FormDialog } from '@/components/shared/FormDialog';
import { RequireAuthDialog } from '@/components/shared/RequireAuthDialog';

interface ComplaintDialogProps {
  newsId: string;
  newsTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ComplaintDialog({ newsId, newsTitle, open, onOpenChange }: ComplaintDialogProps) {
  const { isAuthenticated } = useAuthStore();
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

  const handleSubmit = () => {
    const trimmedReason = reason.trim();
    if (trimmedReason.length < 10) return;
    mutation.mutate(trimmedReason);
  };

  if (!isAuthenticated && open) {
    return (
      <RequireAuthDialog 
        open={open} 
        onOpenChange={onOpenChange} 
        description="Тільки зареєстровані користувачі можуть подавати скарги на новини."
      />
    );
  }

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      icon={MessageSquareWarning}
      title="Поскаржитись на новину"
      description={`"${newsTitle}"`}
      isPending={mutation.isPending}
      isDirty={reason.trim().length > 0}
      isValid={reason.trim().length >= 10}
      onSubmit={handleSubmit}
      submitLabel="Надіслати скаргу"
      maxWidth="sm:max-w-lg"
    >
      <div className="p-8 space-y-6 flex-1 flex flex-col">
        <div className="space-y-4 flex-1 flex flex-col">
          <div className="flex justify-between items-center px-1">
            <label 
              htmlFor="reason" 
              className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground"
            >
              Опишіть проблему:
            </label>
            <span className={`text-[9px] font-black transition-colors ${reason.length < 10 ? 'text-destructive' : 'text-emerald-500'}`}>
              {reason.length} / 10+ символів
            </span>
          </div>
          <Textarea
            id="reason"
            placeholder="Чому ця новина здається вам підозрілою або некоректною? Наприклад: фейк, ненормативна лексика, помилка локації..."
            className="flex-1 min-h-[160px] resize-none focus-visible:ring-primary/20 border-muted bg-muted/10 p-6 text-base leading-relaxed rounded-3xl shadow-inner border-2 border-transparent focus-visible:border-muted-foreground/20 transition-all"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={mutation.isPending}
          />
        </div>
        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <p className="text-[11px] text-foreground/80 leading-relaxed font-medium">
            Ваша скарга буде анонімно розглянута модератором. Дякуємо, що допомагаєте зробити сервіс кращим.
          </p>
        </div>
      </div>
    </FormDialog>
  );
}
