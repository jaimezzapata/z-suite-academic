"use client";

import type { SelectHTMLAttributes } from "react";
import type { LocationFormValues } from "@/features/institutions/validations/location-schema";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/utils/cn";
import { useLocationForm } from "@/features/institutions/hooks/use-create-location";

type InstitutionOption = {
  id: string;
  name: string;
};

function SelectField({
  children,
  error,
  label,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & {
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

type CreateLocationFormProps = {
  initialValues?: LocationFormValues;
  institutions: InstitutionOption[];
  locationId?: string;
  mode?: "create" | "edit";
  onSuccess?: () => void;
  submitLabel?: string;
};

export function CreateLocationForm({
  initialValues,
  institutions,
  locationId,
  mode = "create",
  onSuccess,
  submitLabel,
}: CreateLocationFormProps) {
  const { form, isSubmitting, onSubmit } = useLocationForm({
    initialValues,
    locationId,
    mode,
    onSuccess,
  });

  return (
    <form className="grid gap-4" noValidate onSubmit={onSubmit}>
      <SelectField
        disabled={isSubmitting || institutions.length === 0}
        error={form.formState.errors.institutionId?.message}
        label="Institucion"
        {...form.register("institutionId")}
      >
        <option value="">Selecciona una institucion</option>
        {institutions.map((institution) => (
          <option key={institution.id} value={institution.id}>
            {institution.name}
          </option>
        ))}
      </SelectField>

      <Input
        disabled={isSubmitting}
        error={form.formState.errors.name?.message}
        label="Sede"
        placeholder="Ej. CESDE Bello"
        type="text"
        {...form.register("name")}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Input
          disabled={isSubmitting}
          error={form.formState.errors.code?.message}
          label="Codigo"
          placeholder="Opcional"
          type="text"
          {...form.register("code")}
        />

        <Input
          disabled={isSubmitting}
          error={form.formState.errors.address?.message}
          label="Direccion"
          placeholder="Opcional"
          type="text"
          {...form.register("address")}
        />
      </div>

      <Button
        className="bg-emerald-600 text-white shadow-[0_10px_24px_rgba(5,150,105,0.16)] hover:bg-emerald-700"
        disabled={isSubmitting || institutions.length === 0}
        fullWidth
        size="lg"
        type="submit"
      >
        {submitLabel ?? (mode === "edit" ? "Guardar cambios" : "Guardar sede")}
      </Button>
    </form>
  );
}
