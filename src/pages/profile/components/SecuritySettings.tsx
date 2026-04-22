import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/store/useAuthStore';
import { apiFetch } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Form, type FieldConfig } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ShieldCheck, AlertCircle } from 'lucide-react';
import { changePasswordSchema, type ChangePasswordFormValues } from '@/lib/validations/auth';

const PASSWORD_FIELDS: FieldConfig<ChangePasswordFormValues>[] = [
  { name: 'oldPassword', label: 'Поточний пароль', type: 'password', placeholder: '••••••••' },
  { name: 'newPassword', label: 'Новий пароль', type: 'password', placeholder: '••••••••' },
  {
    name: 'confirmNewPassword',
    label: 'Підтвердіть новий пароль',
    type: 'password',
    placeholder: '••••••••',
  },
];

export function SecuritySettings() {
  const { user } = useAuthStore();

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  const mutation = useMutation({
    mutationFn: (values: ChangePasswordFormValues) => {
      const { confirmNewPassword: _, ...payload } = values;
      return apiFetch('/user/profile/password', { 
        method: 'PATCH', 
        body: JSON.stringify(payload) 
      });
    },
    onSuccess: () => {
      toast.success('Пароль змінено');
      form.reset();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (!user) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          Зміна пароля
        </CardTitle>
        <CardDescription>Захистіть свій аккаунт складним паролем</CardDescription>
      </CardHeader>
      <CardContent>
        {!user.hasPassword ? (
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="space-y-1">
               <p className="text-sm font-medium text-blue-900">Акаунт без пароля</p>
               <p className="text-xs text-blue-700 leading-relaxed">
                 Ви увійшли через Google і ще не встановили пароль для свого акаунта. 
                 Для безпеки рекомендується використовувати вхід через Google.
               </p>
            </div>
          </div>
        ) : (
          <Form
            onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
            fields={PASSWORD_FIELDS}
            register={form.register}
            errors={form.formState.errors}
          >
            <Button disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Оновити пароль
            </Button>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
