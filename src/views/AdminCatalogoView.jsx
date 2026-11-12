import { useState } from 'react';
import ProductTable from '../components/admin/ProductTable';
// import ProductForm from '../components/admin/ProductForm'; // si ya existe

export default function AdminCatalogoView() {
  const [formAbierto, setFormAbierto] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null); // null = modo creación

  const abrirCreacion = () => {
    setProductoEditando(null);
    setFormAbierto(true);
  };

  const abrirEdicion = (producto) => {
    setProductoEditando(producto);
    setFormAbierto(true);
  };

  const cerrarFormulario = () => setFormAbierto(false);

  return (
    <section>
      <ProductTable onNuevo={abrirCreacion} onEditar={abrirEdicion} />

      {formAbierto && (
        // Si ya existe ProductForm, reemplaza este bloque por:
        // <ProductForm producto={productoEditando} onCerrar={cerrarFormulario} />
        <div className="modal-overlay">
          <div className="modal">
            <p>
              {productoEditando
                ? `Editando: ${productoEditando.nombre}`
                : 'Nuevo producto'}
            </p>
            <button className="btn" onClick={cerrarFormulario}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </section>
  );
}