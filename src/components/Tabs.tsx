import React, { useState, createContext, useContext } from 'react';
import { motion } from 'framer-motion';

// Types pour TypeScript
interface TabsContextType {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

// Hook personnalisé pour utiliser le contexte
const useTabs = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('useTabs must be used within a TabsProvider');
  }
  return context;
};

// Composant Tabs principal
interface TabsProps {
  defaultValue: string;
  children: React.ReactNode;
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({ defaultValue, children, className = '' }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={`w-full ${className}`}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

// Composant TabsList
interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

const TabsList: React.FC<TabsListProps> = ({ children, className = '' }) => {
  return (
    <div className="relative border-b border-gray-200">
      <div className={`relative flex w-full justify-start bg-transparent p-0 h-auto ${className}`}>
        {children}
      </div>
    </div>
  );
};

// Composant TabsTrigger
interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, children, className = '' }) => {
  const { activeTab, setActiveTab } = useTabs();

  return (
    <button
      value={value}
      onClick={() => setActiveTab(value)}
      className={`relative px-6 py-3 text-sm font-medium tracking-wide transition-all 
        ${activeTab === value 
          ? 'text-green-600 font-semibold' 
          : 'text-gray-500'
        } bg-transparent rounded-none border-0 ${className}`}
    >
      {children}
      {activeTab === value && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"
          layoutId="activeTabIndicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </button>
  );
};

// Composant TabsContent
interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

const TabsContent: React.FC<TabsContentProps> = ({ value, children, className = '' }) => {
  const { activeTab } = useTabs();

  if (activeTab !== value) return null;

  return (
    <div className={className}>
      {children}
    </div>
  );
};
export { Tabs, TabsList, TabsTrigger, TabsContent };