import { useState } from "react";
import { List, GitBranch } from "lucide-react";
import PlanSiteList from "./PlanSiteList";
import PlanSiteForm from "./PlanSiteForm";
import PlanSiteDetails from "./PlanSiteDetails";
import PlanSiteHierarchy from "./PlanSiteHierarchy";
import type { PlanSite } from "../../../types/entities";
import Modal from "../../../components/Modal";

type ViewMode = 'list' | 'hierarchy';

export default function PlanSitePage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [editingPlanSite, setEditingPlanSite] = useState<PlanSite | undefined>();
  const [selectedPlanSiteId, setSelectedPlanSiteId] = useState<number | null>(null);

  const handleAdd = () => {
    setEditingPlanSite(undefined);
    setShowForm(true);
  };

  const handleEdit = (planSite: PlanSite) => {
    setEditingPlanSite(planSite);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPlanSite(undefined);
  };

  const handleViewDetails = (planSiteId: number) => {
    setSelectedPlanSiteId(planSiteId);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedPlanSiteId(null);
  };

  const handleEditFromDetails = (planSite: PlanSite) => {
    setEditingPlanSite(planSite);
    setShowDetails(false);
    setShowForm(true);
  };

  return (
    <div className="p-6">
      {/* View Mode Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setViewMode('list')}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                viewMode === 'list'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <List className="h-4 w-4" />
              Vue Liste
            </button>
            <button
              onClick={() => setViewMode('hierarchy')}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                viewMode === 'hierarchy'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <GitBranch className="h-4 w-4" />
              Vue Hiérarchique
            </button>
          </nav>
        </div>
      </div>

      {/* Content based on view mode */}
      {viewMode === 'list' ? (
        <PlanSiteList 
          onAdd={handleAdd} 
          onEdit={handleEdit} 
          onViewDetails={handleViewDetails}
        />
      ) : (
        <PlanSiteHierarchy
          onAdd={handleAdd}
          onEdit={handleEdit}
          onViewDetails={handleViewDetails}
        />
      )}
      
      {/* Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={handleCloseForm}
        title={editingPlanSite ? "Modifier la structure" : "Nouvelle structure"}
        size="lg"
      >
        <PlanSiteForm planSite={editingPlanSite} onClose={handleCloseForm} />
      </Modal>

      {/* Details Modal */}
      <Modal
        isOpen={showDetails}
        onClose={handleCloseDetails}
        title="Détails de la structure"
        size="xl"
      >
        {selectedPlanSiteId && (
          <PlanSiteDetails 
            planSiteId={selectedPlanSiteId}
            onClose={handleCloseDetails}
            onEdit={handleEditFromDetails}
          />
        )}
      </Modal>
    </div>
  );
}
