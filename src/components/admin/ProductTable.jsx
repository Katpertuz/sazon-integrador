import { useState } from 'react';
import { useCatalogo } from '../../context/CatalogoContext';
import './ProductTable.css';

const formatoCOP = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

// "Zenú" -> "zenu", "Colcafé" -> "colcafe" (para la clase CSS del badge)
const claseMarca = (marca) =>
  marca.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export default function ProductTable({ onNuevo, onEditar }) {
  const { productos, eliminarProducto } = useCatalogo();
  const [productoAEliminar, setProductoAEliminar] = useState(null);

  const confirmarEliminacion = () => {
    eliminarProducto(productoAEliminar.id);
    setProductoAEliminar(null);
  };

  return (
    <div className="product-table">
      <div className="product-table__header">
        <h2>Inventario maestro</h2>
        <button className="btn btn--primary" onClick={onNuevo}>
          Nuevo Producto
        </button>
      </div>

      {productos.length === 0 ? (
        <p className="product-table__vacio">No hay productos en el inventario.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Marca</th>
              <th>Nombre</th>
              <th>Gramaje</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.id}>
                <td>{p.sku}</td>
                <td>
                  <span className={`badge badge--${claseMarca(p.marca)}`}>
                    {p.marca}
                  </span>
                </td>
                <td>{p.nombre}</td>
                <td>{p.gramaje} g</td>
                <td>{formatoCOP.format(p.precio)}</td>
                <td>
                  <button className="btn" onClick={() => onEditar(p)}>
                    Editar
                  </button>
                  <button
                    className="btn btn--danger"
                    onClick={() => setProductoAEliminar(p)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {productoAEliminar && (
        <div className="modal-overlay">
          <div className="modal">
            <p>
              ¿Seguro que quieres eliminar{' '}
              <strong>{productoAEliminar.nombre}</strong>?
            </p>
            <button className="btn" onClick={() => setProductoAEliminar(null)}>
              Cancelar
            </button>
            <button className="btn btn--danger" onClick={confirmarEliminacion}>
              Sí, eliminar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}