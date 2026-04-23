import { z } from 'zod';

export const httpConfigSchema = z.object({
  headers: z.record(z.string(), z.string()).optional().nullable(),
});

export const htmlMappingSchema = z.object({
  itemsSelector: z.string().min(1, 'Обов’язково'),
  titleSelector: z.string().min(1, 'Обов’язково'),
  titleAttr: z.string().optional().nullable(),
  descriptionSelector: z.string().optional().nullable(),
  descriptionAttr: z.string().optional().nullable(),
  linkSelector: z.string().min(1, 'Обов’язково'),
  linkAttr: z.string().optional().nullable(),
  imageUrlSelector: z.string().optional().nullable(),
  imageUrlAttr: z.string().optional().nullable(),
  publishedAtSelector: z.string().optional().nullable(),
  publishedAtAttr: z.string().optional().nullable(),
  dateFormat: z.array(z.string()).optional().nullable(),
});

export const jsonMappingSchema = z.object({
  itemsPath: z.string().optional().nullable(),
  titlePath: z.string().min(1, 'Обов’язково'),
  descriptionPath: z.string().optional().nullable(),
  linkPath: z.string().min(1, 'Обов’язково'),
  imageUrlPath: z.string().optional().nullable(),
  publishedAtPath: z.string().optional().nullable(),
  dateFormat: z.array(z.string()).optional().nullable(),
  logoPath: z.string().optional().nullable(),
});

export const createSourceSchema = z.object({
  name: z.string().min(2, 'Назва занадто коротка').max(50, 'Назва занадто довга'),
  url: z.string().url('Некоректний URL (має починатися з http:// або https://)'),
  type: z.enum(['RSS', 'JSON', 'HTML']),
  active: z.boolean(),
  schedule: z.string().min(1, 'Розклад обов’язковий'),
  logoUrl: z.string().optional().nullable(),
  configuration: z.object({
    http: httpConfigSchema,
    mapping: z.any().optional().nullable(),
  }),
}).refine((data) => {
  if (data.type === 'HTML') {
    return !!data.configuration.mapping && typeof data.configuration.mapping === 'object' && 'itemsSelector' in data.configuration.mapping;
  }
  if (data.type === 'JSON') {
    return !!data.configuration.mapping && typeof data.configuration.mapping === 'object' && 'titlePath' in data.configuration.mapping;
  }
  return true;
}, {
  message: "Конфігурація мапінгу обов’язкова для обраного типу джерела",
  path: ["configuration.mapping"]
});

export type CreateSourceValues = z.infer<typeof createSourceSchema>;
