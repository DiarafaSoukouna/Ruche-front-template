// Utility functions for CadreStrategique level management

export const stringToTableau = (str: string): string[] => {
  if (!str) return [];
  return str.split(',').map(item => item.trim()).filter(item => item.length > 0);
};

export const tableauToString = (arr: string[]): string => {
  return arr.join(',');
};

export const getTypeLabel = (type: string): string => {
  const typeLabels: { [key: string]: string } = {
    '1': 'Effet',
    '2': 'Produit', 
    '3': 'Impact'
  };
  return typeLabels[type] || type;
};

export const getTypeOptions = () => [
  { value: '1', label: 'Effet' },
  { value: '2', label: 'Produit' },
  { value: '3', label: 'Impact' }
];
