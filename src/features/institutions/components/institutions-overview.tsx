"use client";

import {
  Building2,
  Clock3,
  LayoutGrid,
  MapPinned,
  Pencil,
  Rows3,
  Search,
  Trash2,
  Wallet,
} from "lucide-react";
import { useMemo, useState } from "react";
import { CreateInstitutionForm } from "@/features/institutions/components/create-institution-form";
import { CreateLocationForm } from "@/features/institutions/components/create-location-form";
import { useDeleteInstitution } from "@/features/institutions/hooks/use-delete-institution";
import { useDeleteLocation } from "@/features/institutions/hooks/use-delete-location";
import type { InstitutionFormValues } from "@/features/institutions/validations/institution-schema";
import type { LocationFormValues } from "@/features/institutions/validations/location-schema";
import { Button } from "@/shared/components/ui/button";
import { Modal } from "@/shared/components/ui/modal";
import { cn } from "@/shared/utils/cn";

type InstitutionItem = {
  _count: {
    cohorts: number;
    locations: number;
  };
  id: string;
  minutesPerHour: number;
  name: string;
  paymentType: "HOURLY" | "FIXED_SALARY";
  periodType: "SEMESTER" | "TRIMESTER";
};

type LocationItem = {
  _count: {
    cohorts: number;
    studyPlans: number;
  };
  address: string | null;
  code: string | null;
  id: string;
  institution: {
    id: string;
    name: string;
  };
  name: string;
};

type InstitutionsOverviewProps = {
  institutionOptions: Array<{
    id: string;
    name: string;
  }>;
  institutions: InstitutionItem[];
  locations: LocationItem[];
};

type ViewMode = "cards" | "table";
type InstitutionPaymentFilter = "ALL" | InstitutionItem["paymentType"];
type InstitutionPeriodFilter = "ALL" | InstitutionItem["periodType"];
type GroupedInstitutionItem = {
  institution: InstitutionItem;
  locations: LocationItem[];
};

type DeleteTarget =
  | {
      id: string;
      name: string;
      type: "institution";
    }
  | {
      id: string;
      name: string;
      type: "location";
    };

const ALL_TAB = "all";

function getPeriodLabel(periodType: InstitutionItem["periodType"]) {
  return periodType === "SEMESTER" ? "Semestral" : "Trimestral";
}

function getPaymentLabel(paymentType: InstitutionItem["paymentType"]) {
  return paymentType === "HOURLY" ? "Pago por horas" : "Salario fijo";
}

function getInstitutionTone(periodType: InstitutionItem["periodType"]) {
  if (periodType === "TRIMESTER") {
    return {
      accent: "bg-emerald-500",
      muted: "bg-emerald-50 text-emerald-700",
      soft: "border-emerald-100 bg-emerald-50/70",
    };
  }

  return {
    accent: "bg-blue-500",
    muted: "bg-blue-50 text-blue-700",
    soft: "border-blue-100 bg-blue-50/70",
  };
}

function getInstitutionInitialValues(
  institution: InstitutionItem,
): InstitutionFormValues {
  return {
    minutesPerHour: institution.minutesPerHour as 45 | 60,
    name: institution.name,
    paymentType: institution.paymentType,
    periodType: institution.periodType,
  };
}

function getLocationInitialValues(location: LocationItem): LocationFormValues {
  return {
    address: location.address ?? "",
    code: location.code ?? "",
    institutionId: location.institution.id,
    name: location.name,
  };
}

function ToolbarSelect({
  children,
  className,
  label,
  value,
  onChange,
}: {
  children: React.ReactNode;
  className?: string;
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <div className="flex w-full flex-col gap-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <select
        aria-label={label}
        className={cn(
          "h-11 w-full rounded-xl border border-slate-100 bg-slate-50 px-4 text-sm text-slate-700 shadow-sm outline-none transition-all duration-200 ease-out",
          "focus-visible:border-blue-200 focus-visible:bg-white",
          className,
        )}
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {children}
      </select>
    </div>
  );
}

