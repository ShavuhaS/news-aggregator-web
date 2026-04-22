import * as z from 'zod';

export const loginSchema = z.object({
  usernameOrEmail: z.string().min(1, 'Введіть логін або email'),
  password: z.string().min(1, 'Введіть пароль'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    username: z.string().min(1, 'Логін не може бути порожнім'),
    email: z.email('Некоректний Email'),
    password: z.string().min(8, 'Пароль має бути не менше 8 символів'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Паролі не співпадають',
    path: ['confirmPassword'],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const updateProfileSchema = z.object({
  username: z.string().min(1, 'Логін не може бути порожнім'),
  email: z.email('Некоректний Email'),
});

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, 'Введіть поточний пароль'),
    newPassword: z.string().min(8, 'Новий пароль має бути не менше 8 символів'),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Паролі не співпадають',
    path: ['confirmNewPassword'],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
