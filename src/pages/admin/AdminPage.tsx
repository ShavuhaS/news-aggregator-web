import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, AlertCircle, MessageSquareWarning, ShieldCheck } from 'lucide-react';

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
          <Card className="border-muted/60 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Управління джерелами</CardTitle>
              <CardDescription>Список активних та призупинених парсерів новин</CardDescription>
            </CardHeader>
            <CardContent className="h-60 flex items-center justify-center border-t border-dashed mt-4 bg-muted/5">
              <p className="text-muted-foreground font-medium italic">Тут буде список джерел з можливістю додавання та редагування</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="errors" className="animate-in fade-in slide-in-from-bottom-2 duration-300 outline-none">
          <Card className="border-muted/60 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-destructive">Лог помилок</CardTitle>
              <CardDescription>Останні технічні проблеми при зборі новин</CardDescription>
            </CardHeader>
            <CardContent className="h-60 flex items-center justify-center border-t border-dashed mt-4 bg-muted/5">
              <p className="text-muted-foreground font-medium italic">Тут буде таблиця помилок парсингу в реальному часі</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="complaints" className="animate-in fade-in slide-in-from-bottom-2 duration-300 outline-none">
          <Card className="border-muted/60 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-amber-600">Скарги користувачів</CardTitle>
              <CardDescription>Новини, на які поскаржилися користувачі агрегатора</CardDescription>
            </CardHeader>
            <CardContent className="h-60 flex items-center justify-center border-t border-dashed mt-4 bg-muted/5">
              <p className="text-muted-foreground font-medium italic">Тут буде список новин зі скаргами (модерація)</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
