import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto mb-4"></div>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-12 border-2 border-transparent border-t-blue-400 rounded-full animate-spin" style={{animationDuration: '0.8s'}}></div>
        </div>
        <h2 className="text-xl font-semibold text-blue-700 mb-2">Chargement...</h2>
        <p className="text-blue-500">Préparation de votre espace d'administration</p>
      </div>
    </div>
  );
};

export default LoadingScreen;