import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { forwardRef } from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <Label htmlFor={id}>{label}</Label>
        <Input id={id} ref={ref} {...props} className={error ? 'border-destructive' : ''} />
        {error && <p className="text-sm text-destructive font-medium">{error}</p>}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';
