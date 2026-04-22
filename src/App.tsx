import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/store/useAuthStore';
import { Header } from '@/components/Header';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { ProfilePage } from '@/pages/profile/ProfilePage';
import { Toaster } from '@/components/ui/sonner';

const queryClient = new QueryClient();

function App() {
  const fetchProfile = useAuthStore((state) => state.fetchProfile);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const handleUnauthorized = () => logout();
    window.addEventListener('auth:unauthorized', handleUnauthorized);

    // Ініціалізація профілю при завантаженні
    fetchProfile();

    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [fetchProfile, logout]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans antialiased">
          <Header />
          
          <main className="flex-1 container mx-auto p-4 md:p-8">
            <Routes>
              <Route path="/" element={<NewsFeedPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              <Route 
                path="/for-you" 
                element={
                  <ProtectedRoute>
                    <ForYouPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile/:tab?" 
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } 
              />
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
          
          <Toaster position="top-right" closeButton richColors />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

// Заглушки для інших сторінок
const NewsFeedPage = () => <div className="text-center py-20 text-muted-foreground">Тут буде головна стрічка новин.</div>;
const ForYouPage = () => <div className="text-center py-20 text-muted-foreground">Тут будуть ваші персоналізовані новини.</div>;
const AdminDashboardPage = () => <div className="text-center py-20 text-muted-foreground">Панель адміністратора.</div>;

export default App;
