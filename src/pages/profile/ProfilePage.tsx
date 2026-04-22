import { useAuthStore } from '@/store/useAuthStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GeneralSettings } from './components/GeneralSettings';
import { PreferencesSettings } from './components/PreferencesSettings';
import { SecuritySettings } from './components/SecuritySettings';
import { useParams, useNavigate, Navigate } from 'react-router-dom';

const TABS = ['general', 'preferences', 'security'] as const;
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
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Налаштування профілю</h1>
        <p className="text-muted-foreground text-lg">Керуйте своїми даними та вподобаннями</p>
      </div>

      <Tabs 
        value={activeTab} 
        onValueChange={(value) => navigate(`/profile/${value}`)} 
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 h-12">
          <TabsTrigger value="general" className="text-base font-medium">Основне</TabsTrigger>
          <TabsTrigger value="preferences" className="text-base font-medium">Вподобання</TabsTrigger>
          <TabsTrigger value="security" className="text-base font-medium">Безпека</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <GeneralSettings />
        </TabsContent>

        <TabsContent value="preferences" className="mt-6">
          <PreferencesSettings />
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <SecuritySettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
