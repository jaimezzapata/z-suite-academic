"use client";

import Link from "next/link";
import { UserPlus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { LinkButton } from "@/shared/components/ui/link-button";
import { useRegisterForm } from "@/features/auth/hooks/use-register-form";

export function RegisterForm() {
  const { form, isSubmitting, onSubmit } = useRegisterForm();

  return (
    <div className="space-y-5">
      <Link
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 text-sm font-medium text-emerald-700 shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-emerald-50 active:scale-95"
        href="/api/auth/signin/google"
      >
        <UserPlus className="h-4 w-4" />
        Registrarme con Google
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
          autoComplete="name"
          disabled={isSubmitting}
          error={form.formState.errors.name?.message}
          label="Nombre"
          placeholder="Tu nombre"
          type="text"
          {...form.register("name")}
        />

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
          autoComplete="new-password"
          disabled={isSubmitting}
          error={form.formState.errors.password?.message}
          label="Contraseña"
          placeholder="Mínimo 8 caracteres"
          type="password"
          {...form.register("password")}
        />

        <Input
          autoComplete="new-password"
          disabled={isSubmitting}
          error={form.formState.errors.confirmPassword?.message}
          label="Confirmar contraseña"
          placeholder="Repite tu contraseña"
          type="password"
          {...form.register("confirmPassword")}
        />

        <div className="grid gap-3 pt-2 sm:grid-cols-[1fr_180px] sm:items-center">
          <Button disabled={isSubmitting} fullWidth size="lg" type="submit">
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
