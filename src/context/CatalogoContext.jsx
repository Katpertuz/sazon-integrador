import { createContext, useContext, useState } from 'react';

const CatalogoContext = createContext();

const PRODUCTOS_INICIALES = [
  { id: 1, sku: 'ZEN-001', marca: 'Zenú', nombre: 'Salchicha Viena', gramaje: 400, precio: 12500 },
  { id: 2, sku: 'NOE-014', marca: 'Noel', nombre: 'Galletas Saltín', gramaje: 300, precio: 6800 },
  { id: 3, sku: 'COL-007', marca: 'Colcafé', nombre: 'Café Instantáneo', gramaje: 170, precio: 21900 },
];

export function CatalogoProvider({ children }) {
  const [productos, setProductos] = useState(PRODUCTOS_INICIALES);

  const eliminarProducto = (id) =>
    setProductos((prev) => prev.filter((p) => p.id !== id));

  return (
    <CatalogoContext.Provider value={{ productos, eliminarProducto }}>
      {children}
    </CatalogoContext.Provider>
  );
}

export const useCatalogo = () => useContext(CatalogoContext);