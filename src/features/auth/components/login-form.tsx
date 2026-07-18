"use client";

import { LogIn } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { LinkButton } from "@/shared/components/ui/link-button";
import { useLoginForm } from "@/features/auth/hooks/use-login-form";

export function LoginForm() {
  const {
    form,
    handleFieldKeyDown,
    handleGoogleSignIn,
    isSubmitting,
    onSubmit,
  } = useLoginForm();

  return (
    <div className="space-y-4">
      <Button
        disabled={isSubmitting}
        fullWidth
        onClick={handleGoogleSignIn}
        type="button"
        variant="secondary"
      >
        <LogIn className="h-4 w-4" />
        Continuar con Google
      </Button>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs font-medium uppercase tracking-[0.22em] text-slate-400">
          o con correo
        </span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <form className="space-y-4" noValidate onSubmit={onSubmit}>
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
          autoComplete="current-password"
          disabled={isSubmitting}
          error={form.formState.errors.password?.message}
          label="Contraseña"
          onKeyDown={handleFieldKeyDown("password")}
          placeholder="••••••••"
          type="password"
          {...form.register("password")}
        />

        <div className="grid gap-2 pt-1 sm:grid-cols-[1fr_160px] sm:items-center">
          <Button
            className="shadow-[0_10px_24px_rgba(37,99,235,0.18)]"
            disabled={isSubmitting}
            fullWidth
            size="lg"
            type="submit"
          >
            Ingresar
          </Button>
          <LinkButton className="w-full" href="/registro">
            Crear cuenta
          </LinkButton>
        </div>
      </form>
    </div>
  );
}
