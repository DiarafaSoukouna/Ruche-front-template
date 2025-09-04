const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 rounded-full animate-spin border-t-primary/60 mx-auto mb-4"></div>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-12 border-2 border-transparent border-t-primary/40 rounded-full animate-spin" style={{animationDuration: '0.8s'}}></div>
        </div>
        <h2 className="text-xl font-semibold text-primary mb-2">Chargement...</h2>
        <p className="text-primary">Préparation de votre espace d'administration</p>
      </div>
    </div>
  );
};

export default LoadingScreen;