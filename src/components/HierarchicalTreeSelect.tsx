import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, FolderTree, Search, X } from "lucide-react";
import { FieldError } from "react-hook-form";

interface TreeNode {
  id: number;
  label: string;
  code?: string;
  level: number;
  children: TreeNode[];
  parent_id?: number | null;
}

interface HierarchicalTreeSelectProps {
  value?: number | null;
  onChange: (value: number | null) => void;
  data: any[];
  idField: string;
  labelField: string;
  codeField?: string;
  parentField: string;
  levelField?: string;
  error?: FieldError;
  label?: string;
  required?: boolean;
  placeholder?: string;
}

export default function HierarchicalTreeSelect({
  value,
  onChange,
  data,
  idField,
  labelField,
  codeField,
  parentField,
  levelField,
  error,
  label,
  required = false,
  placeholder = "Sélectionner un élément..."
}: HierarchicalTreeSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set());
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  // Build tree structure
  const buildTree = (items: any[]): TreeNode[] => {
    const nodeMap = new Map<number, TreeNode>();
    const rootNodes: TreeNode[] = [];

    // Create nodes
    items.forEach(item => {
      const node: TreeNode = {
        id: item[idField],
        label: item[labelField],
        code: codeField ? item[codeField] : undefined,
        level: levelField ? item[levelField] : 1,
        children: [],
        parent_id: item[parentField],
      };
      nodeMap.set(node.id, node);
    });

    // Build hierarchy
    nodeMap.forEach(node => {
      if (node.parent_id && nodeMap.has(node.parent_id)) {
        nodeMap.get(node.parent_id)!.children.push(node);
      } else {
        rootNodes.push(node);
      }
    });

    return rootNodes;
  };

  const tree = buildTree(data);

  // Find selected item
  useEffect(() => {
    if (value) {
      const item = data.find(d => d[idField] === value);
      setSelectedItem(item || null);
    } else {
      setSelectedItem(null);
    }
  }, [value, data, idField]);

  // Filter tree based on search
  const filterTree = (nodes: TreeNode[], searchTerm: string): TreeNode[] => {
    if (!searchTerm) return nodes;

    const filtered: TreeNode[] = [];
    
    nodes.forEach(node => {
      const matchesSearch = 
        node.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (node.code && node.code.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const filteredChildren = filterTree(node.children, searchTerm);
      
      if (matchesSearch || filteredChildren.length > 0) {
        filtered.push({
          ...node,
          children: filteredChildren
        });
      }
    });

    return filtered;
  };

  const filteredTree = filterTree(tree, searchTerm);

  // Auto-expand nodes when searching
  useEffect(() => {
    if (searchTerm) {
      const nodesToExpand: number[] = [];
      
      const collectExpandableNodes = (nodes: TreeNode[]) => {
        nodes.forEach(node => {
          if (node.children.length > 0) {
            nodesToExpand.push(node.id);
          }
          collectExpandableNodes(node.children);
        });
      };
      
      collectExpandableNodes(filteredTree);
      setExpandedNodes(new Set(nodesToExpand));
    }
  }, [searchTerm, filteredTree]);

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

  const handleSelect = (item: any) => {
    onChange(item[idField]);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClear = () => {
    onChange(null);
    setSelectedItem(null);
  };

  const getLevelColor = (level: number) => {
    const colors = [
      "bg-primary/10 text-primary border-primary/20",
      "bg-secondary/10 text-secondary-foreground border-secondary/20", 
      "bg-tertiary/10 text-tertiary-foreground border-tertiary/20",
      "bg-accent/10 text-accent-foreground border-accent/20",
      "bg-muted/10 text-muted-foreground border-muted/20",
    ];
    return colors[Math.min(level - 1, colors.length - 1)] || colors[colors.length - 1];
  };

  // Render tree node
  const renderNode = (node: TreeNode, depth: number = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children.length > 0;
    
    return (
      <div key={node.id} className="select-none">
        <div 
          className={`flex items-center p-2 rounded-md border hover:shadow-sm transition-all cursor-pointer ${getLevelColor(node.level)}`}
          style={{ marginLeft: `${depth * 20}px` }}
          onClick={() => handleSelect(data.find(d => d[idField] === node.id))}
        >
          {/* Expand/Collapse button */}
          {hasChildren && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                toggleNode(node.id);
              }}
              className="mr-2 p-1 hover:bg-background/80 rounded transition-colors cursor-pointer"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </div>
          )}
          
          {!hasChildren && <div className="w-6 mr-2" />}
          
          {/* Tree icon */}
          <FolderTree className="h-4 w-4 mr-2 flex-shrink-0" />
          
          {/* Item info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium truncate">
                {node.label}
              </span>
              {node.code && (
                <span className="text-xs px-2 py-1 bg-background/80 rounded-full border border-border/50">
                  {node.code}
                </span>
              )}
            </div>
            <div className="text-xs opacity-75 mt-1">
              Niveau {node.level}
            </div>
          </div>
        </div>
        
        {/* Children */}
        {isExpanded && hasChildren && (
          <div className="mt-1">
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
            {selectedItem ? (
              <>
                <FolderTree className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                <span className="truncate">{selectedItem[labelField]}</span>
                {codeField && selectedItem[codeField] && (
                  <span className="text-xs px-2 py-1 bg-muted rounded-full">
                    {selectedItem[codeField]}
                  </span>
                )}
              </>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            {selectedItem && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                className="p-1 hover:bg-muted/80 rounded transition-colors cursor-pointer"
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
                  placeholder="Rechercher..."
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
                <div className="p-4 text-center text-muted-foreground">
                  Aucun élément trouvé
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
