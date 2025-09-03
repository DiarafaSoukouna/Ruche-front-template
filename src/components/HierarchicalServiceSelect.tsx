import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronRight, Building, Search, X } from "lucide-react";
import { FieldError } from "react-hook-form";
import { planSiteService } from "../services/planSiteService";
import { apiClient } from "../lib/api";
import type { PlanSite, NiveauStructureConfig } from "../types/entities";

interface HierarchicalServiceSelectProps {
  value?: number | null;
  onChange: (value: number | null) => void;
  error?: FieldError;
  label?: string;
  required?: boolean;
  placeholder?: string;
}

interface ServiceNode {
  planSite: PlanSite;
  children: ServiceNode[];
  level: number;
}

export default function HierarchicalServiceSelect({
  value,
  onChange,
  error,
  label,
  required = false,
  placeholder = "Sélectionner un service..."
}: HierarchicalServiceSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set());
  const [selectedService, setSelectedService] = useState<PlanSite | null>(null);

  // Fetch plan sites and niveau configs
  const { data: planSites = [] } = useQuery<PlanSite[]>({
    queryKey: ["planSites"],
    queryFn: planSiteService.getAll,
  });

  const { data: niveauConfigs = [] } = useQuery<NiveauStructureConfig[]>({
    queryKey: ["niveauStructureConfigs"],
    queryFn: async (): Promise<NiveauStructureConfig[]> => {
      const response = await apiClient.request("/niveau_structure_config/");
      return Array.isArray(response) ? response : [];
    },
  });

  // Build hierarchical tree
  const buildTree = (planSites: PlanSite[]): ServiceNode[] => {
    const nodeMap = new Map<number, ServiceNode>();
    const rootNodes: ServiceNode[] = [];

    // Create nodes
    planSites.forEach(planSite => {
      nodeMap.set(planSite.id_ds!, {
        planSite,
        children: [],
        level: planSite.niveau_ds
      });
    });

    // Build hierarchy
    planSites.forEach(planSite => {
      const node = nodeMap.get(planSite.id_ds!);
      if (!node) return;

      if (planSite.parent_ds && planSite.parent_ds !== 0) {
        const parent = nodeMap.get(planSite.parent_ds);
        if (parent) {
          parent.children.push(node);
        } else {
          rootNodes.push(node);
        }
      } else {
        rootNodes.push(node);
      }
    });

    return rootNodes;
  };

  const serviceTree = buildTree(planSites);

  // Filter services based on search
  const filterTree = useCallback((nodes: ServiceNode[], searchTerm: string): ServiceNode[] => {
    if (!searchTerm) return nodes;

    const filtered: ServiceNode[] = [];
    const nodesToExpand: number[] = [];
    
    nodes.forEach(node => {
      const matchesSearch = 
        node.planSite.intutile_ds.toLowerCase().includes(searchTerm.toLowerCase()) ||
        node.planSite.code_ds.toLowerCase().includes(searchTerm.toLowerCase());
      
      const filteredChildren = filterTree(node.children, searchTerm);
      
      if (matchesSearch || filteredChildren.length > 0) {
        filtered.push({
          ...node,
          children: filteredChildren
        });
        
        // Collect nodes to expand
        if (matchesSearch || filteredChildren.length > 0) {
          nodesToExpand.push(node.planSite.id_ds!);
        }
      }
    });

    return filtered;
  }, []);

  const filteredTree = filterTree(serviceTree, searchTerm);

  // Auto-expand nodes when search results change
  useEffect(() => {
    if (!searchTerm) return;
    
    const nodesToExpand: number[] = [];
    
    const collectExpandableNodes = (nodes: ServiceNode[]) => {
      nodes.forEach(node => {
        const matchesSearch = 
          node.planSite.intutile_ds.toLowerCase().includes(searchTerm.toLowerCase()) ||
          node.planSite.code_ds.toLowerCase().includes(searchTerm.toLowerCase());
        
        const hasMatchingChildren = node.children.some(child => 
          child.planSite.intutile_ds.toLowerCase().includes(searchTerm.toLowerCase()) ||
          child.planSite.code_ds.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        if (matchesSearch || hasMatchingChildren) {
          nodesToExpand.push(node.planSite.id_ds!);
        }
        
        collectExpandableNodes(node.children);
      });
    };
    
    collectExpandableNodes(serviceTree);
    
    setExpandedNodes(prev => {
      const currentIds = Array.from(prev);
      const newIds = nodesToExpand.filter(id => !currentIds.includes(id));
      return newIds.length > 0 ? new Set([...prev, ...newIds]) : prev;
    });
  }, [searchTerm, serviceTree]);

  // Get level configuration
  const getLevelConfig = (level: number) => {
    return niveauConfigs.find(config => config.nombre_nsc === level);
  };

  const getLevelColor = (level: number) => {
    const colors = [
      "bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary-foreground dark:border-primary/30",
      "bg-secondary/10 text-secondary-foreground border-secondary/20 dark:bg-secondary/20 dark:border-secondary/30", 
      "bg-tertiary/10 text-tertiary-foreground border-tertiary/20 dark:bg-tertiary/20 dark:border-tertiary/30",
      "bg-accent/10 text-accent-foreground border-accent/20 dark:bg-accent/20 dark:border-accent/30",
      "bg-muted/20 text-muted-foreground border-muted/30 dark:bg-muted/30 dark:border-muted/40",
      "bg-card/50 text-card-foreground border-border dark:bg-card/70 dark:border-border"
    ];
    return colors[(level - 1) % colors.length] || "bg-muted/10 text-muted-foreground border-muted/20 dark:bg-muted/20 dark:border-muted/30";
  };

  // Toggle node expansion
  const toggleNode = (nodeId: number) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  // Handle service selection
  const handleSelect = (planSite: PlanSite) => {
    setSelectedService(planSite);
    onChange(planSite.id_ds!);
    setIsOpen(false);
    setSearchTerm("");
  };

  // Clear selection
  const handleClear = () => {
    setSelectedService(null);
    onChange(null);
  };

  // Find selected service when value changes
  useEffect(() => {
    if (value && planSites.length > 0) {
      const service = planSites.find(ps => ps.id_ds === value);
      setSelectedService(service || null);
    } else {
      setSelectedService(null);
    }
  }, [value, planSites]);

  // Render tree node
  const renderNode = (node: ServiceNode, depth: number = 0) => {
    const isExpanded = expandedNodes.has(node.planSite.id_ds!);
    const hasChildren = node.children.length > 0;
    const levelConfig = getLevelConfig(node.level);
    
    return (
      <div key={node.planSite.id_ds} className="select-none">
        <div 
          className={`flex items-center p-2 rounded-md border hover:shadow-sm transition-all cursor-pointer ${getLevelColor(node.level)}`}
          style={{ marginLeft: `${depth * 20}px` }}
          onClick={() => handleSelect(node.planSite)}
        >
          {/* Expand/Collapse button */}
          {hasChildren && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                toggleNode(node.planSite.id_ds!);
              }}
              className="mr-2 p-1 hover:bg-background/80 dark:hover:bg-background/60 rounded transition-colors cursor-pointer"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </div>
          )}
          
          {!hasChildren && <div className="w-6 mr-2" />}
          
          {/* Service icon */}
          <Building className="h-4 w-4 mr-2 flex-shrink-0" />
          
          {/* Service info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium truncate">
                {node.planSite.intutile_ds}
              </span>
              <span className="text-xs px-2 py-1 bg-background/80 dark:bg-background/60 rounded-full border border-border/50">
                {node.planSite.code_ds}
              </span>
            </div>
            {levelConfig && (
              <div className="text-xs opacity-75 mt-1">
                {levelConfig.libelle_nsc}
              </div>
            )}
          </div>
        </div>
        
        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {node.children.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-foreground mb-1">
          {label} {required && <span className="text-destructive">*</span>}
        </label>
      )}
      
      {/* Selected value display */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-3 py-2 border rounded-lg bg-background text-foreground 
            focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring
            hover:bg-accent/50 transition-colors
            flex items-center justify-between ${error ? "border-destructive" : "border-input"}
          `}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {selectedService ? (
              <>
                <Building className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                <span className="truncate">{selectedService.intutile_ds}</span>
                <span className="text-xs px-2 py-1 bg-muted rounded-full">
                  {selectedService.code_ds}
                </span>
              </>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            {selectedService && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                className="p-1 hover:bg-muted/80 dark:hover:bg-muted/60 rounded transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </div>
            )}
            <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-popover border border-input rounded-lg shadow-lg max-h-96 overflow-hidden">
            {/* Search */}
            <div className="p-3 border-b border-input">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Rechercher un service..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                />
              </div>
            </div>
            
            {/* Tree */}
            <div className="max-h-80 overflow-y-auto p-2">
              {filteredTree.length > 0 ? (
                <div className="space-y-1">
                  {filteredTree.map(node => renderNode(node))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  {searchTerm ? "Aucun service trouvé" : "Aucun service disponible"}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-destructive">{error.message}</p>
      )}
    </div>
  );
}
