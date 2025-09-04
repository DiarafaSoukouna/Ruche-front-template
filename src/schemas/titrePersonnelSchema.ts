import { z } from "zod";

export const titrePersonnelSchema = z.object({
  libelle_titre: z.string().min(1, "Le libellé est obligatoire"),
  description_titre: z.string().optional(),
});

export type TitrePersonnelFormData = z.infer<typeof titrePersonnelSchema>;
