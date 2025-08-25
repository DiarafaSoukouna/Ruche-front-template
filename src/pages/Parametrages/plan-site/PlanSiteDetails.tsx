import { useQuery } from "@tanstack/react-query";
import { Building, ArrowLeft, Edit, ChevronRight } from "lucide-react";
import Button from "../../../components/Button";
import { apiClient } from "../../../lib/api";
import type { PlanSite, NiveauStructureConfig } from "../../../types/entities";

interface PlanSiteDetailsProps {
  planSiteId: number;
  onClose: () => void;
  onEdit: (planSite: PlanSite) => void;
}

export default function PlanSiteDetails({ planSiteId, onClose, onEdit }: PlanSiteDetailsProps) {
  // Fetch plan site details
  const { data: planSite, isLoading } = useQuery<PlanSite>({
    queryKey: ["/plan_site/", planSiteId],
    queryFn: async (): Promise<PlanSite> => {
      const response = await apiClient.request(`/plan_site/${planSiteId}/`);
      return response as PlanSite;
    },
  });

  // Fetch all plan sites for parent and children info
  const { data: allPlanSites = [] } = useQuery<PlanSite[]>({
    queryKey: ["/plan_site/"],
    queryFn: async (): Promise<PlanSite[]> => {
      const response = await apiClient.request("/plan_site/");
      return Array.isArray(response) ? response : [];
    },
  });

  // Fetch niveau structure config data
  const { data: niveauConfigs = [] } = useQuery<NiveauStructureConfig[]>({
    queryKey: ["/niveau_structure_config/"],
    queryFn: async (): Promise<NiveauStructureConfig[]> => {
      const response = await apiClient.request("/niveau_structure_config/");
      return Array.isArray(response) ? response : [];
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  if (!planSite) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="text-red-500">Structure non trouvée</div>
      </div>
    );
  }

  const parent = planSite.parent_ds 
    ? allPlanSites.find(p => p.id_ds === planSite.parent_ds)
    : null;

  const children = allPlanSites.filter(p => p.parent_ds === planSite.id_ds);

  // Helper functions
  const getLevelName = (level: number) => {
    const config = niveauConfigs.find(c => c.nombre_nsc === level);
    return config?.libelle_nsc || `Niveau ${level}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{planSite.intutile_ds}</h2>
          <p className="text-gray-600 mt-1">
            {getLevelName(planSite.niveau_ds)} - Code: {planSite.code_ds}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onClose}
          className="p-2"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Main Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Building className="h-5 w-5 mr-2" />
            Informations générales
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-600">Code</label>
              <p className="text-gray-900">{planSite.code_ds}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Intitulé</label>
              <p className="text-gray-900">{planSite.intutile_ds}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Niveau hiérarchique</label>
              <p className="text-gray-900">
                {planSite.niveau_ds} - {getLevelName(planSite.niveau_ds)}
              </p>
            </div>
            {planSite.code_relai_ds && (
              <div>
                <label className="text-sm font-medium text-gray-600">Code relai</label>
                <p className="text-gray-900">{planSite.code_relai_ds}</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Hiérarchie
          </h3>
          <div className="space-y-3">
            {parent ? (
              <div>
                <label className="text-sm font-medium text-gray-600">Structure parente</label>
                <p className="text-gray-900">
                  {parent.intutile_ds} ({parent.code_ds})
                </p>
                <p className="text-sm text-gray-500">
                  {getLevelName(parent.niveau_ds)}
                </p>
              </div>
            ) : (
              <div>
                <label className="text-sm font-medium text-gray-600">Structure parente</label>
                <p className="text-gray-500 italic">Structure racine</p>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-600">
                Structures subordonnées ({children.length})
              </label>
              {children.length > 0 ? (
                <div className="space-y-1 mt-1">
                  {children.map((child) => (
                    <p key={child.id_ds} className="text-gray-900 text-sm">
                      • {child.intutile_ds} ({child.code_ds})
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic text-sm">Aucune structure subordonnée</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hierarchical Path */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Chemin hiérarchique
        </h3>
        <div className="flex items-center space-x-2 text-sm">
          {(() => {
            const path: PlanSite[] = [];
            let current: PlanSite | null = planSite;
            
            // Build path from current to root
            while (current) {
              path.unshift(current);
              const parentId: number | null = current.parent_ds;
              current = parentId 
                ? allPlanSites.find(p => p.id_ds === parentId) ?? null
                : null;
            }
            
            return path.map((item, index) => (
              <div key={item.id_ds} className="flex items-center">
                {index > 0 && <span className="mx-2 text-gray-400">→</span>}
                <span className={`px-2 py-1 rounded ${
                  item.id_ds === planSite.id_ds 
                    ? 'bg-blue-200 text-blue-800 font-medium' 
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  {item.intutile_ds}
                </span>
              </div>
            ));
          })()}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline" onClick={onClose}>
          Fermer
        </Button>
        <Button onClick={() => onEdit(planSite)}>
          Modifier
        </Button>
      </div>
    </div>
  );
}
