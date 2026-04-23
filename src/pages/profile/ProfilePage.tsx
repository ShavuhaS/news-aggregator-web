import { useAuthStore } from '@/store/useAuthStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GeneralSettings } from './components/GeneralSettings';
import { PreferencesSettings } from './components/PreferencesSettings';
import { SecuritySettings } from './components/SecuritySettings';
import { UserComplaints } from './components/UserComplaints';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { User, Settings, ShieldCheck, MessageSquare } from 'lucide-react';

const TABS = ['general', 'preferences', 'security', 'complaints'] as const;
type TabType = (typeof TABS)[number];

export function ProfilePage() {
  const { user } = useAuthStore();
  const { tab } = useParams<{ tab: string }>();
  const navigate = useNavigate();

  if (!tab || !TABS.includes(tab as any)) {
    return <Navigate to="/profile/general" replace />;
  }

  const activeTab = tab as TabType;

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight italic">Налаштування профілю</h1>
        <p className="text-muted-foreground text-lg font-medium">Керуйте своїми даними, вподобаннями та скаргами</p>
      </div>

      <Tabs 
        value={activeTab} 
        onValueChange={(value) => navigate(`/profile/${value}`)} 
        orientation="vertical"
        className="flex flex-col md:flex-row gap-8"
      >
        <aside className="w-full md:w-64 shrink-0">
          <TabsList className="flex flex-row md:flex-col h-auto w-full bg-muted/30 p-1.5 rounded-2xl border border-muted/50 backdrop-blur-sm sticky top-24">
            <TabsTrigger 
              value="general" 
              className="flex-1 md:w-full justify-start gap-3 px-4 h-8 text-md font-bold uppercase tracking-widest cursor-pointer transition-all data-[state=active]:bg-background data-[state=active]:shadow-lg rounded-xl"
            >
              <User className="h-4 w-4" />
              <span className="hidden md:inline">Основне</span>
            </TabsTrigger>
            <TabsTrigger 
              value="preferences" 
              className="flex-1 md:w-full justify-start gap-3 px-4 h-8 text-md font-bold uppercase tracking-widest cursor-pointer transition-all data-[state=active]:bg-background data-[state=active]:shadow-lg rounded-xl"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden md:inline">Вподобання</span>
            </TabsTrigger>
            <TabsTrigger 
              value="security" 
              className="flex-1 md:w-full justify-start gap-3 px-4 h-8 text-md font-bold uppercase tracking-widest cursor-pointer transition-all data-[state=active]:bg-background data-[state=active]:shadow-lg rounded-xl"
            >
              <ShieldCheck className="h-4 w-4" />
              <span className="hidden md:inline">Безпека</span>
            </TabsTrigger>
            <TabsTrigger 
              value="complaints" 
              className="flex-1 md:w-full justify-start gap-3 px-4 h-8 text-md font-bold uppercase tracking-widest cursor-pointer transition-all data-[state=active]:bg-background data-[state=active]:shadow-lg rounded-xl text-destructive data-[state=active]:text-destructive"
            >
              <MessageSquare className="h-4 w-4" />
              <span className="hidden md:inline">Скарги</span>
            </TabsTrigger>
          </TabsList>
        </aside>

        <div className="flex-1 min-w-0">
          <TabsContent value="general" className="mt-0 animate-in fade-in slide-in-from-right-2 duration-300">
            <GeneralSettings />
          </TabsContent>

          <TabsContent value="preferences" className="mt-0 animate-in fade-in slide-in-from-right-2 duration-300">
            <PreferencesSettings />
          </TabsContent>

          <TabsContent value="security" className="mt-0 animate-in fade-in slide-in-from-right-2 duration-300">
            <SecuritySettings />
          </TabsContent>

          <TabsContent value="complaints" className="mt-0 animate-in fade-in slide-in-from-right-2 duration-300">
            <UserComplaints />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
