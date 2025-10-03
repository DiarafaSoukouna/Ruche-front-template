import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import versionPtbaService from "../../services/versionPtbaService";
import type { VersionPtba } from "../../types/entities";
import VersionPtbaManager from "./version-ptba/VersionPtbaManager";
import { Settings, Plus } from "lucide-react";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import PtbaPlanificationTable from "./PtbaPlanificationTable";
import TypeActiviteManager from "./type-activite/TypeActiviteManager";

export default function PtbaPage() {
  // États pour les modales
  const [showVersionManager, setShowVersionManager] = useState(false);
  const [showTypeActiviteManager, setShowTypeActiviteManager] = useState(false);

  // Fetch versions PTBA
  const { data: versions = [] } = useQuery<VersionPtba[]>({
    queryKey: ["versions-ptba"],
    queryFn: versionPtbaService.getAll,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Plan de Travail et Budget Annuel (PTBA)
          </h1>
          <p className="text-gray-600 mt-1">
            Gestion des versions et activités du PTBA
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowVersionManager(true)}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Gestion des versions
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowTypeActiviteManager(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Types d'activités
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">
            {versions.length}
          </div>
          <div className="text-sm text-muted-foreground">Versions PTBA</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">
            {versions.filter((v) => v.statut_version === 1).length}
          </div>
          <div className="text-sm text-muted-foreground">Versions validées</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-2xl font-bold text-orange-600">
            {versions.filter((v) => v.statut_version === 0).length}
          </div>
          <div className="text-sm text-muted-foreground">En construction</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-600">
            {new Set(versions.map((v) => v.annee_ptba)).size}
          </div>
          <div className="text-sm text-muted-foreground">Années couvertes</div>
        </div>
      </div>

      {/* Plan opérationnel */}
      <PtbaPlanificationTable />

      {/* Modales */}
      <Modal
        isOpen={showVersionManager}
        onClose={() => setShowVersionManager(false)}
        title="Gestion des versions PTBA"
        size="xl"
      >
        <VersionPtbaManager />
      </Modal>

      <Modal
        isOpen={showTypeActiviteManager}
        onClose={() => setShowTypeActiviteManager(false)}
        title="Gestion des types d'activités"
        size="lg"
      >
        <TypeActiviteManager />
      </Modal>
    </div>
  );
}
