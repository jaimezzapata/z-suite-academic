"use client";

import type { SelectHTMLAttributes } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/utils/cn";
import { useCreateStudyPlan } from "@/features/pensum/hooks/use-create-study-plan";

type CoreContentOption = {
  id: string;
  name: string;
};

type LocationOption = {
  id: string;
  institutionName: string;
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

type CreateStudyPlanFormProps = {
  coreContents: CoreContentOption[];
  locations: LocationOption[];
};

export function CreateStudyPlanForm({
  coreContents,
  locations,
}: CreateStudyPlanFormProps) {
  const { form, isSubmitting, onSubmit } = useCreateStudyPlan();
  const isDisabled =
    isSubmitting || coreContents.length === 0 || locations.length === 0;

  return (
    <form className="grid gap-4" noValidate onSubmit={onSubmit}>
      <SelectField
        disabled={isDisabled}
        error={form.formState.errors.locationId?.message}
        label="Sede"
        {...form.register("locationId")}
      >
        <option value="">Selecciona una sede</option>
        {locations.map((location) => (
          <option key={location.id} value={location.id}>
            {location.institutionName} - {location.name}
          </option>
        ))}
      </SelectField>

      <SelectField
        disabled={isDisabled}
        error={form.formState.errors.coreContentId?.message}
        label="Contenido base"
        {...form.register("coreContentId")}
      >
        <option value="">Selecciona un contenido base</option>
        {coreContents.map((content) => (
          <option key={content.id} value={content.id}>
            {content.name}
          </option>
        ))}
      </SelectField>

      <Input
        disabled={isDisabled}
        error={form.formState.errors.aliasName?.message}
        label="Alias comercial"
        placeholder='Ej. "Front 2"'
        type="text"
        {...form.register("aliasName")}
      />

      <Button
        className="shadow-[0_10px_24px_rgba(37,99,235,0.16)]"
        disabled={isDisabled}
        fullWidth
        size="lg"
        type="submit"
      >
        Guardar plan de estudio
      </Button>
    </form>
  );
}
