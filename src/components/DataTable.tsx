import React, { useMemo, useRef, useCallback, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-theme-quartz.css";

import { AllCommunityModule, ModuleRegistry, GridReadyEvent, ColDef } from "ag-grid-community";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { AG_GRID_LOCALE_FR } from "@ag-grid-community/locale";

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

// 🔹 Types pour les colonnes
export interface DataTableColumn<T = any> {
  header: string;
  accessor?: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}

// 🔹 Types des props
export interface DataTableProps<T = any> {
  columns: DataTableColumn<T>[];
  rowKey: (row: T) => string | number;
  className?: string;
  endpoint: string;
  serverPagination?: boolean;
}

// 🔹 Type pour la réponse API
interface ApiResponse<T> {
  rows: T[];
  total: number;
  isPaginated?: boolean;
}

export default function DataTable<T = any>({
  columns,
  rowKey,
  className,
  endpoint,
  serverPagination = false,
}: DataTableProps<T>) {
  // 🔹 États de pagination
  const [page, setPage] = useState(0); // index basé sur 0 pour ag-grid
  const [pageSize, setPageSize] = useState(10);

  // 🔹 Grid API ref
  const gridApiRef = useRef<any>(null);

  // 🔹 Récupération des données depuis le backend
  const { data, isLoading, error } = useQuery<ApiResponse<T>>({
    queryKey: [
      endpoint,
      serverPagination ? page : "all",
      serverPagination ? pageSize : "all",
    ],
    queryFn: async () => {
      let url = endpoint;

      if (serverPagination) {
        const backendPage = page + 1; // Le backend attend une pagination basée sur 1
        url = `${endpoint}?page=${backendPage}&limit=${pageSize}`;
      }

      const response = await api.request(url, { requireAuth: true });

      const entityKey = Object.keys(response).find((key) =>
        Array.isArray(response[key])
      );
      if (entityKey && response[entityKey]) {
        return {
          rows: response[entityKey],
          total: response.total || response[entityKey].length,
          isPaginated: response.isPaginated,
        };
      }

      return {
        rows: [],
        total: 0,
        isPaginated: false,
      };
    },
    placeholderData: (previousData) => previousData,
  });

  // 🔹 Colonnes
  const columnDefs: ColDef[] = useMemo(() => {
    return columns.map((col) => {
      const def: ColDef = {
        headerName: col.header,
        sortable: true,
        filter: true,
        resizable: true,
      };

      if (typeof col.accessor === "string") {
        const key = col.accessor as keyof T;
        def.valueGetter = (params) => {
          const record = params.data as T;
          const v = record?.[key];
          return typeof v === "number" || typeof v === "string" ? v : "";
        };
      } else if (typeof col.accessor === "function") {
        const accessor = col.accessor as (row: T) => React.ReactNode;
        def.cellRenderer = (params) => accessor(params.data as T);
      }
      return def;
    });
  }, [columns]);

  const defaultColDef: ColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
      flex: 1,
      minWidth: 120,
    }),
    []
  );

  const onGridReady = useCallback((e: GridReadyEvent) => {
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
          onPaginationChanged={serverPagination ? onPaginationChanged : undefined}
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
