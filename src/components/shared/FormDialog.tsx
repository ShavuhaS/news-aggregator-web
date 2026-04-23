import { ReactNode } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Save, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  icon: LucideIcon;
  children: ReactNode;
  onSubmit: () => void;
  isPending: boolean;
  isDirty: boolean;
  isValid?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  maxWidth?: string;
}

export function FormDialog({
  open,
  onOpenChange,
  title,
  description,
  icon: Icon,
  children,
  onSubmit,
  isPending,
  isDirty,
  isValid = true,
  submitLabel = 'Зберегти зміни',
  cancelLabel = 'Скасувати',
  maxWidth = "sm:max-w-3xl",
}: FormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0 rounded-2xl border-muted", maxWidth)}>
        <DialogHeader className="p-8 pb-6 border-b border-muted bg-muted/20">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary shadow-sm border border-primary/5 shrink-0">
              <Icon className="h-7 w-7" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold tracking-tight">
                {title}
              </DialogTitle>
              {description && (
                <p className="text-sm text-muted-foreground font-medium mt-1">
                  {description}
                </p>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {children}
        </div>

        <DialogFooter className="p-8 border-t border-muted bg-muted/20 shrink-0">
          <div className="flex w-full items-center justify-between gap-6">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => onOpenChange(false)} 
              className="h-12 px-8 rounded-xl font-bold uppercase text-[11px] tracking-[0.1em] cursor-pointer hover:bg-background transition-colors"
            >
              {cancelLabel}
            </Button>
            <div className="flex items-center gap-4">
              {!isValid && isDirty && (
                <span className="text-[10px] text-destructive font-black uppercase tracking-widest animate-bounce">
                  Форма невалідна
                </span>
              )}
              <Button 
                onClick={onSubmit}
                type="submit" 
                disabled={isPending || !isDirty} 
                className="h-12 px-10 rounded-xl font-black uppercase text-[11px] tracking-[0.1em] gap-3 shadow-xl shadow-primary/20 cursor-pointer transition-all hover:scale-[1.02] active:scale-95 disabled:grayscale"
              >
                {isPending ? (
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                ) : (
                  <Save className="h-4.5 w-4.5" />
                )}
                {submitLabel}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
