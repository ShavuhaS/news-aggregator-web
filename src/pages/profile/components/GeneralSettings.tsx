import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/store/useAuthStore';
import { apiFetch } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Form, type FieldConfig } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { updateProfileSchema, type UpdateProfileFormValues } from '@/lib/validations/auth';

const PROFILE_FIELDS: FieldConfig<UpdateProfileFormValues>[] = [
  { name: 'username', label: 'Логін', placeholder: 'ivan_petrov' },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'ivan@example.com' },
];

export function GeneralSettings() {
  const { user, fetchProfile } = useAuthStore();

  const form = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      username: user?.username || '',
      email: user?.email || '',
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        username: user.username,
        email: user.email,
      });
    }
  }, [user, form]);

  const mutation = useMutation({
    mutationFn: (values: UpdateProfileFormValues) =>
      apiFetch('/user/profile', { method: 'PATCH', body: JSON.stringify(values) }),
    onSuccess: () => {
      toast.success('Профіль оновлено');
      fetchProfile();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Особиста інформація</CardTitle>
        <CardDescription>Оновіть свій логін та електронну адресу</CardDescription>
      </CardHeader>
      <CardContent>
        <Form
          onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
          fields={PROFILE_FIELDS}
          register={form.register}
          errors={form.formState.errors}
        >
          <Button disabled={mutation.isPending}>
            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Зберегти зміни
          </Button>
        </Form>
      </CardContent>
    </Card>
  );
}
