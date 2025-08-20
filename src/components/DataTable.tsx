import React, { useMemo, useRef, useCallback } from "react";
import type { ValueGetterParams, ICellRendererParams } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-theme-quartz.css";

import {
  AllCommunityModule,
  ModuleRegistry,
  GridApi,
  ColDef,
} from "ag-grid-community";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../lib/api";
import { AG_GRID_LOCALE_FR } from "@ag-grid-community/locale";

// ✅ Colonnes génériques
interface DataTableColumn<T = Record<string, unknown>> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}

// ✅ Props du tableau
interface DataTableProps<T = Record<string, unknown>> {
  columns: DataTableColumn<T>[];
  rowKey: (row: T) => string | number;
  className?: string;
  endpoint: string;
}

// ✅ Réponse API → tableau brut
type ApiResponse<T> = T[];

// Enregistre tous les modules communautaires d'ag-grid
ModuleRegistry.registerModules([AllCommunityModule]);

// ✅ Composant principal
export default function DataTable<T extends Record<string, unknown>>(
  props: DataTableProps<T>
) {
  const { columns, rowKey, className, endpoint } = props;

  // 🔹 Référence à l’API Ag-Grid
  const gridApiRef = useRef<GridApi | null>(null);

  // 🔹 Récupération des données depuis ton API
  const { data, isLoading, error } = useQuery<ApiResponse<T>>({
    queryKey: [endpoint],
    queryFn: async (): Promise<ApiResponse<T>> => {
      const response = (await apiClient.request(endpoint)) as unknown;

      if (Array.isArray(response)) {
        return response as T[];
      }

      // 🔹 fallback si jamais ce n’est pas un tableau
      return [];
    },
    placeholderData: (prev) => prev,
  });

  // 🔹 Colonnes dynamiques
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

  // 🔹 Définition par défaut des colonnes
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

  // 🔹 Callback quand la grille est prête
  const onGridReady = useCallback((e: { api: GridApi }) => {
    gridApiRef.current = e.api;
  }, []);

  return (
    <div className={className}>
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
        {isLoading && <p className="p-4 text-center">Chargement...</p>}
        {!isLoading && (data?.length || 0) === 0 && (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Aucune donnée trouvée
          </div>
        )}
        {error && (
          <div className="p-4 text-center text-sm text-red-500">
            Erreur de chargement
          </div>
        )}
      </div>
    </div>
  );
}
