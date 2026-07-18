import * as XLSX from "xlsx";
import {
  studyPlanImportSchema,
  type StudyPlanImportItem,
  type StudyPlanImportPayload,
} from "@/features/pensum/validations/study-plan-import-schema";

export type SupportedStudyPlanImportFormat = "JSON" | "XLSX" | "MARKDOWN";

type SpreadsheetRow = Record<string, unknown>;

type SofiaTimelinePeriod = {
  name: string;
  outcomes: Array<{
    id: string;
    label?: string;
  }>;
};

const spreadsheetHeaderAliases: Record<string, string> = {
  alias: "alias_name",
  aliasname: "alias_name",
  corecontentname: "core_content_name",
  institutionname: "institution_name",
  itemcode: "item_code",
  itemdescription: "item_description",
  itemorder: "item_order",
  itemtitle: "item_title",
  itemtype: "item_type",
  locationname: "location_name",
  outcomecode: "outcome_code",
  outcomedescription: "outcome_description",
  periodname: "period_name",
  periodorder: "period_order",
  planname: "alias_name",
  source_slug: "source_slug",
  sourceType: "source_type",
  structuretype: "structure_type",
};

function normalizeSpreadsheetHeader(value: string) {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  return spreadsheetHeaderAliases[normalized] ?? normalized;
}

function toPositiveNumber(value: unknown, fallback: number) {
  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string" && value.trim().length > 0
        ? Number(value)
        : Number.NaN;

  return Number.isFinite(parsed) && parsed > 0 ? Math.trunc(parsed) : fallback;
}

