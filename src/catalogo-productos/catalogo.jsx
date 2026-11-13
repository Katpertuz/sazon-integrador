import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import '../index.css'
import Header from '../components/Header'
import CatalogoView from '../views/CatalogoView'
import ProductDetailView from '../views/ProductDetailView'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <Header>
        <Routes>
          <Route path="/" element={<CatalogoView />} />
          <Route path="/catalogo/:id" element={<ProductDetailView />} />
        </Routes>
      </Header>
    </HashRouter>
  </StrictMode>,
)