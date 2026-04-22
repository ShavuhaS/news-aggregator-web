import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/store/useAuthStore';
import { apiFetch } from '@/lib/api';
import { Header } from '@/components/Header';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';

const queryClient = new QueryClient();

function App() {
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const handleUnauthorized = () => logout();
    window.addEventListener('auth:unauthorized', handleUnauthorized);

    const initAuth = async () => {
      try {
        const user = await apiFetch<any>('/user/profile');
        setUser(user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [setUser, setLoading, logout]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-background text-foreground flex flex-col">
          <Header />
          
          <main className="flex-1 container mx-auto p-4 md:p-8">
            <Routes>
              <Route path="/" element={<NewsFeedPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              <Route path="/for-you" element={<ProtectedRoute><ForYouPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfileSettingsPage /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute requiredRole="ADMIN"><AdminDashboardPage /></ProtectedRoute>} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

// Заглушки для інших сторінок
const NewsFeedPage = () => <div className="text-center py-20 text-muted-foreground">Тут буде головна стрічка новин.</div>;
const ForYouPage = () => <div className="text-center py-20 text-muted-foreground">Тут будуть ваші персоналізовані новини.</div>;
const ProfileSettingsPage = () => <div className="text-center py-20 text-muted-foreground">Налаштування профілю.</div>;
const AdminDashboardPage = () => <div className="text-center py-20 text-muted-foreground">Панель адміністратора.</div>;

export default App;