function ToolbarSearchField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex w-full flex-col gap-2">
      <span className="text-sm font-medium text-slate-700">Buscar</span>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          aria-label="Buscar instituciones o sedes"
          className="h-11 w-full rounded-xl border border-slate-100 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus-visible:border-blue-200 focus-visible:bg-white focus-visible:outline-none"
          onChange={(event) => onChange(event.target.value)}
          placeholder="Buscar por nombre, codigo o institucion"
          type="text"
          value={value}
        />
      </div>
    </div>
  );
}

function getLocationChipTone(index: number) {
  if (index % 3 === 0) {
    return "bg-blue-50 text-blue-700 ring-blue-100";
  }

  if (index % 3 === 1) {
    return "bg-emerald-50 text-emerald-700 ring-emerald-100";
  }

  return "bg-amber-50 text-amber-700 ring-amber-100";
}

function ActionIconButton({
  children,
  onClick,
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
}) {
  return (
    <button
      className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition-all duration-200 ease-out hover:bg-slate-100 hover:text-slate-900"
      onClick={onClick}
      title={title}
      type="button"
    >
      {children}
    </button>
  );
}

export function InstitutionsOverview({
  institutionOptions,
  institutions,
  locations,
}: InstitutionsOverviewProps) {
  const [activeTab, setActiveTab] = useState<string>(ALL_TAB);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [editingInstitution, setEditingInstitution] =
    useState<InstitutionItem | null>(null);
  const [editingLocation, setEditingLocation] = useState<LocationItem | null>(
    null,
  );
  const [paymentFilter, setPaymentFilter] =
    useState<InstitutionPaymentFilter>("ALL");
  const [periodFilter, setPeriodFilter] =
    useState<InstitutionPeriodFilter>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const { isDeleting: isDeletingInstitution, removeInstitution } =
    useDeleteInstitution({
      onSuccess: () => setDeleteTarget(null),
    });
  const { isDeleting: isDeletingLocation, removeLocation } = useDeleteLocation({
    onSuccess: () => setDeleteTarget(null),
  });
  const isDeleting = isDeletingInstitution || isDeletingLocation;
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const selectedInstitutionId = activeTab === ALL_TAB ? null : activeTab;
  const selectedInstitution = selectedInstitutionId
    ? institutions.find((institution) => institution.id === selectedInstitutionId) ?? null
    : null;
  const hasFiltersApplied =
    normalizedSearchQuery.length > 0 ||
    paymentFilter !== "ALL" ||
    periodFilter !== "ALL";
  const groupedInstitutions = useMemo(() => {
    const candidateInstitutions = institutions.filter((institution) => {
      const matchesActiveTab =
        selectedInstitutionId === null || institution.id === selectedInstitutionId;
      const matchesPayment =
        paymentFilter === "ALL" || institution.paymentType === paymentFilter;
      const matchesPeriod =
        periodFilter === "ALL" || institution.periodType === periodFilter;

      return matchesActiveTab && matchesPayment && matchesPeriod;
    });

    return candidateInstitutions
      .map((institution) => {
        const institutionMatchesSearch =
          normalizedSearchQuery.length === 0 ||
          institution.name.toLowerCase().includes(normalizedSearchQuery) ||
          getPaymentLabel(institution.paymentType)
            .toLowerCase()
            .includes(normalizedSearchQuery) ||
          getPeriodLabel(institution.periodType)
            .toLowerCase()
            .includes(normalizedSearchQuery);

        const institutionLocations = locations.filter((location) => {
          if (location.institution.id !== institution.id) {
            return false;
          }

          return (
            normalizedSearchQuery.length === 0 ||
            location.name.toLowerCase().includes(normalizedSearchQuery) ||
            location.institution.name.toLowerCase().includes(normalizedSearchQuery) ||
            location.code?.toLowerCase().includes(normalizedSearchQuery) ||
            location.address?.toLowerCase().includes(normalizedSearchQuery)
          );
        });

        if (!institutionMatchesSearch && institutionLocations.length === 0) {
          return null;
        }

        return {
          institution,
          locations: institutionLocations,
        };
      })
      .filter((item): item is GroupedInstitutionItem => item !== null);
  }, [
    institutions,
    locations,
    normalizedSearchQuery,
    paymentFilter,
    periodFilter,
    selectedInstitutionId,
  ]);

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    if (deleteTarget.type === "institution") {
      if (selectedInstitutionId === deleteTarget.id) {
        setActiveTab(ALL_TAB);
      }

      await removeInstitution(deleteTarget.id);
      return;
    }

    await removeLocation(deleteTarget.id);
  };

  const handleResetFilters = () => {
    setPaymentFilter("ALL");
    setPeriodFilter("ALL");
    setSearchQuery("");
  };

  const createLocationInitialValues = selectedInstitution
    ? {
        address: "",
        code: "",
        institutionId: selectedInstitution.id,
        name: "",
      }
    : undefined;

  return (
    <>
      <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
      <div className="flex flex-col gap-4 border-b border-slate-200 bg-slate-50/80 px-4 py-4 sm:px-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ease-out",
                activeTab === ALL_TAB
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100",
              )}
              onClick={() => setActiveTab(ALL_TAB)}
              type="button"
            >
              Todas
            </button>
            {institutions.map((institution) => {
              return (
                <button
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ease-out",
                    activeTab === institution.id
                      ? cn(
                          "text-white shadow-sm",
                          institution.periodType === "TRIMESTER"
                            ? "bg-emerald-600"
                            : "bg-blue-600",
                        )
                      : cn(
                          "bg-white text-slate-600 ring-1 ring-slate-200",
                          institution.periodType === "TRIMESTER"
                            ? "hover:bg-emerald-50 hover:text-emerald-700"
                            : "hover:bg-blue-50 hover:text-blue-700",
                        ),
                  )}
                  key={institution.id}
                  onClick={() => setActiveTab(institution.id)}
                  type="button"
                >
                  {institution.name}
                </button>
              );
            })}
          </div>

          <div className="inline-flex rounded-full bg-white p-1 ring-1 ring-slate-200">
            <button
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-all duration-200 ease-out",
                viewMode === "cards"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100",
              )}
              onClick={() => setViewMode("cards")}
              type="button"
            >
              <LayoutGrid className="h-4 w-4" />
              Cards
            </button>
            <button
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-all duration-200 ease-out",
                viewMode === "table"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100",
              )}
              onClick={() => setViewMode("table")}
              type="button"
            >
              <Rows3 className="h-4 w-4" />
              Tabla
            </button>
          </div>
        </div>

        <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_220px_220px_auto] xl:items-end">
          <div className="min-w-0">
            <ToolbarSearchField
              onChange={(value) => setSearchQuery(value)}
              value={searchQuery}
            />
          </div>

          <ToolbarSelect
            className="xl:w-[220px]"
            label="Filtrar instituciones por tipo de pago"
            onChange={(value) =>
              setPaymentFilter(value as InstitutionPaymentFilter)
            }
            value={paymentFilter}
          >
            <option value="ALL">Todo pago</option>
            <option value="HOURLY">Por horas</option>
            <option value="FIXED_SALARY">Salario fijo</option>
          </ToolbarSelect>

          <ToolbarSelect
            className="xl:w-[220px]"
            label="Filtrar instituciones por periodo"
            onChange={(value) =>
              setPeriodFilter(value as InstitutionPeriodFilter)
            }
            value={periodFilter}
          >
            <option value="ALL">Todo periodo</option>
            <option value="SEMESTER">Semestral</option>
            <option value="TRIMESTER">Trimestral</option>
          </ToolbarSelect>

          <Button
            className="xl:min-w-[148px]"
            onClick={handleResetFilters}
            type="button"
            variant="secondary"
          >
            Limpiar filtros
          </Button>
        </div>
      </div>

      <div className="grid gap-0 xl:grid-cols-[380px_minmax(0,1fr)]">
        <div className="border-b border-slate-200 bg-slate-50/50 p-4 sm:p-5 xl:border-b-0 xl:border-r">
          <div className="space-y-5">
            {activeTab === ALL_TAB ? (
              <div className="rounded-[22px] border border-blue-100 bg-blue-50/70 p-4">
                <div className="mb-4 flex items-center gap-2 text-sm font-medium text-blue-700">
                  <Building2 className="h-4 w-4" />
                  Instituciones
                </div>
                <CreateInstitutionForm />
              </div>
            ) : null}

            {institutionOptions.length > 0 ? (
              <div className="rounded-[22px] border border-emerald-100 bg-emerald-50/70 p-4">
                <div className="mb-4 flex items-center gap-2 text-sm font-medium text-emerald-700">
                  <MapPinned className="h-4 w-4" />
                  {selectedInstitution ? `Sedes de ${selectedInstitution.name}` : "Sedes"}
                </div>
                <CreateLocationForm
                  initialValues={createLocationInitialValues}
                  institutions={institutionOptions}
                />
              </div>
            ) : null}
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <div className="space-y-6">
            {groupedInstitutions.length === 0 ? (
              <div className="rounded-[20px] border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-sm text-slate-500">
                {hasFiltersApplied
                  ? "No hay instituciones o sedes que coincidan con tu busqueda o filtros."
                  : "Sin instituciones registradas."}
              </div>
            ) : (
              groupedInstitutions.map((group) => {
                const { institution, locations: institutionLocations } = group;
                const tone = getInstitutionTone(institution.periodType);

                return (
                  <section
                    className="space-y-4 rounded-[24px] border border-slate-200 bg-slate-50/40 p-4 sm:p-5"
                    key={institution.id}
                  >
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <Building2 className="h-4 w-4 text-blue-600" />
                      {institution.name}
                    </div>

                    {viewMode === "cards" ? (
                      <article className="rounded-[22px] border border-slate-200 bg-white p-4 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_16px_35px_rgba(15,23,42,0.06)]">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span
                                className={cn("h-2 w-2 rounded-full", tone.accent)}
                              />
                              <h3 className="truncate text-lg font-semibold tracking-tight text-slate-900">
                                {institution.name}
                              </h3>
                            </div>
                          </div>
                          <span
                            className={cn(
                              "rounded-full px-2.5 py-1 text-xs font-medium ring-1",
                              tone.soft,
                            )}
                          >
                            {getPeriodLabel(institution.periodType)}
                          </span>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2 text-xs">
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-slate-700 ring-1 ring-slate-200">
                            <Clock3 className="h-3.5 w-3.5" />
                            {institution.minutesPerHour} min
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-slate-700 ring-1 ring-slate-200">
                            <Wallet className="h-3.5 w-3.5" />
                            {getPaymentLabel(institution.paymentType)}
                          </span>
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700 ring-1 ring-slate-200">
                            {institution._count.locations} sedes
                          </span>
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700 ring-1 ring-slate-200">
                            {institution._count.cohorts} cohortes
                          </span>
                        </div>

                        <div className="mt-4 flex items-center justify-end gap-2">
                          <ActionIconButton
                            onClick={() => setEditingInstitution(institution)}
                            title="Editar institucion"
                          >
                            <Pencil className="h-4 w-4" />
                          </ActionIconButton>
                          <ActionIconButton
                            onClick={() =>
                              setDeleteTarget({
                                id: institution.id,
                                name: institution.name,
                                type: "institution",
                              })
                            }
                            title="Eliminar institucion"
                          >
                            <Trash2 className="h-4 w-4 text-rose-600" />
                          </ActionIconButton>
                        </div>
                      </article>
                    ) : (
                      <div className="overflow-hidden rounded-[20px] border border-slate-200">
                        <table className="min-w-full divide-y divide-slate-200 text-sm">
                          <thead className="bg-slate-50 text-left text-slate-500">
                            <tr>
                              <th className="px-4 py-3 font-medium">Institucion</th>
                              <th className="px-4 py-3 font-medium">Periodo</th>
                              <th className="px-4 py-3 font-medium">Regla</th>
                              <th className="px-4 py-3 font-medium">Pago</th>
                              <th className="px-4 py-3 font-medium">Sedes</th>
                              <th className="px-4 py-3 font-medium text-right">Acciones</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 bg-white">
                            <tr className="transition-colors duration-200 ease-out hover:bg-slate-50/80">
                              <td className="px-4 py-3 font-medium text-slate-900">
                                {institution.name}
                              </td>
                              <td className="px-4 py-3 text-slate-600">
                                {getPeriodLabel(institution.periodType)}
                              </td>
                              <td className="px-4 py-3 text-slate-600">
                                {institution.minutesPerHour} min
                              </td>
                              <td className="px-4 py-3 text-slate-600">
                                {getPaymentLabel(institution.paymentType)}
                              </td>
                              <td className="px-4 py-3 text-slate-600">
                                {institution._count.locations}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex justify-end gap-2">
                                  <ActionIconButton
                                    onClick={() => setEditingInstitution(institution)}
                                    title="Editar institucion"
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </ActionIconButton>
                                  <ActionIconButton
                                    onClick={() =>
                                      setDeleteTarget({
                                        id: institution.id,
                                        name: institution.name,
                                        type: "institution",
                                      })
                                    }
                                    title="Eliminar institucion"
                                  >
                                    <Trash2 className="h-4 w-4 text-rose-600" />
                                  </ActionIconButton>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                        <MapPinned className="h-4 w-4 text-emerald-600" />
                        Sedes
                      </div>

                      {institutionLocations.length === 0 ? (
                        <div className="rounded-[20px] border border-dashed border-slate-200 bg-white px-4 py-8 text-sm text-slate-500">
                          Sin sedes registradas para esta institucion.
                        </div>
                      ) : viewMode === "cards" ? (
                        <div className="grid gap-3 md:grid-cols-2">
                          {institutionLocations.map((location, index) => (
                            <article
                              className="rounded-[22px] border border-slate-200 bg-white p-4 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_16px_35px_rgba(15,23,42,0.06)]"
                              key={location.id}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                    <h3 className="truncate text-lg font-semibold tracking-tight text-slate-900">
                                      {location.name}
                                    </h3>
                                  </div>
                                  <p className="mt-1 text-sm text-slate-500">
                                    {location.institution.name}
                                  </p>
                                </div>
                                {location.code ? (
                                  <span
                                    className={cn(
                                      "rounded-full px-2.5 py-1 text-xs font-medium ring-1",
                                      getLocationChipTone(index),
                                    )}
                                  >
                                    {location.code}
                                  </span>
                                ) : null}
                              </div>

                              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700 ring-1 ring-slate-200">
                                  {location._count.studyPlans} planes
                                </span>
                                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700 ring-1 ring-slate-200">
                                  {location._count.cohorts} cohortes
                                </span>
                              </div>

                              <div className="mt-4 flex items-center justify-end gap-2">
                                <ActionIconButton
                                  onClick={() => setEditingLocation(location)}
                                  title="Editar sede"
                                >
                                  <Pencil className="h-4 w-4" />
                                </ActionIconButton>
                                <ActionIconButton
                                  onClick={() =>
                                    setDeleteTarget({
                                      id: location.id,
                                      name: location.name,
                                      type: "location",
                                    })
                                  }
                                  title="Eliminar sede"
                                >
                                  <Trash2 className="h-4 w-4 text-rose-600" />
                                </ActionIconButton>
                              </div>
                            </article>
                          ))}
                        </div>
                      ) : (
                        <div className="overflow-hidden rounded-[20px] border border-slate-200">
                          <table className="min-w-full divide-y divide-slate-200 text-sm">
                            <thead className="bg-slate-50 text-left text-slate-500">
                              <tr>
                                <th className="px-4 py-3 font-medium">Sede</th>
                                <th className="px-4 py-3 font-medium">Codigo</th>
                                <th className="px-4 py-3 font-medium">Planes</th>
                                <th className="px-4 py-3 font-medium">Cohortes</th>
                                <th className="px-4 py-3 font-medium text-right">Acciones</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white">
                              {institutionLocations.map((location) => (
                                <tr
                                  className="transition-colors duration-200 ease-out hover:bg-slate-50/80"
                                  key={location.id}
                                >
                                  <td className="px-4 py-3 font-medium text-slate-900">
                                    {location.name}
                                  </td>
                                  <td className="px-4 py-3 text-slate-600">
                                    {location.code ?? "-"}
                                  </td>
                                  <td className="px-4 py-3 text-slate-600">
                                    {location._count.studyPlans}
                                  </td>
                                  <td className="px-4 py-3 text-slate-600">
                                    {location._count.cohorts}
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="flex justify-end gap-2">
                                      <ActionIconButton
                                        onClick={() => setEditingLocation(location)}
                                        title="Editar sede"
                                      >
                                        <Pencil className="h-4 w-4" />
                                      </ActionIconButton>
                                      <ActionIconButton
                                        onClick={() =>
                                          setDeleteTarget({
                                            id: location.id,
                                            name: location.name,
                                            type: "location",
                                          })
                                        }
                                        title="Eliminar sede"
                                      >
                                        <Trash2 className="h-4 w-4 text-rose-600" />
                                      </ActionIconButton>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </section>
                );
              })
            )}
          </div>
        </div>
      </div>
      </section>

      <Modal
        description="Actualiza la informacion de la institucion."
        isOpen={Boolean(editingInstitution)}
        onClose={() => setEditingInstitution(null)}
        title="Editar institucion"
      >
        {editingInstitution ? (
          <CreateInstitutionForm
            initialValues={getInstitutionInitialValues(editingInstitution)}
            institutionId={editingInstitution.id}
            mode="edit"
            onSuccess={() => setEditingInstitution(null)}
            submitLabel="Guardar cambios"
          />
        ) : null}
      </Modal>

      <Modal
        description="Actualiza la informacion de la sede."
        isOpen={Boolean(editingLocation)}
        onClose={() => setEditingLocation(null)}
        title="Editar sede"
      >
        {editingLocation ? (
          <CreateLocationForm
            initialValues={getLocationInitialValues(editingLocation)}
            institutions={institutionOptions}
            locationId={editingLocation.id}
            mode="edit"
            onSuccess={() => setEditingLocation(null)}
            submitLabel="Guardar cambios"
          />
        ) : null}
      </Modal>

      <Modal
        description={
          deleteTarget?.type === "institution"
            ? "Esta accion elimina tambien las sedes relacionadas a esta institucion."
            : "Esta accion elimina la sede seleccionada."
        }
        footer={
          <>
            <Button onClick={() => setDeleteTarget(null)} type="button" variant="secondary">
              Cancelar
            </Button>
            <Button
              className="bg-rose-600 text-white hover:bg-rose-700"
              disabled={isDeleting}
              onClick={() => void handleDelete()}
              type="button"
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </Button>
          </>
        }
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title={deleteTarget ? `Eliminar ${deleteTarget.name}` : "Eliminar"}
      >
        <p className="text-sm leading-6 text-slate-600">
          Confirma si deseas eliminar este registro de tu cuenta.
        </p>
      </Modal>
    </>
  );
}
