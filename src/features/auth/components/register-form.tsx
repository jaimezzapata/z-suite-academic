"use client";

import { UserPlus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { LinkButton } from "@/shared/components/ui/link-button";
import { useRegisterForm } from "@/features/auth/hooks/use-register-form";

export function RegisterForm() {
  const {
    form,
    handleFieldKeyDown,
    handleGoogleSignIn,
    isSubmitting,
    onSubmit,
  } = useRegisterForm();

  return (
    <div className="space-y-4">
      <Button
        disabled={isSubmitting}
        fullWidth
        onClick={handleGoogleSignIn}
        type="button"
        variant="secondary"
      >
        <UserPlus className="h-4 w-4" />
        Registrarme con Google
      </Button>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs font-medium uppercase tracking-[0.22em] text-slate-400">
          o con correo
        </span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <form className="space-y-3.5" noValidate onSubmit={onSubmit}>
        <Input
          autoComplete="name"
          disabled={isSubmitting}
          error={form.formState.errors.name?.message}
          label="Nombre"
          onKeyDown={handleFieldKeyDown("name")}
          placeholder="Tu nombre"
          type="text"
          {...form.register("name")}
        />

        <Input
          autoComplete="email"
          disabled={isSubmitting}
          error={form.formState.errors.email?.message}
          label="Correo"
          onKeyDown={handleFieldKeyDown("email")}
          placeholder="tu@correo.com"
          type="email"
          {...form.register("email")}
        />

        <Input
          autoComplete="new-password"
          disabled={isSubmitting}
          error={form.formState.errors.password?.message}
          label="Contraseña"
          onKeyDown={handleFieldKeyDown("password")}
          placeholder="Mínimo 8 caracteres"
          type="password"
          {...form.register("password")}
        />

        <Input
          autoComplete="new-password"
          disabled={isSubmitting}
          error={form.formState.errors.confirmPassword?.message}
          label="Confirmar contraseña"
          onKeyDown={handleFieldKeyDown("confirmPassword")}
          placeholder="Repite tu contraseña"
          type="password"
          {...form.register("confirmPassword")}
        />

        <div className="grid gap-2 pt-1 sm:grid-cols-[1fr_160px] sm:items-center">
          <Button
            className="bg-emerald-700 shadow-[0_10px_24px_rgba(4,120,87,0.18)] hover:bg-emerald-800 focus-visible:outline-emerald-200"
            disabled={isSubmitting}
            fullWidth
            size="lg"
            type="submit"
          >
            Crear cuenta
          </Button>
          <LinkButton className="w-full" href="/login">
            Ya tengo cuenta
          </LinkButton>
        </div>
      </form>
    </div>
  );
}
