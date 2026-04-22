import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { apiFetch } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Form, type FieldConfig } from '@/components/ui/form';
import { GoogleIcon } from '@/components/icons/GoogleIcon';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { loginSchema, type LoginFormValues } from '@/lib/validations/auth';

const LOGIN_FIELDS: FieldConfig<LoginFormValues>[] = [
  { name: 'usernameOrEmail', label: 'Логін або Email', placeholder: 'ivan_petrov' },
  { name: 'password', label: 'Пароль', type: 'password', placeholder: '••••••••' },
];

export function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fetchProfile = useAuthStore((state) => state.fetchProfile);
  
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      await apiFetch<any>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
           username: values.usernameOrEmail,
           password: values.password
        }),
      });
      await fetchProfile();
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Не вдалося увійти. Перевірте дані.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-10 px-4">
      <Card className="w-full max-w-md shadow-lg border-muted">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">Вхід</CardTitle>
          <CardDescription className="text-muted-foreground text-base">
            Вітаємо знову! Увійдіть у свій аккаунт
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <Button 
            variant="outline" 
            type="button" 
            onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`} 
            className="w-full font-medium h-11" 
            disabled={isLoading}
          >
            <GoogleIcon className="mr-2 h-5 w-5" />
            Увійти через Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-muted" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-3 text-muted-foreground font-semibold">Або через пошту</span>
            </div>
          </div>

          <Form 
            onSubmit={handleSubmit(onSubmit)} 
            error={error}
            fields={LOGIN_FIELDS.map(f => ({ ...f, disabled: isLoading }))}
            register={register}
            errors={errors}
          >
            <Button className="w-full font-bold h-11 text-base transition-all" type="submit" disabled={isLoading}>
              {isLoading ? 'Вхід...' : 'Увійти'}
            </Button>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground border-t pt-6">
          <span>Ще немає аккаунту?</span>
          <Link to="/register" className="text-primary hover:text-primary/80 hover:underline font-bold transition-colors">
            Створити аккаунт
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
