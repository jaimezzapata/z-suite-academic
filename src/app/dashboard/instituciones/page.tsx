import { requireSessionUserId } from "@/features/auth/server/session";
import { InstitutionsOverview } from "@/features/institutions/components/institutions-overview";
import { listInstitutionsByUserId } from "@/features/institutions/server/institutions";
import { listLocationsByUserId } from "@/features/institutions/server/locations";

export default async function InstitutionsPage() {
  const userId = await requireSessionUserId();
  const [institutions, locations] = await Promise.all([
    listInstitutionsByUserId(userId),
    listLocationsByUserId(userId),
  ]);

  const institutionOptions = institutions.map((institution) => ({
    id: institution.id,
    name: institution.name,
  }));

  return (
    <section>
      <InstitutionsOverview
        institutionOptions={institutionOptions}
        institutions={institutions}
        locations={locations}
      />
    </section>
  );
}
