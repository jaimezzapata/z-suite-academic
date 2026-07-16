import Link from "next/link";
import {
  ArrowRight,
  CalendarRange,
  CheckCircle2,
  FolderKanban,
  GraduationCap,
  HardDrive,
  Sparkles,
} from "lucide-react";

function CtaLink({
  href,
  label,
  variant = "primary",
}: {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
}) {
  const styles =
    variant === "primary"
      ? "bg-slate-900 text-slate-50 hover:bg-slate-800"
      : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50";

  return (
    <Link
      className={[
        "inline-flex h-11 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-medium shadow-sm",
        "transition-all duration-200 ease-out active:scale-95",
        styles,
      ].join(" ")}
      href={href}
    >
      {label}
      {variant === "primary" ? <ArrowRight className="h-4 w-4" /> : null}
    </Link>
  );
}

export function LandingHero() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-float-slow absolute left-[-5rem] top-16 h-72 w-72 rounded-full bg-blue-100/80 blur-3xl" />
        <div className="animate-float-medium absolute right-[-4rem] top-24 h-80 w-80 rounded-full bg-emerald-100/65 blur-3xl" />
        <div className="animate-float-slow absolute bottom-[-6rem] left-1/3 h-96 w-96 rounded-full bg-violet-100/45 blur-3xl" />
      </div>

      <section className="relative flex min-h-screen items-center px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-[1500px] items-center gap-6 lg:grid-cols-[minmax(420px,0.78fr)_minmax(560px,1.22fr)]">
          <article className="glass-panel rounded-[36px] p-7 sm:p-9 lg:p-12">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-slate-400 shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-slate-500" />
                Z-Suite Academic
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <CtaLink href="/login" label="Ingresar" />
                <CtaLink
                  href="/registro"
                  label="Registrarme"
                  variant="secondary"
                />
              </div>
            </div>

            <h1 className="mt-7 max-w-xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Ordena tu gestion docente en un solo lugar.
            </h1>

            <p className="mt-6 max-w-lg text-base leading-8 text-slate-600">
              Gestiona grupos, calendario academico, recursos en Google Drive y
              evaluaciones desde una experiencia clara, moderna y enfocada en tu
              trabajo diario.
            </p>

            <div className="mt-8 grid gap-3">
              <div className="flex items-start gap-3 rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-slate-900" />
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    Gestiona grupos, bitacoras y evaluaciones
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Todo el flujo docente reunido en una sola experiencia.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-md">
                  <FolderKanban className="h-5 w-5 text-slate-900" />
                  <p className="mt-4 text-sm font-medium text-slate-900">
                    Grupos
                  </p>
                </div>
                <div className="rounded-[24px] border border-blue-200 bg-blue-50 p-4 shadow-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-md">
                  <CalendarRange className="h-5 w-5 text-blue-700" />
                  <p className="mt-4 text-sm font-medium text-slate-900">
                    Calendario
                  </p>
                </div>
                <div className="rounded-[24px] border border-emerald-200 bg-emerald-50 p-4 shadow-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-md">
                  <HardDrive className="h-5 w-5 text-emerald-700" />
                  <p className="mt-4 text-sm font-medium text-slate-900">
                    Drive
                  </p>
                </div>
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 shadow-sm">
                <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-400">
                  Ideal para
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  docentes que necesitan organizar su operacion academica con
                  claridad, rapidez y menos trabajo manual.
                </p>
              </div>
            </div>
          </article>

          <article className="glass-panel overflow-hidden rounded-[36px] p-4 sm:p-5 lg:p-6">
            <div className="relative rounded-[32px] border border-slate-200 bg-white/90 p-4 shadow-sm sm:p-5 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-rose-200" />
                  <span className="h-3 w-3 rounded-full bg-amber-200" />
                  <span className="h-3 w-3 rounded-full bg-emerald-200" />
                </div>
                <div className="inline-flex h-10 items-center rounded-full border border-slate-200 bg-slate-50 px-4 text-xs font-medium uppercase tracking-[0.22em] text-slate-400">
                  Vista del sistema
                </div>
              </div>

              <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1.08fr)_320px]">
                <div className="grid gap-4">
                  <div className="relative overflow-hidden rounded-[30px] border border-slate-200 bg-slate-900 p-6 shadow-lg shadow-slate-900/10">
                    <div className="absolute right-6 top-6 h-24 w-24 rounded-full border border-white/10" />
                    <div className="absolute bottom-[-1.25rem] left-10 h-28 w-28 rounded-full bg-white/5" />

                    <div className="relative">
                      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-slate-300">
                        <GraduationCap className="h-3.5 w-3.5" />
                        Dashboard docente
                      </div>

                      <div className="mt-6 max-w-sm text-xl font-semibold tracking-tight text-white">
                        Horas, agenda y almacenamiento en un mismo panel.
                      </div>
                      <div className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
                        Una vista clara para revisar el semestre, las clases y
                        el estado general de tu operacion academica.
                      </div>
                      <div className="mt-8 grid grid-cols-3 gap-3">
                        <div className="rounded-[22px] bg-white/8 p-4">
                          <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
                            Horas
                          </div>
                          <div className="mt-4 h-10 rounded-2xl bg-white/10" />
                        </div>
                        <div className="rounded-[22px] bg-white/8 p-4">
                          <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
                            Clases
                          </div>
                          <div className="mt-4 h-10 rounded-2xl bg-white/10" />
                        </div>
                        <div className="rounded-[22px] bg-white/8 p-4">
                          <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
                            Drive
                          </div>
                          <div className="mt-4 h-10 rounded-2xl bg-white/10" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-4 shadow-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-md">
                      <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-400">
                        Grupos
                      </p>
                      <div className="mt-5 rounded-[20px] bg-white p-4">
                        <div className="text-sm font-medium text-slate-900">
                          Gestion centralizada
                        </div>
                      </div>
                    </div>
                    <div className="rounded-[26px] border border-blue-200 bg-blue-50 p-4 shadow-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-md">
                      <p className="text-xs font-medium uppercase tracking-[0.22em] text-blue-500">
                        Calendario
                      </p>
                      <div className="mt-5 rounded-[20px] bg-white/85 p-4">
                        <div className="text-sm font-medium text-slate-900">
                          Agenda y recesos
                        </div>
                      </div>
                    </div>
                    <div className="rounded-[26px] border border-emerald-200 bg-emerald-50 p-4 shadow-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-md">
                      <p className="text-xs font-medium uppercase tracking-[0.22em] text-emerald-600">
                        Drive
                      </p>
                      <div className="mt-5 rounded-[20px] bg-white/85 p-4">
                        <div className="text-sm font-medium text-slate-900">
                          Material organizado
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-4 shadow-sm">
                    <div className="space-y-3">
                      <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-400">
                        Accesos
                      </p>
                      <div className="rounded-2xl bg-white px-4 py-3 text-sm font-medium text-slate-700">
                        Clases de hoy
                      </div>
                      <div className="rounded-2xl bg-white px-4 py-3 text-sm font-medium text-slate-700">
                        Bitacora
                      </div>
                      <div className="rounded-2xl bg-white px-4 py-3 text-sm font-medium text-slate-700">
                        Evaluaciones
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="space-y-4">
                      <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-400">
                        Operacion diaria
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-[22px] bg-slate-50 p-4">
                          <div className="text-sm font-medium text-slate-900">
                            Instituciones
                          </div>
                        </div>
                        <div className="rounded-[22px] bg-slate-50 p-4">
                          <div className="text-sm font-medium text-slate-900">
                            Pensum
                          </div>
                        </div>
                      </div>
                      <div className="rounded-[24px] bg-slate-50 p-5">
                        <div className="text-sm font-medium text-slate-900">
                          Examenes con IA y documentos listos para compartir.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
