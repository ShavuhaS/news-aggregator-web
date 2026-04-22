import { Alert, AlertDescription } from '@/components/ui/alert';
import { FormInput } from './form-input';
import { UseFormRegister, FieldErrors, FieldValues, Path } from 'react-hook-form';

export interface FieldConfig<T extends FieldValues> {
  name: Path<T>;
  label: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
}

interface FormProps<T extends FieldValues> extends React.FormHTMLAttributes<HTMLFormElement> {
  error?: string | null;
  fields?: FieldConfig<T>[];
  register?: UseFormRegister<T>;
  errors?: FieldErrors<T>;
}

export function Form<T extends FieldValues>({ 
  error, 
  fields, 
  register, 
  errors, 
  children, 
  className, 
  ...props 
}: FormProps<T>) {
  return (
    <form className={`space-y-4 ${className || ''}`} {...props}>
      {error && (
        <Alert variant="destructive" className="bg-destructive/10">
          <AlertDescription className="font-medium text-xs">
            {error}
          </AlertDescription>
        </Alert>
      )}
      
      {fields && register && fields.map((field) => (
        <FormInput
          key={field.name}
          id={field.name}
          label={field.label}
          type={field.type}
          placeholder={field.placeholder}
          disabled={field.disabled}
          error={errors?.[field.name]?.message as string}
          {...register(field.name)}
        />
      ))}
      
      {children}
    </form>
  );
}
