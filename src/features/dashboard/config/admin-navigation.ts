import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Building2,
  Calendar,
  LayoutGrid,
  Settings,
  Users,
} from "lucide-react";

export type AdminNavigationItem = {
  description: string;
  href: string;
  icon: LucideIcon;
  label: string;
};

export const adminNavigationItems: AdminNavigationItem[] = [
  {
    href: "/dashboard",
    icon: LayoutGrid,
    label: "Dashboard",
    description: "Vista general y punto de entrada del panel.",
  },
  {
    href: "/dashboard/grupos",
    icon: Users,
    label: "Mis grupos",
    description: "Gestiona grupos activos, seguimiento y acciones clave.",
  },
  {
    href: "/dashboard/calendario",
    icon: Calendar,
    label: "Calendario",
    description: "Organiza agenda, recesos y recuperaciones.",
  },
  {
    href: "/dashboard/pensum",
    icon: BookOpen,
    label: "Pensum",
    description: "Centraliza materias y planes de estudio.",
  },
  {
    href: "/dashboard/instituciones",
    icon: Building2,
    label: "Instituciones",
    description: "Administra instituciones, sedes y reglas operativas.",
  },
  {
    href: "/dashboard/configuracion",
    icon: Settings,
    label: "Configuracion",
    description: "Ajusta preferencias, conexiones y cuenta.",
  },
];
