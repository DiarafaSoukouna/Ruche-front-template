import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  Edit,
  Trash2,
  Plus,
  Eye,
  FolderTree,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import Button from "../../../components/Button";
import Table from "../../../components/Table";
import type { CadreSecteur } from "../../../types/entities";
import { cadreSecteurService } from "../../../services/cadreSecteurService";

interface CadreSecteurListProps {
  onEdit: (cadre: CadreSecteur) => void;
  onAdd: () => void;
  onView: (cadre: CadreSecteur) => void;
}

interface TreeNode {
  cadre: CadreSecteur;
  children: TreeNode[];
  level: number;
}

export default function CadreSecteurList({
  onEdit,
  onAdd,
  onView,
}: CadreSecteurListProps) {
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<"table" | "tree">("table");
  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set());

  // Fetch cadres data
  const { data: cadres = [] } = useQuery<CadreSecteur[]>({
    queryKey: ["cadresSecteur"],
    queryFn: cadreSecteurService.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: cadreSecteurService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cadresSecteur"] });
    },
  });

  const handleDelete = (id: number) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer ce cadre logique ?")
    ) {
      deleteMutation.mutate(id);
    }
  };

  // Build tree structure
  const buildTree = (items: CadreSecteur[]): TreeNode[] => {
    const nodeMap = new Map<number, TreeNode>();
    const rootNodes: TreeNode[] = [];

    // Create nodes
    items.forEach((cadre) => {
      const node: TreeNode = {
        cadre,
        children: [],
        level: cadre.niveau_cl,
      };
      nodeMap.set(cadre.id_cl, node);
    });

    // Build hierarchy
    nodeMap.forEach((node) => {
      if (node.cadre.parent_cl && nodeMap.has(node.cadre.parent_cl)) {
        nodeMap.get(node.cadre.parent_cl)!.children.push(node);
      } else {
        rootNodes.push(node);
      }
    });

    return rootNodes;
  };

  const tree = buildTree(cadres);

  const toggleNode = (nodeId: number) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const getLevelColor = (level: number) => {
    const colors = [
      "bg-primary/10 text-primary border-primary/20",
      "bg-secondary/10 text-secondary-foreground border-secondary/20",
      "bg-tertiary/10 text-tertiary-foreground border-tertiary/20",
      "bg-accent/10 text-accent-foreground border-accent/20",
      "bg-muted/10 text-muted-foreground border-muted/20",
    ];
    return (
      colors[Math.min(level - 1, colors.length - 1)] ||
      colors[colors.length - 1]
    );
  };

  const renderTreeNode = (node: TreeNode, depth: number = 0) => {
    const isExpanded = expandedNodes.has(node.cadre.id_cl);
    const hasChildren = node.children.length > 0;

    return (
      <div key={node.cadre.id_cl} className="select-none">
        <div
          className={`flex items-center p-3 rounded-md border hover:shadow-sm transition-all ${getLevelColor(
            node.level
          )}`}
          style={{ marginLeft: `${depth * 24}px` }}
        >
          {/* Expand/Collapse button */}
          {hasChildren && (
            <div
              onClick={() => toggleNode(node.cadre.id_cl)}
              className="mr-3 p-1 hover:bg-background/80 rounded transition-colors cursor-pointer"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </div>
          )}

          {!hasChildren && <div className="w-6 mr-3" />}

          {/* Tree icon */}
          <FolderTree className="h-5 w-5 mr-3 flex-shrink-0" />

          {/* Cadre info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <span className="font-medium text-base">
                {node.cadre.intitule_cl}
              </span>
              <span className="text-xs px-2 py-1 bg-background/80 rounded-full border border-border/50">
                {node.cadre.code_cl}
              </span>
              {node.cadre.abrege_cl && (
                <span className="text-xs px-2 py-1 bg-muted/50 rounded-full">
                  {node.cadre.abrege_cl}
                </span>
              )}
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  node.cadre.statut_cl === 1
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {node.cadre.statut_cl === 1 ? "Actif" : "Inactif"}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 ml-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(node.cadre)}
              className="p-1"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(node.cadre)}
              className="p-1"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDelete(node.cadre.id_cl)}
              className="p-1 border-red-600 text-red-600 hover:bg-red-50"
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Children */}
        {isExpanded && hasChildren && (
          <div className="mt-2">
            {node.children.map((child) => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const columns = [
    {
      key: "code_cl" as keyof CadreSecteur,
      title: "Code",
      render: (_: CadreSecteur[keyof CadreSecteur], cadre: CadreSecteur) => (
        <span className="font-mono text-sm">{cadre.code_cl}</span>
      ),
    },
    {
      key: "intitule_cl" as keyof CadreSecteur,
      title: "Intitulé",
      render: (_: CadreSecteur[keyof CadreSecteur], cadre: CadreSecteur) => (
        <div>
          <span className="font-medium">{cadre.intitule_cl}</span>
          {cadre.abrege_cl && (
            <span className="ml-2 text-xs text-muted-foreground">
              ({cadre.abrege_cl})
            </span>
          )}
        </div>
      ),
    },
    {
      key: "niveau_cl" as keyof CadreSecteur,
      title: "Niveau",
      render: (_: CadreSecteur[keyof CadreSecteur], cadre: CadreSecteur) => (
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(
            cadre.niveau_cl
          )}`}
        >
          Niveau {cadre.niveau_cl}
        </span>
      ),
    },
    {
      key: "parent_cl" as keyof CadreSecteur,
      title: "Parent",
      render: (_: CadreSecteur[keyof CadreSecteur], cadre: CadreSecteur) => {
        if (!cadre.parent_cl) return "-";
        const parent = cadres.find((c) => c.id_cl === cadre.parent_cl);
        return parent
          ? `${parent.intitule_cl} (${parent.code_cl})`
          : `ID: ${cadre.parent_cl}`;
      },
    },
    {
      key: "actions" as keyof CadreSecteur,
      title: "Actions",
      render: (_: CadreSecteur[keyof CadreSecteur], cadre: CadreSecteur) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(cadre)}
            className="p-1"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(cadre)}
            className="p-1"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(cadre.id_cl)}
            className="p-1 border-red-600 text-red-600 hover:bg-red-50"
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl text-foreground font-bold">Cadres logiques</h2>
        <div className="flex gap-3">
          <div className="flex border border-input rounded-lg p-1">
            <Button
              variant={viewMode === "table" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
            >
              Tableau
            </Button>
            <Button
              variant={viewMode === "tree" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("tree")}
            >
              Arborescence
            </Button>
          </div>
          <Button variant="primary" onClick={onAdd}>
            <Plus size={20} />
            Nouveau Cadre
          </Button>
        </div>
      </div>

      {viewMode === "table" ? (
        <Table<CadreSecteur & { id?: string | number }>
          title="Liste des cadres logiques"
          columns={columns}
          data={cadres.map((c) => ({ ...c, id: c.id_cl }))}
        />
      ) : (
        <div className="bg-card rounded-xl shadow-sm border border-border p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-card-foreground">
              Arborescence des cadres logiques
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Vue hiérarchique des objectifs, axes stratégiques et actions
            </p>
          </div>

          {tree.length > 0 ? (
            <div className="space-y-3">
              {tree.map((node) => renderTreeNode(node))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <FolderTree className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucun cadre logique trouvé</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
