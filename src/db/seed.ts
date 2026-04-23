import { db } from "@/lib/db";
import { coverages, plans, planCoverages } from "@/db/schema";

const coverageData = [
  { name: "Laboral", description: "Asesoramiento en conflictos laborales, contratos y beneficios", slug: "laboral", icon: "Briefcase" },
  { name: "Demandas de Alimentos", description: "Trámites y representación en demandas de alimentos", slug: "alimentos", icon: "Users" },
  { name: "Violencia Intrafamiliar", description: "Protección y asesoramiento en casos de VIF", slug: "vif", icon: "Shield" },
  { name: "Civil", description: "Conflictos civiles, contratos y obligaciones", slug: "civil", icon: "Scale" },
  { name: "Bienes", description: "Trámites de propiedad, bienes raíces y herencia", slug: "bienes", icon: "Home" },
  { name: "Compra Venta y Legalización", description: "Asesoría en transacciones comerciales y legalización", slug: "compra-venta", icon: "Building" },
  { name: "Asesoría Penal", description: "Defensa y representación en procesos penales", slug: "penal", icon: "Gavel" },
  { name: "Asesoría Empresarial y Mercantil", description: "Consultas para empresas y asuntos mercantiles", slug: "empresarial", icon: "Store" },
  { name: "Constitucional", description: "Amparos y protección de derechos constitucionales", slug: "constitucional", icon: "FileText" },
];

const planData = [
  { name: "Básico", description: "Coberturas esenciales para empleados", price: "15.00" },
  { name: "Familiar", description: "Protección completa para tu familia", price: "25.00" },
  { name: "Empresarial", description: "Para pequeñas y medianas empresas", price: "40.00" },
  { name: "Premium", description: "La protección más completa", price: "50.00" },
];

// Plan coverage mappings
const planCoverageMappings: Record<string, string[]> = {
  "Básico": ["Laboral", "Civil", "Bienes"],
  "Familiar": ["Laboral", "Demandas de Alimentos", "Violencia Intrafamiliar", "Civil"],
  "Empresarial": ["Laboral", "Civil", "Asesoría Empresarial y Mercantil", "Asesoría Penal"],
  "Premium": ["Laboral", "Demandas de Alimentos", "Violencia Intrafamiliar", "Civil", "Bienes", "Compra Venta y Legalización", "Asesoría Penal", "Asesoría Empresarial y Mercantil", "Constitucional"],
};

async function seed() {
  console.log("Seeding database...");

  // Insert coverages
  console.log("Inserting coverages...");
  const insertedCoverages = await db.insert(coverages).values(coverageData).returning();
  console.log(`Inserted ${insertedCoverages.length} coverages`);

  // Create coverage lookup
  const coverageMap = new Map(insertedCoverages.map((c) => [c.name, c.id]));

  // Insert plans
  console.log("Inserting plans...");
  const insertedPlans = await db.insert(plans).values(planData).returning();
  console.log(`Inserted ${insertedPlans.length} plans`);

  // Insert plan coverages
  console.log("Inserting plan coverages...");
  const planCoverageData = [];
  for (const plan of insertedPlans) {
    const coverageNames = planCoverageMappings[plan.name];
    for (const coverageName of coverageNames) {
      const coverageId = coverageMap.get(coverageName);
      if (coverageId) {
        planCoverageData.push({
          planId: plan.id,
          coverageId: coverageId,
        });
      }
    }
  }

  if (planCoverageData.length > 0) {
    await db.insert(planCoverages).values(planCoverageData);
    console.log(`Inserted ${planCoverageData.length} plan coverages`);
  }

  console.log("Seed completed successfully!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
