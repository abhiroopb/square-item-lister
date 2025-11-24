import { createContext, useContext, useState } from 'react';

const ItemContext = createContext();

export function useItem() {
  const context = useContext(ItemContext);
  if (!context) {
    throw new Error('useItem must be used within ItemProvider');
  }
  return context;
}

export function ItemProvider({ children }) {
  const [item, setItem] = useState({
    originalImage: null,
    enhancedImage: null,
    title: '',
    description: '',
    price: 0,
    imagePath: null,
    enhancedPath: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const updateItem = (updates) => {
    setItem(prev => ({ ...prev, ...updates }));
  };

  const resetItem = () => {
    setItem({
      originalImage: null,
      enhancedImage: null,
      title: '',
      description: '',
      price: 0,
      imagePath: null,
      enhancedPath: null,
    });
    setError(null);
    setSuccess(null);
  };

  return (
    <ItemContext.Provider value={{
      item,
      updateItem,
      resetItem,
      loading,
      setLoading,
      error,
      setError,
      success,
      setSuccess,
    }}>
      {children}
    </ItemContext.Provider>
  );
}
