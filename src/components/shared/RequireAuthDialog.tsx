import { useNavigate } from 'react-router-dom';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle, LogIn } from 'lucide-react';

interface RequireAuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
}

export function RequireAuthDialog({
  open,
  onOpenChange,
  title = "Потрібна авторизація",
  description = "Тільки зареєстровані користувачі можуть виконувати цю дію."
}: RequireAuthDialogProps) {
  const navigate = useNavigate();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl p-8 border-muted shadow-2xl">
        <div className="flex flex-col items-center text-center gap-6">
          <div className="p-4 rounded-full bg-amber-500/10 text-amber-600 shadow-sm border border-amber-500/5">
            <AlertCircle className="h-10 w-10" />
          </div>
          <div className="space-y-2">
            <DialogTitle className="text-2xl font-bold tracking-tight">{title}</DialogTitle>
            <DialogDescription className="text-muted-foreground font-medium text-base">
              {description}
            </DialogDescription>
          </div>
          <div className="flex w-full gap-3 mt-4">
            <Button 
              variant="ghost" 
              onClick={() => onOpenChange(false)} 
              className="flex-1 h-12 rounded-xl font-bold uppercase text-[11px] tracking-widest cursor-pointer transition-colors"
            >
              Скасувати
            </Button>
            <Button 
              onClick={() => navigate('/login')} 
              className="flex-1 h-12 rounded-xl font-black uppercase text-[11px] tracking-widest gap-2 shadow-lg shadow-primary/20 cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
            >
              <LogIn className="h-4 w-4" />
              Увійти
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
