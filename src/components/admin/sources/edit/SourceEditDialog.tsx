import { useState, useEffect } from 'react';
import { useForm, Controller, SubmitHandler, FieldError } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createSourceSchema, CreateSourceValues } from '@/lib/validations/parser';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { 
  Settings2, 
  Globe, 
  Clock, 
  Database, 
  Save, 
  Link2,
  Image as ImageIcon,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { SourceHttpFields } from './SourceHttpFields';
import { SourceScheduleFields } from './SourceScheduleFields';
import { HTMLMappingFields } from './HTMLMappingFields';
import { JSONMappingFields } from './JSONMappingFields';
import { SourceDateFormatsField } from './SourceDateFormatsField';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSourceDetail } from '@/hooks/api/useSources';
import { useSourceMutations } from '@/hooks/api/useSourceMutations';

interface SourceEditDialogProps {
  sourceId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SourceEditDialog({ sourceId, open, onOpenChange }: SourceEditDialogProps) {
  const [activeTab, setActiveTab] = useState('basic');

  const { data: fullSource, isLoading: isSourceLoading } = useSourceDetail(sourceId, open);
  
  const { createSource, updateSource } = useSourceMutations();

  const form = useForm<CreateSourceValues>({
    resolver: zodResolver(createSourceSchema),
    defaultValues: {
      name: '',
      url: '',
      type: 'RSS',
      active: true,
      schedule: '0 * * * *',
      logoUrl: '',
      configuration: {
        http: { headers: {} },
        mapping: undefined
      }
    }
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isDirty, isValid }
  } = form;

  const sourceType = watch('type');

  useEffect(() => {
    if (open) {
      if (fullSource) {
        reset({
          name: fullSource.name,
          url: fullSource.url,
          type: fullSource.type,
          active: fullSource.active,
          schedule: fullSource.schedule || '0 * * * *',
          logoUrl: fullSource.logoUrl || '',
          configuration: fullSource.configuration
        });
      } else if (!sourceId) {
        reset({
          name: '',
          url: '',
          type: 'RSS',
          active: true,
          schedule: '0 * * * *',
          logoUrl: '',
          configuration: {
            http: { headers: {} },
            mapping: undefined
          }
        });
      }
    }
  }, [fullSource, sourceId, reset, open]);

  const onSubmit: SubmitHandler<CreateSourceValues> = (values) => {
    if (sourceId) {
      updateSource.mutate(
        { id: sourceId, values, oldActive: fullSource?.active },
        { onSuccess: () => onOpenChange(false) }
      );
    } else {
      createSource.mutate(values, { onSuccess: () => onOpenChange(false) });
    }
  };

  const onInvalid = (errors: any) => {
    console.error('Validation errors:', errors);
    toast.error('Будь ласка, перевірте правильність заповнення полів');
  };

  const mappingError = errors.configuration?.mapping as FieldError | undefined;
  const isPending = createSource.isPending || updateSource.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0 rounded-2xl border-muted">
        <DialogHeader className="p-8 pb-6 border-b border-muted bg-muted/20">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary shadow-sm border border-primary/5">
              <Database className="h-7 w-7" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold tracking-tight">
                {sourceId ? 'Редагування джерела' : 'Створення джерела'}
              </DialogTitle>
              <p className="text-sm text-muted-foreground font-medium mt-1">
                {isSourceLoading ? 'Завантаження повної конфігурації...' : (
                  fullSource 
                    ? `Повне налаштування параметрів для джерела "${fullSource.name}"` 
                    : 'Створіть нове джерело для автоматичного збору та аналізу новин'
                )}
              </p>
            </div>
          </div>
        </DialogHeader>

        {isSourceLoading ? (
          <div className="flex-1 flex items-center justify-center p-20">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary opacity-50" />
              <p className="text-muted-foreground font-medium animate-pulse">Отримання даних...</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="flex-1 overflow-hidden flex flex-col">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
              <div className="px-8 border-b border-muted bg-muted/5">
                <TabsList className="h-14 w-full justify-start gap-8 bg-transparent p-0">
                  <TabsTrigger value="basic" className="relative h-14 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 font-bold uppercase text-[11px] tracking-[0.1em] gap-2.5 cursor-pointer transition-all">
                    <Settings2 className="h-4 w-4 text-muted-foreground group-data-[state=active]:text-primary" /> Загальне
                  </TabsTrigger>
                  <TabsTrigger value="config" className="relative h-14 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 font-bold uppercase text-[11px] tracking-[0.1em] gap-2.5 cursor-pointer transition-all">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground group-data-[state=active]:text-primary" /> 
                      Конфігурація
                      {(errors.configuration || mappingError) && <AlertTriangle className="h-3 w-3 text-destructive animate-pulse" />}
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="schedule" className="relative h-14 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 font-bold uppercase text-[11px] tracking-[0.1em] gap-2.5 cursor-pointer transition-all">
                    <Clock className="h-4 w-4 text-muted-foreground group-data-[state=active]:text-primary" /> Розклад
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-muted">
                <TabsContent value="basic" className="m-0 space-y-8 outline-none animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Назва джерела</label>
                      <Input {...register('name')} placeholder="Наприклад: ТСН Новини" className="h-12 rounded-xl shadow-sm border-muted-foreground/20 text-base" />
                      {errors.name && <p className="text-[10px] text-destructive font-bold px-1">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-2.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Тип парсера</label>
                      <Controller
                        name="type"
                        control={control}
                        render={({ field }) => (
                          <Select 
                            onValueChange={field.onChange} 
                            value={field.value}
                            disabled={!!sourceId} 
                          >
                            <SelectTrigger className="h-12 rounded-xl shadow-sm border-muted-foreground/20 text-base data-disabled:opacity-70 data-disabled:cursor-not-allowed">
                              <SelectValue placeholder="Оберіть тип" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl shadow-xl border-muted">
                              <SelectItem value="RSS" className="cursor-pointer font-medium py-2.5">RSS Feed</SelectItem>
                              <SelectItem value="HTML" className="cursor-pointer font-medium py-2.5">HTML Parser</SelectItem>
                              <SelectItem value="JSON" className="cursor-pointer font-medium py-2.5">JSON API</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {sourceId && <p className="text-[9px] text-muted-foreground italic px-1">Тип джерела неможливо змінити після створення</p>}
                    </div>
                    <div className="col-span-full space-y-2.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1 flex items-center gap-2">
                        <Link2 className="h-3.5 w-3.5" /> URL адреса джерела
                      </label>
                      <Input {...register('url')} placeholder="https://tsn.ua/rss" className="h-12 rounded-xl shadow-sm border-muted-foreground/20 font-mono text-sm" />
                      {errors.url && <p className="text-[10px] text-destructive font-bold px-1">{errors.url.message}</p>}
                    </div>
                    <div className="col-span-full space-y-2.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1 flex items-center gap-2">
                        <ImageIcon className="h-3.5 w-3.5" /> Пряме посилання на логотип
                      </label>
                      <Input {...register('logoUrl')} placeholder="https://example.com/logo.png" className="h-12 rounded-xl shadow-sm border-muted-foreground/20 font-mono text-sm" />
                      {errors.logoUrl && <p className="text-[10px] text-destructive font-bold px-1">{errors.logoUrl.message}</p>}
                    </div>
                    <div className="col-span-full flex items-center justify-between p-6 rounded-2xl bg-muted/30 border border-muted/50 mt-4 shadow-inner">
                      <div className="space-y-1">
                        <label className="text-base font-bold flex items-center gap-2">
                          Активний стан
                          <span className={`inline-block w-2 h-2 rounded-full ${watch('active') ? 'bg-emerald-500 animate-pulse' : 'bg-muted-foreground/30'}`} />
                        </label>
                        <p className="text-xs text-muted-foreground">Дозволяє автоматичний запуск парсингу за розкладом</p>
                      </div>
                      <Controller
                        name="active"
                        control={control}
                        render={({ field }) => (
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        )}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="config" className="m-0 space-y-10 outline-none animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <Controller
                    name="configuration.http.headers"
                    control={control}
                    render={({ field }) => (
                      <SourceHttpFields headers={field.value as Record<string, string>} onChange={field.onChange} />
                    )}
                  />

                  {(sourceType === 'HTML' || sourceType === 'JSON') && (
                    <div className="space-y-8 pt-10 border-t border-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="h-1.5 w-10 rounded-full bg-primary" />
                        <label className="text-lg font-bold uppercase tracking-widest text-foreground">Мапінг даних</label>
                      </div>
                      
                      <Controller
                        name="configuration.mapping"
                        control={control}
                        render={({ field }) => (
                          sourceType === 'HTML' ? (
                            <HTMLMappingFields 
                              value={field.value as any || {}} 
                              onChange={field.onChange} 
                            />
                          ) : (
                            <JSONMappingFields 
                              value={field.value as any || {}} 
                              onChange={field.onChange} 
                            />
                          )
                        )}
                      />
                      {mappingError && (
                        <p className="text-[11px] text-destructive font-bold px-4 py-3 bg-destructive/10 rounded-xl border border-destructive/20 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          {mappingError.message}
                        </p>
                      )}
                    </div>
                  )}

                  {sourceType === 'RSS' && (
                    <div className="space-y-8 border-t border-muted/50 pt-10">
                       <div className="flex items-center gap-3">
                        <div className="h-1.5 w-10 rounded-full bg-primary" />
                        <label className="text-lg font-bold uppercase tracking-widest text-foreground">Налаштування дати</label>
                      </div>
                      
                      <Controller
                        name="configuration.mapping.dateFormat"
                        control={control}
                        render={({ field }) => (
                          <SourceDateFormatsField 
                            formats={field.value as string[] || []} 
                            onChange={field.onChange} 
                          />
                        )}
                      />

                      <div className="p-8 text-center space-y-4 rounded-2xl border-2 border-dashed border-muted bg-muted/5 mt-4">
                        <div className="mx-auto w-14 h-14 rounded-full bg-muted flex items-center justify-center">
                          <Database className="h-7 w-7 text-muted-foreground/30" />
                        </div>
                        <div className="space-y-1.5">
                          <p className="font-bold text-base text-foreground">Стандартний RSS Протокол</p>
                          <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                            Для RSS джерел мапінг полів (заголовок, опис, посилання) виконується автоматично. 
                            Ви можете налаштувати лише специфічні формати дати, якщо стандартні не розпізнаються.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="schedule" className="m-0 outline-none animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="bg-muted/30 p-8 rounded-3xl border border-muted shadow-inner">
                    <Controller
                      name="schedule"
                      control={control}
                      render={({ field }) => (
                        <SourceScheduleFields value={field.value || ''} onChange={field.onChange} />
                      )}
                    />
                  </div>
                </TabsContent>
              </div>
            </Tabs>

            <DialogFooter className="p-8 border-t border-muted bg-muted/20 shrink-0">
              <div className="flex w-full items-center justify-between gap-6">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => onOpenChange(false)} 
                  className="h-12 px-8 rounded-xl font-bold uppercase text-[11px] tracking-[0.1em] cursor-pointer hover:bg-background transition-colors"
                >
                  Скасувати
                </Button>
                <div className="flex items-center gap-4">
                  {!isValid && isDirty && (
                    <span className="text-[10px] text-destructive font-black uppercase tracking-widest animate-bounce">
                      Форма невалідна
                    </span>
                  )}
                  <Button 
                    type="submit" 
                    disabled={isPending || !isDirty} 
                    className="h-12 px-10 rounded-xl font-black uppercase text-[11px] tracking-[0.1em] gap-3 shadow-xl shadow-primary/20 cursor-pointer transition-all hover:scale-[1.02] active:scale-95 disabled:grayscale"
                  >
                    {isPending ? (
                      <Loader2 className="h-4.5 w-4.5 animate-spin" />
                    ) : (
                      <Save className="h-4.5 w-4.5" />
                    )}
                    {sourceId ? 'Оновити джерело' : 'Створити джерело'}
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
