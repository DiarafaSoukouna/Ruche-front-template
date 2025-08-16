import React, { useMemo, useRef, useCallback, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-theme-quartz.css";

import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { AG_GRID_LOCALE_FR } from "@ag-grid-community/locale";

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

/**
 * @typedef {Object} DataTableColumn
 * @property {string} header - Titre affiché dans l'entête de la colonne.
 * @property {string|function(Object):React.ReactNode} [accessor] - Nom de la clé dans les données ou fonction de rendu personnalisée.
 * @property {string} [className] - Classe CSS optionnelle appliquée à la colonne.
 */

/**
 * @typedef {Object} DataTableProps
 * @property {DataTableColumn[]} columns - Liste des colonnes à afficher.
 * @property {function(Object):string|number} rowKey - Fonction qui retourne une clé unique pour chaque ligne.
 * @property {string} [className] - Classe CSS appliquée au wrapper.
 * @property {string} endpoint - URL API pour récupérer les données (ex: `"admin/users"`).
 * @property {boolean} [serverPagination=false] - Active la pagination côté serveur si `true`.
 */

/**
 * Tableau générique basé sur AG Grid.
 *
 * - Supporte la pagination côté client ou côté serveur.
 * - Colonnes configurables avec des clés ou des renderers personnalisés.
 * - Affiche les états `Chargement`, `Erreur` et `Aucune donnée`.
 *
 * @param {DataTableProps} props - Props du composant DataTable.
 * @returns {JSX.Element}
 */
export default function DataTable(props) {
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
  const gridApiRef = useRef(null);

  // 🔹 Récupération des données depuis le backend
  const { data, isLoading, error } = useQuery({
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

      return response;
    },
    placeholderData: (previousData) => previousData,
  });

  // 🔹 Colonnes
  const columnDefs = useMemo(() => {
    return columns.map((col) => {
      const def = {
        headerName: col.header,
        sortable: true,
        filter: true,
        resizable: true,
      };

      if (typeof col.accessor === "string") {
        const key = col.accessor;
        def.valueGetter = (params) => {
          const record = params.data || {};
          const v = record[key];
          return typeof v === "number" || typeof v === "string" ? v : "";
        };
      } else if (typeof col.accessor === "function") {
        const accessor = col.accessor;
        def.cellRenderer = (params) => accessor(params.data);
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

  const onGridReady = useCallback((e) => {
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
