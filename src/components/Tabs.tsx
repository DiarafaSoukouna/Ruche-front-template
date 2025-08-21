import { useState, ReactNode, Children, isValidElement, cloneElement } from 'react';

interface TabProps {
  id: string;
  label: string;
  count?: number;
  children: ReactNode;
}

interface TabsProps {
  children: ReactNode;
  defaultActiveTab?: string;
  className?: string;
  onAddTab?: () => void;
  addButtonLabel?: string;
}

// Composant Tab (pour wrapper le contenu de chaque onglet)
export const Tab = ({ children }: TabProps) => {
  return <>{children}</>;
};

// Composant Tabs principal
const Tabs = ({ 
  children, 
  defaultActiveTab, 
  className = '', 
  onAddTab,
  addButtonLabel = 'Ajouter' 
}: TabsProps) => {
  const [activeTab, setActiveTab] = useState<string>(defaultActiveTab || '');

  // Récupérer les tabs valides
  const tabs = Children.toArray(children).filter(
    (child): child is React.ReactElement<TabProps> => 
      isValidElement(child) && child.type === Tab
  );

  // Si aucun defaultActiveTab n'est fourni, prendre le premier tab
  if (!activeTab && tabs.length > 0) {
    setActiveTab(tabs[0].props.id);
  }

  const activeTabContent = tabs.find(tab => tab.props.id === activeTab)?.props.children;

  return (
    <div className={`w-full ${className}`}>
      <div className="flex border-b border-gray-200 items-center">
        {/* Boutons des tabs à gauche */}
        <div className="flex flex-1">
          {tabs.map((tab) => {
            const { id, label, count } = tab.props;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`py-2 px-4 font-medium text-sm focus:outline-none transition-all duration-200 flex items-center gap-2 ${
                  activeTab === id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                    : 'text-gray-500 hover:text-blue-500 hover:bg-gray-50'
                }`}
              >
                
                {label}
                {count !== undefined && (
                  <span className="bg-gray-200 text-gray-700 text-xs font-semibold px-2 py-1 rounded-full">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bouton Ajouter à droite */}
        {onAddTab && (
          <button
            onClick={onAddTab}
            className="ml-auto py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 focus:outline-none transition-colors duration-200 flex items-center gap-1"
          >
            <span>+</span>
            {addButtonLabel}
          </button>
        )}
      </div>
      <div className="p-4 bg-white rounded-b-lg shadow-sm">
        {activeTabContent}
      </div>
    </div>
  );
};

Tabs.Tab = Tab;

export default Tabs;