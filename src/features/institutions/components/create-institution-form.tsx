"use client";

import type { InstitutionFormValues } from "@/features/institutions/validations/institution-schema";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/utils/cn";
import { useInstitutionForm } from "@/features/institutions/hooks/use-create-institution";

function SelectField({
  children,
  error,
  label,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  error?: string;
  label: string;
}) {
  const inputId = props.id ?? props.name;
  const errorId = error && inputId ? `${inputId}-error` : undefined;

  return (
    <label className="flex w-full flex-col gap-2" htmlFor={inputId}>
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <select
        aria-describedby={errorId}
        aria-invalid={Boolean(error)}
        className={cn(
          "h-11 w-full rounded-xl border border-slate-100 bg-slate-50 px-4 text-sm text-slate-900 shadow-sm",
          "focus-visible:border-blue-200 focus-visible:bg-white focus-visible:outline-none",
          error && "border-rose-200 bg-rose-50/50",
        )}
        id={inputId}
        {...props}
      >
        {children}
      </select>
      {error ? (
        <span className="text-xs text-rose-600" id={errorId} role="alert">
          {error}
        </span>
      ) : null}
    </label>
  );
}

type CreateInstitutionFormProps = {
  initialValues?: InstitutionFormValues;
  institutionId?: string;
  mode?: "create" | "edit";
  onSuccess?: () => void;
  submitLabel?: string;
};

export function CreateInstitutionForm({
  initialValues,
  institutionId,
  mode = "create",
  onSuccess,
  submitLabel,
}: CreateInstitutionFormProps) {
  const { form, isSubmitting, onSubmit } = useInstitutionForm({
    initialValues,
    institutionId,
    mode,
    onSuccess,
  });

  return (
    <form className="grid gap-4 lg:grid-cols-2" noValidate onSubmit={onSubmit}>
      <Input
        disabled={isSubmitting}
        error={form.formState.errors.name?.message}
        label="Institucion"
        placeholder="Ej. CESDE"
        type="text"
        {...form.register("name")}
      />

      <SelectField
        disabled={isSubmitting}
        error={form.formState.errors.minutesPerHour?.message}
        label="Regla por hora"
        {...form.register("minutesPerHour", { valueAsNumber: true })}
      >
        <option value="45">45 minutos</option>
        <option value="60">60 minutos</option>
      </SelectField>

      <SelectField
        disabled={isSubmitting}
        error={form.formState.errors.paymentType?.message}
        label="Tipo de pago"
        {...form.register("paymentType")}
      >
        <option value="HOURLY">Por horas</option>
        <option value="FIXED_SALARY">Salario fijo</option>
      </SelectField>

      <SelectField
        disabled={isSubmitting}
        error={form.formState.errors.periodType?.message}
        label="Tipo de periodo"
        {...form.register("periodType")}
      >
        <option value="SEMESTER">Semestral</option>
        <option value="TRIMESTER">Trimestral</option>
      </SelectField>

      <div className="lg:col-span-2 lg:flex lg:justify-end">
        <Button
          className="bg-blue-700 text-white shadow-[0_10px_24px_rgba(37,99,235,0.16)] hover:bg-blue-800"
          disabled={isSubmitting}
          fullWidth
          size="lg"
          type="submit"
        >
          {submitLabel ?? (mode === "edit" ? "Guardar cambios" : "Guardar institucion")}
        </Button>
      </div>
    </form>
  );
}
