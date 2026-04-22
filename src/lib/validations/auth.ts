import * as z from 'zod';

export const loginSchema = z.object({
  usernameOrEmail: z.string().min(1, 'Введіть логін або email'),
  password: z.string().min(1, 'Введіть пароль'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    username: z.string().min(1, 'Логін не може бути порожнім'),
    email: z.string().email('Некоректний Email'),
    password: z.string().min(8, 'Пароль має бути не менше 8 символів'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Паролі не співпадають',
    path: ['confirmPassword'],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