function toOptionalString(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function splitOutcomeValue(rawValue: string) {
  const normalizedValue = rawValue.trim();
  const match = normalizedValue.match(/^(.+?)\s{2,}(.*)$/);

  if (!match) {
    return {
      code: null,
      description: normalizedValue,
    };
  }

  return {
    code: match[1]?.trim() ?? null,
    description: match[2]?.trim() ?? normalizedValue,
  };
}

function createDefaultStudyPlanItem(title: string): StudyPlanImportItem {
  return {
    itemType: "SUBJECT",
    outcomes: [],
    title,
  };
}

function normalizeImportedPlans(
  plans: StudyPlanImportPayload[],
  sourceType: SupportedStudyPlanImportFormat,
) {
  return plans.map((plan) =>
    studyPlanImportSchema.parse({
      ...plan,
      sourceType,
    }),
  );
}

function parseCanonicalJsonPayload(payload: unknown) {
  if (Array.isArray(payload)) {
    return payload.map((plan) => studyPlanImportSchema.parse(plan));
  }

  if (payload && typeof payload === "object") {
    const maybePlans = payload as { plans?: unknown; type?: string; periods?: unknown };

    if (maybePlans.type === "sofia-timeline" && Array.isArray(maybePlans.periods)) {
      return [transformSenaTimelineToCanonical(maybePlans.periods as SofiaTimelinePeriod[])];
    }

    if (Array.isArray(maybePlans.plans)) {
      return maybePlans.plans.map((plan) => studyPlanImportSchema.parse(plan));
    }

    return [studyPlanImportSchema.parse(payload)];
  }

  throw new Error("El archivo JSON no tiene una estructura valida.");
}

function transformSenaTimelineToCanonical(periods: SofiaTimelinePeriod[]) {
  return studyPlanImportSchema.parse({
    aliasName: "ADSO SENA",
    coreContentName: "Analisis y Desarrollo de Software",
    institutionName: "SENA",
    locationName: "General",
    metadata: {
      source: "Sofia timeline",
    },
    periods: periods.map((period, periodIndex) => {
      const groupedItems = new Map<
        string,
        {
          outcomes: Array<{
            code: string | null;
            description: string;
          }>;
          title: string;
        }
      >();

      period.outcomes.forEach((outcome) => {
        const itemTitle = outcome.label?.trim() || "Sin etiqueta";
        const item = groupedItems.get(itemTitle) ?? {
          outcomes: [],
          title: itemTitle,
        };

        item.outcomes.push(splitOutcomeValue(outcome.id));
        groupedItems.set(itemTitle, item);
      });

      return {
        items: Array.from(groupedItems.values()).map((item) => ({
          itemType: "OUTCOME_GROUP",
          outcomes: item.outcomes,
          title: item.title,
        })),
        name: period.name.trim(),
        order: periodIndex + 1,
      };
    }),
    sourceSlug: "imported-sena-json",
    structureType: "TRIMESTERS",
  });
}

function parseMarkdownMetadataLine(line: string) {
  const separatorIndex = line.indexOf(":");

  if (separatorIndex === -1) {
    return null;
  }

  const key = line.slice(0, separatorIndex).trim().toLowerCase();
  const value = line.slice(separatorIndex + 1).trim();

  if (!value) {
    return null;
  }

  return { key, value };
}

function parseMarkdownPlan(markdown: string) {
  const lines = markdown
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  let aliasName = "";
  let coreContentName = "";
  let institutionName = "";
  let locationName = "";
  let structureType: StudyPlanImportPayload["structureType"] = "CUSTOM";
  const periods: Array<{
    items: StudyPlanImportItem[];
    name: string;
    order: number;
  }> = [];

  let currentPeriod: (typeof periods)[number] | null = null;
  let currentItem: StudyPlanImportItem | null = null;

  lines.forEach((line) => {
    if (line.startsWith("# ")) {
      aliasName = line.replace(/^#\s*/, "").replace(/^Plan\s*:\s*/i, "").trim();
      return;
    }

    if (line.startsWith("## ")) {
      currentPeriod = {
        items: [],
        name: line.replace(/^##\s*/, "").trim(),
        order: periods.length + 1,
      };
      periods.push(currentPeriod);
      currentItem = null;
      return;
    }

    if (line.startsWith("### ")) {
      if (!currentPeriod) {
        throw new Error("El Markdown debe definir un periodo antes de los items.");
      }

      currentItem = {
        itemType: "OUTCOME_GROUP",
        outcomes: [],
        title: line.replace(/^###\s*/, "").trim(),
      };
      currentPeriod.items.push(currentItem);
      return;
    }

    if (line.startsWith("- ")) {
      if (!currentPeriod) {
        throw new Error("El Markdown debe definir un periodo antes de los items.");
      }

      const bulletValue = line.replace(/^-+\s*/, "").trim();

      if (currentItem) {
        currentItem.outcomes = [
          ...(currentItem.outcomes ?? []),
          splitOutcomeValue(bulletValue),
        ];
        return;
      }

      currentPeriod.items.push(createDefaultStudyPlanItem(bulletValue));
      return;
    }

    const parsedMetadata = parseMarkdownMetadataLine(line);

    if (!parsedMetadata) {
      return;
    }

    switch (parsedMetadata.key) {
      case "institution":
      case "institucion":
        institutionName = parsedMetadata.value;
        break;
      case "location":
      case "sede":
        locationName = parsedMetadata.value;
        break;
      case "core content":
      case "contenido base":
        coreContentName = parsedMetadata.value;
        break;
      case "structure":
      case "estructura":
        if (
          parsedMetadata.value === "LEVELS" ||
          parsedMetadata.value === "TRIMESTERS" ||
          parsedMetadata.value === "CUSTOM"
        ) {
          structureType = parsedMetadata.value;
        }
        break;
      default:
        break;
    }
  });

  return studyPlanImportSchema.parse({
    aliasName,
    coreContentName,
    institutionName,
    locationName,
    periods,
    sourceType: "MARKDOWN",
    structureType,
  });
}

function parseSpreadsheetPlanRows(rows: SpreadsheetRow[]) {
  const normalizedRows = rows.map((row) => {
    const normalizedRow = Object.fromEntries(
      Object.entries(row).map(([key, value]) => [normalizeSpreadsheetHeader(key), value]),
    );

    return normalizedRow;
  });

  const planMap = new Map<
    string,
    {
      aliasName: string;
      coreContentName: string;
      institutionName: string;
      locationName: string;
      periods: Map<
        string,
        {
          items: Map<
            string,
            StudyPlanImportItem & {
              order: number;
            }
          >;
          name: string;
          order: number;
        }
      >;
      sourceSlug?: string;
      structureType: StudyPlanImportPayload["structureType"];
    }
  >();

  normalizedRows.forEach((row) => {
    const institutionName = toOptionalString(row.institution_name);
    const locationName = toOptionalString(row.location_name);
    const coreContentName = toOptionalString(row.core_content_name);
    const aliasName = toOptionalString(row.alias_name);
    const periodName = toOptionalString(row.period_name);
    const itemTitle = toOptionalString(row.item_title);

    if (
      !institutionName ||
      !locationName ||
      !coreContentName ||
      !aliasName ||
      !periodName ||
      !itemTitle
    ) {
      return;
    }

    const structureValue = toOptionalString(row.structure_type);
    const structureType =
      structureValue === "LEVELS" ||
      structureValue === "TRIMESTERS" ||
      structureValue === "CUSTOM"
        ? structureValue
        : "CUSTOM";
    const planKey = [institutionName, locationName, aliasName].join("::");
    const plan =
      planMap.get(planKey) ??
      {
        aliasName,
        coreContentName,
        institutionName,
        locationName,
        periods: new Map(),
        sourceSlug: toOptionalString(row.source_slug) ?? undefined,
        structureType,
      };

    const periodOrder = toPositiveNumber(row.period_order, plan.periods.size + 1);
    const periodKey = `${periodOrder}::${periodName}`;
    const period =
      plan.periods.get(periodKey) ??
      {
        items: new Map(),
        name: periodName,
        order: periodOrder,
      };

    const itemOrder = toPositiveNumber(row.item_order, period.items.size + 1);
    const itemKey = `${itemOrder}::${itemTitle}`;
    const currentItem =
      period.items.get(itemKey) ??
      {
        code: toOptionalString(row.item_code),
        description: toOptionalString(row.item_description),
        itemType:
          toOptionalString(row.item_type) === "MODULE" ||
          toOptionalString(row.item_type) === "OUTCOME_GROUP" ||
          toOptionalString(row.item_type) === "MILESTONE" ||
          toOptionalString(row.item_type) === "OTHER"
            ? (toOptionalString(row.item_type) as StudyPlanImportItem["itemType"])
            : "SUBJECT",
        order: itemOrder,
        outcomes: [],
        title: itemTitle,
      };

    const outcomeDescription = toOptionalString(row.outcome_description);
    if (outcomeDescription) {
      currentItem.outcomes = [
        ...(currentItem.outcomes ?? []),
        {
          code: toOptionalString(row.outcome_code),
          description: outcomeDescription,
        },
      ];
    }

    period.items.set(itemKey, currentItem);
    plan.periods.set(periodKey, period);
    planMap.set(planKey, plan);
  });

  return Array.from(planMap.values()).map((plan) =>
    studyPlanImportSchema.parse({
      aliasName: plan.aliasName,
      coreContentName: plan.coreContentName,
      institutionName: plan.institutionName,
      locationName: plan.locationName,
      periods: Array.from(plan.periods.values())
        .sort((first, second) => first.order - second.order)
        .map((period) => ({
          items: Array.from(period.items.values())
            .sort((first, second) => first.order - second.order)
            .map((item) => ({
              ...item,
            })),
          name: period.name,
          order: period.order,
        })),
      sourceSlug: plan.sourceSlug,
      structureType: plan.structureType,
    }),
  );
}

export function parseStudyPlanJsonText(jsonText: string) {
  const parsed = JSON.parse(jsonText) as unknown;
  return normalizeImportedPlans(parseCanonicalJsonPayload(parsed), "JSON");
}

export function parseStudyPlanMarkdown(markdownText: string) {
  return normalizeImportedPlans([parseMarkdownPlan(markdownText)], "MARKDOWN");
}

export function parseStudyPlanWorkbook(arrayBuffer: ArrayBuffer) {
  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  const sheetName = workbook.SheetNames.includes("plan_items")
    ? "plan_items"
    : workbook.SheetNames[0];

  if (!sheetName) {
    throw new Error("El archivo Excel no contiene hojas para procesar.");
  }

  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<SpreadsheetRow>(sheet, {
    defval: "",
  });

  return normalizeImportedPlans(parseSpreadsheetPlanRows(rows), "XLSX");
}

export async function parseStudyPlansFromFile(file: File) {
  const fileName = file.name.toLowerCase();

  if (fileName.endsWith(".json")) {
    return parseStudyPlanJsonText(await file.text());
  }

  if (fileName.endsWith(".md") || fileName.endsWith(".markdown") || fileName.endsWith(".txt")) {
    return parseStudyPlanMarkdown(await file.text());
  }

  if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
    return parseStudyPlanWorkbook(await file.arrayBuffer());
  }

  throw new Error("Formato no soportado. Usa JSON, Markdown o Excel.");
}

export const studyPlanJsonTemplate = JSON.stringify(
  {
    aliasName: "Desarrollo de Software CESDE Medellin",
    coreContentName: "Desarrollo de Software",
    institutionName: "CESDE",
    locationName: "Medellin",
    periods: [
      {
        items: [
          { title: "Logica de Programacion" },
          { title: "Introduccion a la Programacion" },
        ],
        name: "Nivel 1",
        order: 1,
      },
    ],
    structureType: "LEVELS",
  },
  null,
  2,
);

export const studyPlanMarkdownTemplate = `# Plan: Desarrollo de Software CESDE Medellin
Institucion: CESDE
Sede: Medellin
Contenido Base: Desarrollo de Software
Estructura: LEVELS

## Nivel 1
- Logica de Programacion
- Introduccion a la Programacion

## Nivel 2
- Backend I (Lenguaje)
- Frontend I (Lenguaje)
`;

export function buildStudyPlanWorkbookTemplate() {
  const rows = [
    {
      alias_name: "Desarrollo de Software CESDE Medellin",
      core_content_name: "Desarrollo de Software",
      institution_name: "CESDE",
      location_name: "Medellin",
      structure_type: "LEVELS",
      period_order: 1,
      period_name: "Nivel 1",
      item_order: 1,
      item_title: "Logica de Programacion",
      item_type: "SUBJECT",
      item_code: "",
      item_description: "",
      outcome_code: "",
      outcome_description: "",
      source_slug: "",
    },
    {
      alias_name: "ADSO SENA",
      core_content_name: "Analisis y Desarrollo de Software",
      institution_name: "SENA",
      location_name: "General",
      structure_type: "TRIMESTERS",
      period_order: 1,
      period_name: "Trimestre 1",
      item_order: 1,
      item_title: "Fundamentos de Programacion (Python)",
      item_type: "OUTCOME_GROUP",
      item_code: "",
      item_description: "",
      outcome_code: "593146 - 01",
      outcome_description:
        "INCORPORAR ACTIVIDADES DE ASEGURAMIENTO DE LA CALIDAD DEL SOFTWARE DE ACUERDO CON ESTANDARES DE LA INDUSTRIA.",
      source_slug: "",
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "plan_items");

  return XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });
}
