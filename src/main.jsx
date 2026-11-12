import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Header from './components/Header'
import { CatalogoProvider } from './context/CatalogoContext';
import AdminCatalogoView from './views/AdminCatalogoView';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CatalogoProvider>
      <AdminCatalogoView />
    </CatalogoProvider>
  </StrictMode>
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Header />
  </StrictMode>,
)
