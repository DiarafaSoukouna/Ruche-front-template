import { useState, useEffect } from "react";
import { Calendar, Check } from "lucide-react";
import { getMoisOptions } from "../../../schemas/ptbaSchemas";

interface ChronogrammeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function ChronogrammeSelector({
  value,
  onChange,
  error,
}: ChronogrammeSelectorProps) {
  const [selectedMois, setSelectedMois] = useState<string[]>([]);
  const moisOptions = getMoisOptions();

  // Initialiser les mois sélectionnés à partir de la valeur
  useEffect(() => {
    if (value) {
      const mois = value
        .split(",")
        .map((m) => m.trim())
        .filter(Boolean);
      setSelectedMois(mois);
    }
  }, [value]);

  // Mettre à jour la valeur quand les mois sélectionnés changent
  useEffect(() => {
    const chronogrammeValue = selectedMois.join(", ");
    onChange(chronogrammeValue);
  }, [selectedMois, onChange]);

  const toggleMois = (moisValue: string) => {
    setSelectedMois((prev) => {
      if (prev.includes(moisValue)) {
        return prev.filter((m) => m !== moisValue);
      } else {
        // Maintenir l'ordre chronologique
        const newMois = [...prev, moisValue];
        return newMois.sort((a, b) => {
          const indexA = moisOptions.findIndex((m) => m.value === a);
          const indexB = moisOptions.findIndex((m) => m.value === b);
          return indexA - indexB;
        });
      }
    });
  };

  const selectAll = () => {
    setSelectedMois(moisOptions.map((m) => m.value));
  };

  const clearAll = () => {
    setSelectedMois([]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Chronogramme (mois concernés) *
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={selectAll}
            className="text-xs text-primary hover:text-primary/90"
          >
            Tout sélectionner
          </button>
          <button
            type="button"
            onClick={clearAll}
            className="text-xs text-muted-foreground hover:text-muted-foreground/90"
          >
            Tout désélectionner
          </button>
        </div>
      </div>

      {/* Grille des mois */}
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {moisOptions.map((mois) => {
          const isSelected = selectedMois.includes(mois.value);
          return (
            <button
              key={mois.value}
              type="button"
              onClick={() => toggleMois(mois.value)}
              className={`
                relative flex items-center justify-center p-3 rounded-lg border-2 transition-all
                ${
                  isSelected
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                }
              `}
            >
              <div className="flex flex-col items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span className="text-xs font-medium">{mois.value}</span>
              </div>

              {isSelected && (
                <div className="absolute -top-1 -right-1 bg-primary text-white rounded-full p-0.5">
                  <Check className="h-3 w-3" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Aperçu de la sélection */}
      {selectedMois.length > 0 && (
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-700">
            <strong>Mois sélectionnés :</strong> {selectedMois.join(", ")}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {selectedMois.length} mois sur 12
          </div>
        </div>
      )}

      {/* Message d'erreur */}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Aide */}
      <div className="text-xs text-gray-500">
        Sélectionnez les mois pendant lesquels cette activité sera réalisée.
      </div>
    </div>
  );
}
