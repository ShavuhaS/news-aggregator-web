import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { CreateSourceValues } from '@/lib/validations/parser';
import { toast } from 'sonner';

export function useSourceMutations() {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-sources'] });
  };

  const createMutation = useMutation({
    mutationFn: (values: CreateSourceValues) => {
      const payload: any = { ...values };
      if (!payload.logoUrl || payload.logoUrl.trim() === '') {
        delete payload.logoUrl;
      }
      return apiFetch('/parser/sources', { 
        method: 'POST', 
        body: JSON.stringify(payload) 
      });
    },
    onSuccess: () => {
      toast.success('Джерело створено');
      invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, values, oldActive }: { id: string; values: CreateSourceValues; oldActive?: boolean }) => {
      const requests = [];
      
      const basicInfo: any = {
        name: values.name,
        url: values.url,
        schedule: values.schedule,
      };
      
      if (values.logoUrl && values.logoUrl.trim() !== '') {
        basicInfo.logoUrl = values.logoUrl;
      } else {
        basicInfo.logoUrl = null;
      }

      requests.push(apiFetch(`/parser/sources/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(basicInfo)
      }));

      if (oldActive !== undefined && values.active !== oldActive) {
        requests.push(apiFetch(`/parser/sources/${id}/status`, {
          method: 'PUT',
          body: JSON.stringify({ active: values.active })
        }));
      }

      requests.push(apiFetch(`/parser/sources/${id}/config`, {
        method: 'PUT',
        body: JSON.stringify({ configuration: values.configuration })
      }));

      return Promise.all(requests);
    },
    onSuccess: () => {
      toast.success('Джерело оновлено');
      invalidate();
      queryClient.invalidateQueries({ queryKey: ['admin-source-detail'] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) => 
      apiFetch(`/parser/sources/${id}/status`, { 
        method: 'PUT', 
        body: JSON.stringify({ active }) 
      }),
    onSuccess: () => {
      toast.success('Статус оновлено');
      invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiFetch(`/parser/sources/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      toast.success('Джерело видалено');
      invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const triggerParseMutation = useMutation({
    mutationFn: (id: string) => apiFetch(`/parser/sources/${id}/parse`, { method: 'POST' }),
    onSuccess: () => toast.success('Запит на парсинг надіслано'),
    onError: (err: Error) => toast.error(err.message),
  });

  return {
    createSource: createMutation,
    updateSource: updateMutation,
    toggleStatus: toggleStatusMutation,
    deleteSource: deleteMutation,
    triggerParse: triggerParseMutation,
  };
}
