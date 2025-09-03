import { PlusIcon } from "lucide-react";
import { useState, ReactNode, Children, isValidElement } from "react";
import Button from "./Button";

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
  defaulBoutonLabel?: string;
  parentProp: (index: number) => void;
  tabActiveProps: (index: number) => void;
  onAddTab: (bool: boolean, niv: number, parent: number) => void;
  setAddBoutonLabel: (label: string) => void;
}

export const Tab = ({ children }: TabProps) => {
  return <>{children}</>;
};

<<<<<<< HEAD
const Tabs = ({
  children,
  defaultActiveTab,
  className = "",
=======
const TabsLocalites = ({ 
  children, 
  defaultActiveTab, 
  className = '', 
>>>>>>> 3b9f76935ed15856628e4688a1c7129a24947bc5
  defaulBoutonLabel,
  setAddBoutonLabel,
  onAddTab,
  parentProp,
  tabActiveProps,
}: TabsProps) => {
  const [activeTab, setActiveTab] = useState<string>(defaultActiveTab || "");
  const [parent, setParent] = useState(0);

  const tabs = Children.toArray(children).filter(
    (child): child is React.ReactElement<TabProps> =>
      isValidElement(child) && child.type === Tab
  );

  if (!activeTab && tabs.length > 0) {
    setActiveTab(tabs[0].props.id);
    tabActiveProps(Number(tabs[0].props.id));
  }

  const activeTabContent = tabs.find((tab) => tab.props.id === activeTab)?.props
    .children;

  return (
    <div className={`w-full ${className}`}>
      <div className="flex border-b border-border items-center">
        <div className="flex flex-1">
          {tabs.map((tab, index) => {
            const { id, label, count } = tab.props;
            return (
              <button
                key={id}
                onClick={() => {
                  setActiveTab(id);
                  setAddBoutonLabel(label);
                  setParent(index);
                  parentProp(index);
                  tabActiveProps(Number(id));
                }}
                className={`py-2 px-4 font-medium text-sm focus:outline-none transition-all duration-200 flex items-center gap-2 ${
                  activeTab === id
                    ? "text-primary border-b-2 border-primary bg-primary/10"
                    : "text-muted-foreground hover:text-primary hover:bg-muted"
                }`}
              >
                {count !== undefined && (
                  <span className="bg-muted text-foreground text-xs font-semibold px-2 py-1 rounded-full">
                    {count}
                  </span>
                )}
                {label}
              </button>
            );
          })}
        </div>
        {activeTab && (
          <Button
            onClick={() => onAddTab(true, Number(activeTab), parent)}
            variant="primary"
          >
            <PlusIcon className="w-4 h-4" />
            Nouvelle {defaulBoutonLabel}
          </Button>
        )}
      </div>
      <div className="mt-4 bg-card rounded-b-lg shadow-sm">
        {activeTabContent}
      </div>
    </div>
  );
};

TabsLocalites .Tab = Tab;

<<<<<<< HEAD
export default Tabs;
=======
export default TabsLocalites  ;
>>>>>>> 3b9f76935ed15856628e4688a1c7129a24947bc5
