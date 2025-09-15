// schemas/projectSchema.ts
import { z } from "zod";

export const projectCreateSchema = z.object({
    code_projet: z.string().min(1, "Code requis"),
    sigle_projet: z.string().min(1, "Sigle requis"),
    intitule_projet: z.string().min(1, "Intitulé requis"),
    duree_projet: z.number().min(1, "Durée requise"),
    date_signature_projet: z.string().min(1, "Date de signature requise"),
    date_demarrage_projet: z.string().min(1, "Date de démarrage requise"),
    
    // Étape 2
    partenaire_projet: z.number().min(1, "Partenaire requis"),
    structure_projet: z.array(z.number()).min(1, "Structures requises"),
    signataires_projet: z.array(z.number()).min(1, "Signataires requis"),
    partenaires_execution_projet: z.array(z.number()).min(1, "Partenaires d'execution requis"),
    zone_projet: z.array(z.number()).min(1, "Zones requises"),
});

export type ProjectCreateData = z.infer<typeof projectCreateSchema>;
