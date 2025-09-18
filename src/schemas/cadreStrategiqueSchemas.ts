import { z } from "zod";

// CadreStrategique Schema
export const cadreStrategiqueSchema = z.object({
  id_cs: z.number(),
  code_cs: z.string().min(1, "Le code est requis").max(50),
  intutile_cs: z.string().min(1, "L'intitulé est requis").max(200),
  abgrege_cs: z.string().min(1, "L'abrégé est requis").max(100),
  niveau_cs: z.number().min(1, "Le niveau est requis"),
  cout_axe: z.number().min(0, "Le coût doit être positif"),
  date_enregistrement: z.string(),
  date_modification: z.string(),
  etat: z.number().optional(),
  partenaire_cs: z.number().nullable().optional(),
  parent_cs: z.number().nullable().optional(),
  projet_cs: z.number().nullable().optional(),
});

export const cadreStrategiqueCreateSchema = cadreStrategiqueSchema.omit({
  id_cs: true,
});
export const cadreStrategiqueUpdateSchema =
  cadreStrategiqueCreateSchema.partial();

export type CadreStrategiqueCreateData = z.infer<
  typeof cadreStrategiqueCreateSchema
>;
export type CadreStrategiqueUpdateData = z.infer<
  typeof cadreStrategiqueUpdateSchema
>;

// CadreStrategiqueConfig Schema
export const cadreStrategiqueConfigSchema = z.object({
  id_csc: z.number(),
  nombre: z.number().min(1, "Le nombre est requis"),
  libelle_csc: z.string().min(1, "Le libellé est requis").max(100),
  type_csc: z.union([z.literal(1), z.literal(2), z.literal(3)], {
    message: "Le type doit être 1 (Effet), 2 (Produit) ou 3 (Impact)",
  }),
  date_enregistrement: z.string(),
  date_modification: z.string(),
  etat: z.number().optional(),
  programme: z.number().nullable().optional(),
});

export const cadreStrategiqueConfigCreateSchema =
  cadreStrategiqueConfigSchema.omit({
    id_csc: true,
  });
export const cadreStrategiqueConfigUpdateSchema =
  cadreStrategiqueConfigCreateSchema.partial();

export type CadreStrategiqueConfigCreateData = z.infer<
  typeof cadreStrategiqueConfigCreateSchema
>;
export type CadreStrategiqueConfigUpdateData = z.infer<
  typeof cadreStrategiqueConfigUpdateSchema
>;

// Helper function to get type label
export const getTypeLabel = (type: 1 | 2 | 3): string => {
  const typeLabels = {
    1: "Effet",
    2: "Produit",
    3: "Impact",
  };
  return typeLabels[type];
};

// Helper function to get type options for forms
export const getTypeOptions = () => [
  { value: 1, label: "Effet" },
  { value: 2, label: "Produit" },
  { value: 3, label: "Impact" },
];
