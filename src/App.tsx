import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/store/useAuthStore';
import { apiFetch } from '@/lib/api';
import { Header } from '@/components/Header';
import { ProtectedRoute } from '@/components/ProtectedRoute';

const queryClient = new QueryClient();

function App() {
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };

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
        <div className="min-h-screen bg-background text-foreground">
          <Header />
          
          <main className="container mx-auto p-4 md:p-8">
            <Routes>
              {/* Публічні маршрути */}
              <Route path="/" element={<NewsFeedPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Маршрути для авторизованих користувачів */}
              <Route 
                path="/for-you" 
                element={
                  <ProtectedRoute>
                    <ForYouPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <ProfileSettingsPage />
                  </ProtectedRoute>
                } 
              />

              {/* Маршрути тільки для адмінів */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <AdminDashboardPage />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

// Тимчасові компоненти-заглушки (placeholders)
const NewsFeedPage = () => <div>Головна стрічка новин (Публічна)</div>;
const LoginPage = () => <div>Сторінка входу</div>;
const RegisterPage = () => <div>Сторінка реєстрації</div>;
const ForYouPage = () => <div>Персоналізовані новини (Тільки авторизовані)</div>;
const ProfileSettingsPage = () => <div>Налаштування профілю (Тільки авторизовані)</div>;
const AdminDashboardPage = () => <div>Панель адміністратора (Тільки ADMIN)</div>;

export default App;
