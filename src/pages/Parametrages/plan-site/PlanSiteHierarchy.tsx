import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronRight, Building, Eye, Edit, Plus } from "lucide-react";
import Button from "../../../components/Button";
import { apiClient } from "../../../lib/api";
import type { PlanSite, NiveauStructureConfig } from "../../../types/entities";

interface PlanSiteHierarchyProps {
  onEdit: (planSite: PlanSite) => void;
  onAdd: () => void;
  onViewDetails?: (planSiteId: number) => void;
}

interface TreeNodeProps {
  planSite: PlanSite;
  children: PlanSite[];
  allPlanSites: PlanSite[];
  niveauConfigs: NiveauStructureConfig[];
  onEdit: (planSite: PlanSite) => void;
  onViewDetails?: (planSiteId: number) => void;
  level: number;
}

function TreeNode({ planSite, children, allPlanSites, niveauConfigs, onEdit, onViewDetails, level }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2); // Auto-expand first 2 levels
  
  const hasChildren = children.length > 0;
  
  const getLevelName = (level: number) => {
    const config = niveauConfigs.find(c => c.nombre_nsc === level);
    return config?.libelle_nsc || `Niveau ${level}`;
  };

  const getLevelColor = (level: number) => {
    const colors = [
      "bg-purple-100 text-purple-800 border-purple-200",
      "bg-blue-100 text-blue-800 border-blue-200",
      "bg-green-100 text-green-800 border-green-200",
      "bg-yellow-100 text-yellow-800 border-yellow-200",
      "bg-indigo-100 text-indigo-800 border-indigo-200",
      "bg-pink-100 text-pink-800 border-pink-200"
    ];
    return colors[(level - 1) % colors.length] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <div className="select-none">
      <div className={`flex items-center p-3 rounded-lg border-2 ${getLevelColor(planSite.niveau_ds)} hover:shadow-md transition-shadow`}>
        {/* Expand/Collapse Button */}
        <div className="flex items-center mr-3">
          {hasChildren ? (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-white hover:bg-opacity-50 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          ) : (
            <div className="w-6 h-6 flex items-center justify-center">
              <div className="w-2 h-2 bg-current rounded-full opacity-50"></div>
            </div>
          )}
        </div>

        {/* Structure Icon */}
        <Building className="h-5 w-5 mr-3" />

        {/* Structure Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg truncate">{planSite.intutile_ds}</h3>
            <span className="text-xs px-2 py-1 bg-white bg-opacity-50 rounded">
              {planSite.code_ds}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm mt-1">
            <span>{getLevelName(planSite.niveau_ds)}</span>
            {planSite.code_relai_ds && (
              <span className="text-xs">Relai: {planSite.code_relai_ds}</span>
            )}
            {hasChildren && (
              <span className="text-xs">
                {children.length} structure{children.length > 1 ? 's' : ''} subordonnée{children.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-1 ml-3">
          {onViewDetails && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(planSite.id_ds!)}
              className="p-2 bg-white bg-opacity-50 hover:bg-opacity-75"
              title="Voir détails"
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(planSite)}
            className="p-2 bg-white bg-opacity-50 hover:bg-opacity-75"
            title="Modifier"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="ml-8 mt-3 space-y-3 border-l-2 border-gray-200 pl-4">
          {children.map((child) => {
            const grandChildren = allPlanSites.filter(p => p.parent_ds === child.id_ds);
            return (
              <TreeNode
                key={child.id_ds}
                planSite={child}
                children={grandChildren}
                allPlanSites={allPlanSites}
                niveauConfigs={niveauConfigs}
                onEdit={onEdit}
                onViewDetails={onViewDetails}
                level={level + 1}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function PlanSiteHierarchy({ onEdit, onAdd, onViewDetails }: PlanSiteHierarchyProps) {
  const [expandAll, setExpandAll] = useState(false);
  const [levelFilter, setLevelFilter] = useState<number | "">("");

  // Fetch plan site data
  const { data: planSites = [], isLoading } = useQuery<PlanSite[]>({
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

  // Filter data by level if specified
  const filteredPlanSites = levelFilter === "" 
    ? planSites 
    : planSites.filter(p => p.niveau_ds <= levelFilter);

  // Get root structures (no parent)
  const rootStructures = filteredPlanSites
    .filter(p => !p.parent_ds)
    .sort((a, b) => a.code_ds.localeCompare(b.code_ds));

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-gray-500">Chargement de l'organigramme...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Vue Hiérarchique</h2>
          <p className="text-gray-600 mt-1">
            Organigramme des structures organisationnelles
          </p>
        </div>
        <Button onClick={onAdd} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle structure
        </Button>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Afficher jusqu'au niveau:</label>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value === "" ? "" : Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous les niveaux</option>
              {niveauConfigs.map(config => (
                <option key={config.id_nsc} value={config.nombre_nsc}>
                  {config.nombre_nsc} - {config.libelle_nsc}
                </option>
              ))}
            </select>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setExpandAll(!expandAll)}
          >
            {expandAll ? "Réduire tout" : "Développer tout"}
          </Button>

          <div className="text-sm text-gray-600">
            {rootStructures.length} structure{rootStructures.length > 1 ? 's' : ''} racine{rootStructures.length > 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-auto gap-4">
        {niveauConfigs.map(config => {
          const count = planSites.filter(p => p.niveau_ds === config.nombre_nsc).length;
          const colors = [
            "bg-purple-50 border-purple-200 text-purple-800",
            "bg-blue-50 border-blue-200 text-blue-800",
            "bg-green-50 border-green-200 text-green-800",
            "bg-yellow-50 border-yellow-200 text-yellow-800",
            "bg-indigo-50 border-indigo-200 text-indigo-800",
            "bg-pink-50 border-pink-200 text-pink-800"
          ];
          const colorClass = colors[(config.nombre_nsc - 1) % colors.length];
          
          return (
            <div key={config.id_nsc} className={`p-3 rounded-lg border ${colorClass}`}>
              <div className="text-2xl font-bold">{count}</div>
              <div className="text-sm">{config.libelle_nsc}</div>
            </div>
          );
        })}
      </div>

      {/* Hierarchy Tree */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        {rootStructures.length === 0 ? (
          <div className="text-center py-12">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune structure trouvée
            </h3>
            <p className="text-gray-600 mb-4">
              Commencez par créer une structure racine (Ministère)
            </p>
            <Button onClick={onAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Créer une structure
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {rootStructures.map((root) => {
              const children = filteredPlanSites.filter(p => p.parent_ds === root.id_ds);
              return (
                <TreeNode
                  key={root.id_ds}
                  planSite={root}
                  children={children}
                  allPlanSites={filteredPlanSites}
                  niveauConfigs={niveauConfigs}
                  onEdit={onEdit}
                  onViewDetails={onViewDetails}
                  level={1}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
