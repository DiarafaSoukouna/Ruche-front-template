export interface typeReferentiel {
    id_ref_ind_ref?: number
    code_ref_ind: string 
    intitule_ref_ind: string 
    echelle: string 
    unite_cmr: string 
    typologie: string 
    fonction_agregat_cmr: string 
    seuil_minimum: string 
    seuil_maximum: string 
    responsable_collecte_cmr: 0
}
export const listModeleTypologie = 
[
    {
        value: 'absolue',
        label: 'Valeur absolue',
    },
    {
        value: 'relative',
        label: 'Valeur relative',
    },
    {
        value: 'quantitative',
        label: 'Typologie quantitative',
    },
    {
        value: 'qualitative',
        label: 'Typologie qualitative',
    },
]
export const listModeAggregation = 
[
    {
        value: 'Somme',
        label: 'Somme',
    },
    {
        value: 'Moyenne',
        label: 'Moyenne',
    },
    {
        value: 'Ratio',
        label: 'Ratio',
    },
    {
        value: 'Maximum',
        label: 'Maximum',
    },
    {
        value: 'Minimum',
        label: 'Minimum',
    },
    {
        value: 'Rapport',
        label: 'Rapport',
    },
]
