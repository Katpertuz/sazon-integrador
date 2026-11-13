import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import CatalogoView from '../views/CatalogoView';
import ProductDetailView from '../views/ProductDetailView';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/catalogo" element={<CatalogoView />} />
        <Route path="/catalogo/:id" element={<ProductDetailView />} />
        <Route path="*" element={<Navigate to="/catalogo" replace />} />
      </Routes>
    </HashRouter>
  </StrictMode>
);