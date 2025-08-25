import React, { useMemo, useRef, useCallback, useEffect, useState } from "react";
import type { ValueGetterParams, ICellRendererParams } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-theme-quartz.css";

import {
  AllCommunityModule,
  ModuleRegistry,
  GridApi,
  ColDef,
} from "ag-grid-community";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../lib/api";
import { AG_GRID_LOCALE_FR } from "@ag-grid-community/locale";
import Button from "./Button";
import { toast } from "react-toastify";

// Colonnes génériques
interface DataTableColumn<T = Record<string, unknown>> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}

// Props du tableau
interface DataTableProps<T = Record<string, unknown>> {
  columns: DataTableColumn<T>[];
  rowKey: (row: T) => string | number;
  className?: string;
  endpoint: string;
}

// Réponse API → tableau brut
type ApiResponse<T> = T[];

// Enregistre tous les modules communautaires d'ag-grid
ModuleRegistry.registerModules([AllCommunityModule]);

// Composant principal
export default function DataTable<T extends Record<string, unknown>>(
  props: DataTableProps<T>
) {
  const { columns, rowKey, className, endpoint } = props;
  const queryClient = useQueryClient();

  // État pour la recherche
  const [searchText, setSearchText] = useState("");

  // Référence à l’API Ag-Grid
  const gridApiRef = useRef<GridApi | null>(null);

  // Récupération des données depuis ton API
  const { data, error } = useQuery<ApiResponse<T>>({
    queryKey: [endpoint],
    queryFn: async (): Promise<ApiResponse<T>> => {
      const response = (await apiClient.request(endpoint)) as unknown;

      if (Array.isArray(response)) {
        return response as T[];
      }

      // fallback si jamais ce n’est pas un tableau
      return [];
    },
    placeholderData: (prev) => prev,
  });

  useEffect(() => {
    if (error) {
      toast.error("Erreur lors du chargement des données");
    }
  }, [error]);

  // Colonnes dynamiques
  const columnDefs = useMemo<ColDef<T>[]>(() => {
    return columns.map((col) => {
      const def: ColDef<T> = {
        headerName: col.header,
        sortable: true,
        filter: true,
        resizable: true,
      };

      if (typeof col.accessor === "string") {
        const key = col.accessor;
        def.valueGetter = (params: ValueGetterParams<T>) => {
          const record = (params.data || {}) as T;
          const v = record[key];
          return typeof v === "number" || typeof v === "string" ? v : "";
        };
      } else if (typeof col.accessor === "function") {
        const accessor = col.accessor;
        def.cellRenderer = (params: ICellRendererParams<T>) =>
          accessor(params.data as T);
      }

      return def;
    });
  }, [columns]);

  // Définition par défaut des colonnes
  const defaultColDef = useMemo<ColDef<T>>(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
      flex: 1,
      minWidth: 120,
    }),
    []
  );

  // Callback quand la grille est prête
  const onGridReady = useCallback((e: { api: GridApi }) => {
    gridApiRef.current = e.api;
  }, []);

  // Fonction de recherche rapide
  const onQuickFilterChanged = useCallback((value: string) => {
    setSearchText(value);
    if (gridApiRef.current) {
      gridApiRef.current.setGridOption('quickFilterText', value);
    }
  }, []);

  // Gestionnaire de changement du champ de recherche
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onQuickFilterChanged(e.target.value);
  }, [onQuickFilterChanged]);

  return (
    <div className={className}>
      {/* Barre de recherche et bouton Actualiser */}
      <div className="flex justify-between items-center mb-4 gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Rechercher dans le tableau..."
            value={searchText}
            onChange={handleSearchChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
        <Button
          onClick={() =>
            queryClient.invalidateQueries({ queryKey: [endpoint] })
          }
          className="px-3 py-1 text-sm rounded"
        >
          Actualiser
        </Button>
      </div>

      <div className="ag-theme-quartz" style={{ width: "100%" }}>
        <AgGridReact<T>
          localeText={AG_GRID_LOCALE_FR}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowData={data || []}
          getRowId={(p) => String(rowKey(p.data))}
          domLayout="autoHeight"
          rowHeight={44}
          headerHeight={40}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 20, 50, 100]}
          onGridReady={onGridReady}
          suppressPaginationPanel={false}
        />
      </div>
    </div>
  );
}
