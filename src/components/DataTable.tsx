import React, { useMemo, useRef, useCallback, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-theme-quartz.css";

import { AllCommunityModule, ModuleRegistry, GridApi } from "ag-grid-community";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../lib/api";
import { AG_GRID_LOCALE_FR } from "@ag-grid-community/locale";

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

interface DataTableColumn {
  header: string;
  accessor: string | ((row: Record<string, unknown>) => React.ReactNode);
  className?: string;
}

interface DataTableProps {
  columns: DataTableColumn[];
  rowKey: (row: Record<string, unknown>) => string | number;
  className?: string;
  endpoint: string;
  serverPagination?: boolean;
}

interface ApiResponse {
  rows?: Record<string, unknown>[];
  total?: number;
  isPaginated?: boolean;
  [key: string]: unknown;
}

export default function DataTable(props: DataTableProps) {
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
  const { data, isLoading, error } = useQuery<ApiResponse>({
    queryKey: [
      endpoint,
      serverPagination ? page : "all",
      serverPagination ? pageSize : "all",
    ],
    queryFn: async (): Promise<ApiResponse> => {
      let url = endpoint;

      if (serverPagination) {
        const backendPage = page + 1; // Le backend attend une pagination basée sur 1
        url = `${endpoint}?page=${backendPage}&limit=${pageSize}`;
      }

      const response = await apiClient.request<ApiResponse>(url, { requireAuth: true });

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

      return response;
    },
    placeholderData: (previousData) => previousData,
  });

  // 🔹 Colonnes
  const columnDefs = useMemo(() => {
    return columns.map((col) => {
      const def: Record<string, unknown> = {
        headerName: col.header,
        sortable: true,
        filter: true,
        resizable: true,
      };

      if (typeof col.accessor === "string") {
        const key = col.accessor;
        def.valueGetter = (params: { data?: Record<string, unknown> }) => {
          const record = params.data || {};
          const v = record[key];
          return typeof v === "number" || typeof v === "string" ? v : "";
        };
      } else if (typeof col.accessor === "function") {
        const accessor = col.accessor;
        def.cellRenderer = (params: { data?: Record<string, unknown> }) => accessor(params.data || {});
      }
      return def;
    });
  }, [columns]);

  const defaultColDef = useMemo(
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
        <AgGridReact
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
