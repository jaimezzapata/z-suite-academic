"use client";

import Link from "next/link";
import { LogIn } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { LinkButton } from "@/shared/components/ui/link-button";
import { useLoginForm } from "@/features/auth/hooks/use-login-form";

export function LoginForm() {
  const { form, isSubmitting, onSubmit } = useLoginForm();

  return (
    <div className="space-y-5">
      <Link
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-blue-200 bg-blue-50 px-5 text-sm font-medium text-blue-700 shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-blue-50 active:scale-95"
        href="/api/auth/signin/google"
      >
        <LogIn className="h-4 w-4" />
        Continuar con Google
      </Link>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs font-medium uppercase tracking-[0.22em] text-slate-400">
          o con correo
        </span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
        <Input
          autoComplete="email"
          disabled={isSubmitting}
          error={form.formState.errors.email?.message}
          label="Correo"
          placeholder="tu@correo.com"
          type="email"
          {...form.register("email")}
        />

        <Input
          autoComplete="current-password"
          disabled={isSubmitting}
          error={form.formState.errors.password?.message}
          label="Contraseña"
          placeholder="••••••••"
          type="password"
          {...form.register("password")}
        />

        <div className="grid gap-3 pt-2 sm:grid-cols-[1fr_180px] sm:items-center">
          <Button disabled={isSubmitting} fullWidth size="lg" type="submit">
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
