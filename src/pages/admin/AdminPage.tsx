import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, AlertCircle, MessageSquareWarning, ShieldCheck } from 'lucide-react';
import { ParserErrorsPanel } from '@/components/admin/ParserErrorsPanel';
import { NewsComplaintsPanel } from '@/components/admin/NewsComplaintsPanel';
import { SourcesPanel } from '@/components/admin/SourcesPanel';

export function AdminPage() {
  return (
    <div className="space-y-8 pb-20">
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight italic flex items-center gap-3 text-primary">
          <ShieldCheck className="h-10 w-10" />
          Панель адміністратора
        </h1>
        <p className="text-muted-foreground text-lg font-medium">Керування джерелами, моніторинг системи та модерація</p>
      </div>

      <Tabs defaultValue="sources" className="w-full space-y-8">
        <TabsList className="bg-muted/50 p-1 h-14 w-full justify-start gap-2 rounded-2xl border border-muted">
          <TabsTrigger value="sources" className="gap-2 px-6 rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm font-bold uppercase text-[10px] tracking-widest cursor-pointer">
            <Database className="h-4 w-4" /> Джерела
          </TabsTrigger>
          <TabsTrigger value="errors" className="gap-2 px-6 rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm font-bold uppercase text-[10px] tracking-widest cursor-pointer">
            <AlertCircle className="h-4 w-4 text-destructive" /> Помилки парсингу
          </TabsTrigger>
          <TabsTrigger value="complaints" className="gap-2 px-6 rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm font-bold uppercase text-[10px] tracking-widest cursor-pointer">
            <MessageSquareWarning className="h-4 w-4 text-amber-500" /> Скарги
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sources" className="animate-in fade-in slide-in-from-bottom-2 duration-300 outline-none">
          <SourcesPanel />
        </TabsContent>

        <TabsContent value="errors" className="animate-in fade-in slide-in-from-bottom-2 duration-300 outline-none">
          <ParserErrorsPanel />
        </TabsContent>

        <TabsContent value="complaints" className="animate-in fade-in slide-in-from-bottom-2 duration-300 outline-none">
          <NewsComplaintsPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
