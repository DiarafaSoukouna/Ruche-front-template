import { useState } from "react";
import PlanSiteList from "./PlanSiteList";
import PlanSiteForm from "./PlanSiteForm";
import type { PlanSite } from "../../../types/entities";
import Modal from "../../../components/Modal";

export default function PlanSitePage() {
  const [showForm, setShowForm] = useState(false);
  const [editingPlanSite, setEditingPlanSite] = useState<PlanSite | undefined>();

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

  return (
    <div className="p-6">
      <PlanSiteList onAdd={handleAdd} onEdit={handleEdit} />
      <Modal
        isOpen={showForm}
        onClose={handleCloseForm}
        title={editingPlanSite ? "Modifier le plan de site" : "Ajouter un plan de site"}
        size="md"
      >
        <PlanSiteForm planSite={editingPlanSite} onClose={handleCloseForm} />
      </Modal>
    </div>
  );
}
