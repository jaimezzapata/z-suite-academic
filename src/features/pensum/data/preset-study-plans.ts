import type { StudyPlanImportPayload } from "@/features/pensum/validations/study-plan-import-schema";

function createOutcome(rawValue: string) {
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

function createOutcomeGroup(title: string, outcomes: string[]) {
  return {
    itemType: "OUTCOME_GROUP" as const,
    outcomes: outcomes.map(createOutcome),
    title,
  };
}

function createSubject(title: string) {
  return {
    itemType: "SUBJECT" as const,
    outcomes: [],
    title,
  };
}

export const presetStudyPlans: StudyPlanImportPayload[] = [
  {
    aliasName: "Desarrollo de Software CESDE Medellin",
    coreContentName: "Desarrollo de Software",
    institutionName: "CESDE",
    locationName: "Medellin",
    metadata: {
      excludedSubjects: ["Catedra Ser Emprendedor"],
      presetLabel: "CESDE Medellin",
    },
    periods: [
      {
        name: "Nivel 1",
        order: 1,
        items: [
          createSubject("Logica de Programacion"),
          createSubject("Introduccion a la Programacion"),
          createSubject("Gestion de Bases de Datos"),
        ],
      },
      {
        name: "Nivel 2",
        order: 2,
        items: [
          createSubject("Metodologias Agiles para la Programacion"),
          createSubject("Backend I (Lenguaje)"),
          createSubject("Frontend I (Lenguaje)"),
        ],
      },
      {
        name: "Nivel 3",
        order: 3,
        items: [
          createSubject("Nuevas Tecnologias de Programacion"),
          createSubject("Backend II (Framework)"),
          createSubject("Frontend II (Framework)"),
        ],
      },
    ],
    sourceSlug: "preset-cesde-medellin",
    sourceType: "PRESET",
    structureType: "LEVELS",
  },
  {
    aliasName: "Desarrollo de Software CESDE Bello",
    coreContentName: "Desarrollo de Software",
    institutionName: "CESDE",
    locationName: "Bello",
    metadata: {
      excludedSubjects: ["Catedra Ser Emprendedor"],
      presetLabel: "CESDE Bello",
    },
    periods: [
      {
        name: "Nivel 1",
        order: 1,
        items: [
          createSubject("Logica de Programacion"),
          createSubject("Metodologias Agiles para la Programacion"),
          createSubject("Introduccion a la Programacion"),
        ],
      },
      {
        name: "Nivel 2",
        order: 2,
        items: [
          createSubject("Programacion de Aplicaciones Moviles I"),
          createSubject("Programacion para la Web I"),
          createSubject("Gestion de Base de Datos"),
        ],
      },
      {
        name: "Nivel 3",
        order: 3,
        items: [
          createSubject("Nuevas Tecnologias de Programacion"),
          createSubject("Programacion de Aplicaciones Moviles II"),
          createSubject("Programacion para la Web II"),
        ],
      },
    ],
    sourceSlug: "preset-cesde-bello",
    sourceType: "PRESET",
    structureType: "LEVELS",
  },
  {
    aliasName: "ADSO SENA",
    coreContentName: "Analisis y Desarrollo de Software",
    institutionName: "SENA",
    locationName: "General",
    metadata: {
      presetLabel: "SENA ADSO",
      source: "Sofia timeline",
      warning: "El JSON fuente del trimestre 7 contiene un resultado sin label.",
    },
    periods: [
      {
        name: "Trimestre 1",
        order: 1,
        items: [
          createOutcomeGroup("Induccion", [
            "593343 - 01  IDENTIFICAR LA DINAMICA ORGANIZACIONAL DEL SENA Y EL ROL DE LA FORMACION PROFESIONAL INTEGRAL DE ACUERDO CON SU PROYECTO DE VIDA Y EL DESARROLLO PROFESIONAL.",
          ]),
          createOutcomeGroup("Fundamentos de Programacion (Python)", [
            "593146 - 01  INCORPORAR ACTIVIDADES DE ASEGURAMIENTO DE LA CALIDAD DEL SOFTWARE DE ACUERDO CON ESTANDARES DE LA INDUSTRIA.",
            "592376 - 03  DESARROLLAR PROCESOS LOGICOS A TRAVES DE LA IMPLEMENTACION DE ALGORITMOS.",
          ]),
          createOutcomeGroup("Bases de Datos", [
            "593107 - 02  CONSTRUIR LA BASE DE DATOS PARA EL SOFTWARE A PARTIR DEL MODELO DE DATOS.",
            "593101 - 02  ESTRUCTURAR EL MODELO DE DATOS DEL SOFTWARE DE ACUERDO CON LAS ESPECIFICACIONES DEL ANALISIS.",
          ]),
          createOutcomeGroup("Comunicacion", [
            "593225 - 01  ANALIZAR LOS COMPONENTES DE LA COMUNICACION SEGUN SUS CARACTERISTICAS, INTENCIONALIDAD Y CONTEXTO.",
          ]),
          createOutcomeGroup("Matematica", [
            "593256 - 01  IDENTIFICAR MODELOS MATEMATICOS DE ACUERDO CON LOS REQUERIMIENTOS DEL PROBLEMA PLANTEADO EN CONTEXTOS SOCIALES Y PRODUCTIVO.",
          ]),
        ],
      },
      {
        name: "Trimestre 2",
        order: 2,
        items: [
          createOutcomeGroup("Proyecto Formativo (Requerimientos de Software)", [
            "593346 - 01  CARACTERIZAR LOS PROCESOS DE LA ORGANIZACION DE ACUERDO CON EL SOFTWARE A CONSTRUIR.",
            "593060 - 01  DEFINIR ESPECIFICACIONES TECNICAS DEL SOFTWARE DE ACUERDO CON LAS CARACTERISTICAS DEL SOFTWARE A CONSTRUIR.",
          ]),
          createOutcomeGroup("Programacion con JavaScript", [
            "592375 - 01 PLANEAR ACTIVIDADES DE ANALISIS DE ACUERDO CON LA METODOLOGIA SELECCIONADA.",
          ]),
          createOutcomeGroup("Diseno WEB (HTML, CSS)", [
            "593100 - 03  DETERMINAR LAS CARACTERISTICAS TECNICAS DE LA INTERFAZ GRAFICA DEL SOFTWARE ADOPTANDO ESTANDARES.",
          ]),
          createOutcomeGroup("Herramientas TIC", [
            "593154 - 01  ALISTAR HERRAMIENTAS DE TECNOLOGIAS DE LA INFORMACION Y LA COMUNICACION (TIC), DE ACUERDO CON LAS NECESIDADES DE PROCESAMIENTO DE INFORMACION Y COMUNICACION.",
            "593151 - 02  APLICAR FUNCIONALIDADES DE HERRAMIENTAS Y SERVICIOS TIC, DE ACUERDO CON MANUALES DE USO, PROCEDIMIENTOS ESTABLECIDOS Y BUENAS PRACTICAS.",
            "593153 - 03  EVALUAR LOS RESULTADOS, DE ACUERDO CON LOS REQUERIMIENTOS.",
            "593152 - 04  OPTIMIZAR LOS RESULTADOS, DE ACUERDO CON LA VERIFICACION.",
          ]),
        ],
      },
      {
        name: "Trimestre 3",
        order: 3,
        items: [
          createOutcomeGroup("Desarrollo WEB - ReactJS o AngularJS", [
            "593104 - 03  CREAR COMPONENTES FRONT-END DEL SOFTWARE DE ACUERDO CON EL DISENO.",
          ]),
          createOutcomeGroup("Arquitectura de Software", [
            "593103 - 01  ELABORAR LOS ARTEFACTOS DE DISENO DEL SOFTWARE SIGUIENDO LAS PRACTICAS DE LA METODOLOGIA SELECCIONADA.",
          ]),
          createOutcomeGroup("Programacion con Node.js y APIs REST", [
            "593061 - 03  VALIDAR LAS CONDICIONES DE LA PROPUESTA TECNICA DEL SOFTWARE DE ACUERDO CON LOS INTERESES DE LAS PARTES.",
          ]),
          createOutcomeGroup("Control de versiones Git y GitHub", [
            "593145 - 03  REALIZAR ACTIVIDADES DE MEJORA DE LA CALIDAD DEL SOFTWARE A PARTIR DE LOS RESULTADOS DE LA VERIFICACION.",
          ]),
          createOutcomeGroup("Etica y Cultura de Paz", [
            "593149 - 01  PROMOVER MI DIGNIDAD Y LA DEL OTRO A PARTIR DE LOS PRINCIPIOS Y VALORES ETICOS COMO APORTE EN LA INSTAURACION DE UNA CULTURA DE PAZ.",
            "593147 - 02  ESTABLECER RELACIONES DE CRECIMIENTO PERSONAL Y COMUNITARIO A PARTIR DEL BIEN COMUN COMO APORTE PARA EL DESARROLLO SOCIAL.",
            "593148 - 03  PROMOVER EL USO RACIONAL DE LOS RECURSOS NATURALES A PARTIR DE CRITERIOS DE SOSTENIBILIDAD Y SUSTENTABILIDAD ETICA Y NORMATIVA VIGENTE.",
            "593150 - 04  CONTRIBUIR CON EL FORTALECIMIENTO DE LA CULTURA DE PAZ A PARTIR DE LA DIGNIDAD HUMANA Y LAS ESTRATEGIAS PARA LA TRANSFORMACION DE CONFLICTOS.",
          ]),
        ],
      },
      {
        name: "Trimestre 4",
        order: 4,
        items: [
          createOutcomeGroup("Programacion con PHP y Laravel", [
            "593062 - 02  ELABORAR PROPUESTA TECNICA DEL SOFTWARE DE ACUERDO CON LAS ESPECIFICACIONES TECNICAS DEFINIDAS.",
          ]),
          createOutcomeGroup("Desarrollo en C#", [
            "593112 - 04  IMPLANTAR EL SOFTWARE DE ACUERDO CON LOS NIVELES DE SERVICIO ESTABLECIDOS CON EL CLIENTE.",
          ]),
          createOutcomeGroup("Programacion en JAVA", [
            "593108 - 04  CODIFICAR EL SOFTWARE DE ACUERDO CON EL DISENO ESTABLECIDO.",
          ]),
          createOutcomeGroup("Fisica", [
            "593160 - 04  PROPONER ACCIONES DE MEJORA EN LOS PROCESOS PRODUCTIVOS DE ACUERDO CON LOS PRINCIPIOS Y LEYES DE LA FISICA.",
            "593162 - 01  IDENTIFICAR LOS PRINCIPIOS Y LEYES DE LA FISICA EN LA SOLUCION DE PROBLEMAS DE ACUERDO AL CONTEXTO PRODUCTIVO.",
            "593159 - 02  SOLUCIONAR PROBLEMAS ASOCIADOS CON EL SECTOR PRODUCTIVO CON BASE EN LOS PRINCIPIOS Y LEYES DE LA FISICA.",
            "593161 - 03  VERIFICAR LAS TRANSFORMACIONES FISICAS DE LA MATERIA UTILIZANDO HERRAMIENTAS TECNOLOGICAS.",
          ]),
          createOutcomeGroup("Actividad Fisica - Habitos de Vida Saludable", [
            "593120 - 01  DESARROLLAR HABILIDADES PSICOMOTRICES EN EL CONTEXTO PRODUCTIVO Y SOCIAL.",
            "593119 - 02  PRACTICAR HABITOS SALUDABLES MEDIANTE LA APLICACION DE FUNDAMENTOS DE NUTRICION E HIGIENE.",
            "593121 - 03  EJECUTAR ACTIVIDADES DE ACONDICIONAMIENTO FISICO ORIENTADAS HACIA EL MEJORAMIENTO DE LA CONDICION FISICA EN LOS CONTEXTOS PRODUCTIVO Y SOCIAL.",
            "593122 - 04  IMPLEMENTAR UN PLAN DE ERGONOMIA Y PAUSAS ACTIVAS SEGUN LAS CARACTERISTICAS DE LA FUNCION PRODUCTIVA.",
          ]),
        ],
      },
      {
        name: "Trimestre 5",
        order: 5,
        items: [
          createOutcomeGroup("Ingenieria de software", [
            "593102 - 04  VERIFICAR LOS ENTREGABLES DE LA FASE DE DISENO DEL SOFTWARE DE ACUERDO CON LO ESTABLECIDO EN EL INFORME DE ANALISIS.",
          ]),
          createOutcomeGroup("DevOps y Contenedores (Docker)", [
            "593110 - 02  DESPLEGAR EL SOFTWARE DE ACUERDO CON LA ARQUITECTURA Y LAS POLITICAS ESTABLECIDAS.",
          ]),
          createOutcomeGroup("Seguridad informatica", [
            "593111 - 01  PLANEAR ACTIVIDADES DE IMPLANTACION DEL SOFTWARE DE ACUERDO CON LAS CONDICIONES DEL SISTEMA.",
          ]),
          createOutcomeGroup("Seguimiento Proyecto Formativo", [
            "593344 - 02  RECOLECTAR INFORMACION DEL SOFTWARE A CONSTRUIR DE ACUERDO CON LAS NECESIDADES DEL CLIENTE.",
          ]),
          createOutcomeGroup("Investigacion", [
            "593236 - 01  ANALIZAR EL CONTEXTO PRODUCTIVO SEGUN SUS CARACTERISTICAS Y NECESIDADES.",
            "593238 - 02  ESTRUCTURAR EL PROYECTO DE ACUERDO A CRITERIOS DE LA INVESTIGACION.",
            "593237 - 03  ARGUMENTAR ASPECTOS TEORICOS DEL PROYECTO SEGUN REFERENTES NACIONALES E INTERNACIONALES.",
            "593235 - 04  PROPONER SOLUCIONES A LAS NECESIDADES DEL CONTEXTO SEGUN RESULTADOS DE LA INVESTIGACION.",
          ]),
          createOutcomeGroup("Ambiental y Seguridad y Salud en el trabajo", [
            "593156 - 01  ANALIZAR LAS ESTRATEGIAS PARA LA PREVENCION Y CONTROL DE LOS IMPACTOS AMBIENTALES Y DE LOS ACCIDENTES Y ENFERMEDADES LABORALES (ATEL) DE ACUERDO CON LAS POLITICAS ORGANIZACIONALES Y EL ENTORNO SOCIAL.",
            "593158 - 02  IMPLEMENTAR ESTRATEGIAS PARA EL CONTROL DE LOS IMPACTOS AMBIENTALES Y DE LOS ACCIDENTES Y ENFERMEDADES DE ACUERDO CON LOS PLANES Y PROGRAMAS ESTABLECIDOS POR LA ORGANIZACION.",
            "593157 - 03  REALIZAR SEGUIMIENTO Y ACOMPANAMIENTO AL DESARROLLO DE LOS PLANES Y PROGRAMAS AMBIENTALES Y SST, SEGUN EL AREA DE DESEMPENO.",
            "593155 - 04  PROPONER ACCIONES DE MEJORA PARA EL MANEJO AMBIENTAL Y EL CONTROL DE LA SST, DE ACUERDO CON ESTRATEGIAS DE TRABAJO, COLABORATIVO, COOPERATIVO Y COORDINADO EN EL CONTEXTO PRODUCTIVO Y SOCIAL.",
          ]),
        ],
      },
      {
        name: "Trimestre 6",
        order: 6,
        items: [
          createOutcomeGroup("Programacion Avanzada Python Backend - FastAPI", [
            "592374 - 04  VERIFICAR LOS MODELOS REALIZADOS EN LA FASE DE ANALISIS DE ACUERDO CON LO ESTABLECIDO EN EL INFORME DE REQUISITOS.",
          ]),
          createOutcomeGroup("Desarrollo de aplicaciones moviles Android", [
            "593106 - 01  PLANEAR ACTIVIDADES DE CONSTRUCCION DEL SOFTWARE DE ACUERDO CON EL DISENO ESTABLECIDO.",
          ]),
          createOutcomeGroup("Pruebas de Software y SCRUM", [
            "593105 - 05  REALIZAR PRUEBAS AL SOFTWARE PARA VERIFICAR SU FUNCIONALIDAD.",
          ]),
          createOutcomeGroup("Emprendimiento", [
            "593342 - 01  INTEGRAR ELEMENTOS DE LA CULTURA EMPRENDEDORA TENIENDO EN CUENTA EL PERFIL PERSONAL Y EL CONTEXTO DE DESARROLLO SOCIAL.",
            "593259 - 02  CARACTERIZAR LA IDEA DE NEGOCIO TENIENDO EN CUENTA LAS OPORTUNIDADES Y NECESIDADES DEL SECTOR PRODUCTIVO Y SOCIAL.",
            "593340 - 03  ESTRUCTURAR EL PLAN DE NEGOCIO DE ACUERDO CON LAS CARACTERISTICAS EMPRESARIALES Y TENDENCIAS DE MERCADO.",
            "593341 - 04  VALORAR LA PROPUESTA DE NEGOCIO CONFORME CON SU ESTRUCTURA Y NECESIDADES DEL SECTOR PRODUCTIVO Y SOCIAL.",
          ]),
        ],
      },
      {
        name: "Trimestre 7",
        order: 7,
        items: [
          createOutcomeGroup("Ciencia de datos con Python y Bases de Datos NoSQL", [
            "592373 - 02  MODELAR LAS FUNCIONES DEL SOFTWARE DE ACUERDO CON EL INFORME DE REQUISITOS.",
          ]),
          createOutcomeGroup("Sin etiqueta", [
            "593109 - 03  DOCUMENTAR EL PROCESO DE IMPLANTACION DE SOFTWARE SIGUIENDO ESTANDARES DE CALIDAD.",
          ]),
          createOutcomeGroup("Proyecto Formativo", [
            "593347 - 03  ESTABLECER LOS REQUISITOS DEL SOFTWARE DE ACUERDO CON LA INFORMACION RECOLECTADA.",
            "593345 - 04  VALIDAR EL INFORME DE REQUISITOS DE ACUERDO CON LAS NECESIDADES DEL CLIENTE.",
          ]),
        ],
      },
    ],
    sourceSlug: "preset-sena-adso",
    sourceType: "PRESET",
    structureType: "TRIMESTERS",
  },
];
