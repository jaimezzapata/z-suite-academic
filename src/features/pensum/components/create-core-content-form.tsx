"use client";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useCreateCoreContent } from "@/features/pensum/hooks/use-create-core-content";

export function CreateCoreContentForm() {
  const { form, isSubmitting, onSubmit } = useCreateCoreContent();

  return (
    <form className="grid gap-4" noValidate onSubmit={onSubmit}>
      <Input
        disabled={isSubmitting}
        error={form.formState.errors.name?.message}
        label="Contenido base"
        placeholder='Ej. "React Base"'
        type="text"
        {...form.register("name")}
      />

      <Button
        className="shadow-[0_10px_24px_rgba(15,23,42,0.08)]"
        disabled={isSubmitting}
        fullWidth
        size="lg"
        type="submit"
        variant="secondary"
      >
        Guardar contenido base
      </Button>
    </form>
  );
}
