import React, { useMemo, useRef, useCallback, useState } from "react";
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
interface DataTableColumn<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

// ✅ Définition des colonnes
interface DataTableColumn<T = Record<string, unknown>> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}

// ✅ Props génériques
interface DataTableProps<T = Record<string, unknown>> {
  columns: DataTableColumn<T>[];
  rowKey: (row: T) => string | number;
  className?: string;
  endpoint: string;
  serverPagination?: boolean;
}

// ✅ Réponse API standardisée
interface ApiResponse<T = Record<string, unknown>> {
  rows: T[];
  total: number;
  isPaginated?: boolean;
  [key: string]: unknown;
}

// ✅ Composant
export default function DataTable<T extends Record<string, unknown>>(
  props: DataTableProps<T>
) {
  const {
    columns,
    rowKey,
    className,
    endpoint,
    serverPagination = false,
  } = props;

  // 🔹 États de pagination
  const [page, setPage] = useState(0); // index basé sur 0 pour ag-grid
  const [pageSize, setPageSize] = useState(10);

  // 🔹 Grid API ref
  const gridApiRef = useRef<GridApi | null>(null);

  // 🔹 Récupération des données depuis le backend
  const { data, isLoading, error } = useQuery<ApiResponse<T>>({
    queryKey: [
      endpoint,
      serverPagination ? page : "all",
      serverPagination ? pageSize : "all",
    ],
    queryFn: async (): Promise<ApiResponse<T>> => {
      let url = endpoint;

      if (serverPagination) {
        const backendPage = page + 1; // Le backend attend une pagination basée sur 1
        url = `${endpoint}?page=${backendPage}&limit=${pageSize}`;
      }

      const response = (await apiClient.request(url, { requireAuth: true })) as Record<string, unknown>;

      // ✅ On peut maintenant utiliser Object.keys
      const entityKey = Object.keys(response).find(
        (key) => Array.isArray(response[key])
      );

      if (entityKey && Array.isArray(response[entityKey])) {
        return {
          rows: response[entityKey] as T[],
          total: (response.total as number) || (response[entityKey] as T[]).length,
          isPaginated: response.isPaginated as boolean,
        };
      }


      // 🔹 Retour fallback valide (même si vide)
      return {
        rows: [],
        total: 0,
        isPaginated: false,
      };
    },
    placeholderData: (previousData) => previousData,
  });

  // 🔹 Colonnes
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
          const record = params.data || {} as T;
          const v = record[key];
          return typeof v === "number" || typeof v === "string" ? v : "";
        };
      } else if (typeof col.accessor === "function") {
        const accessor = col.accessor;
        def.cellRenderer = (params: ICellRendererParams<T>) => accessor(params.data as T);
      }



      return def;
    });
  }, [columns]);

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

  const onGridReady = useCallback((e: { api: GridApi }) => {
    gridApiRef.current = e.api;
  }, []);

  const onPaginationChanged = useCallback(() => {
    if (!gridApiRef.current) return;
    const currentPage = gridApiRef.current.paginationGetCurrentPage();
    const size = gridApiRef.current.paginationGetPageSize();
    setPage(currentPage);
    setPageSize(size);
  }, []);

  return (
    <div className={className}>
      <div className="ag-theme-quartz" style={{ width: "100%" }}>
        <AgGridReact<T>
          localeText={AG_GRID_LOCALE_FR}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowData={data?.rows || []}
          getRowId={(p) => String(rowKey(p.data))}
          domLayout="autoHeight"
          rowHeight={44}
          headerHeight={40}
          pagination={true}
          paginationPageSize={pageSize}
          paginationPageSizeSelector={[10, 20, 50, 100]}
          onGridReady={onGridReady}
          onPaginationChanged={
            serverPagination ? onPaginationChanged : undefined
          }
          suppressPaginationPanel={false}
        />
        {isLoading && <p className="p-4 text-center">Chargement...</p>}
        {!isLoading && data?.rows?.length === 0 && (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Aucune donnée trouvée
          </div>
        )}
        {error && (
          <div className="p-4 text-center text-sm text-red-500">
            Erreur de chargement
          </div>
        )}
        {serverPagination && (
          <div className="p-2 text-sm text-muted-foreground">
            Page {page + 1} sur {Math.ceil((data?.total || 0) / pageSize)}
          </div>
        )}
      </div>
    </div>
  );
}
