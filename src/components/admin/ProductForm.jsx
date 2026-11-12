import React, { useState, useEffect } from 'react';
import { validarSKU, validarSelectores, validarNumericos, MARCAS_NUTRESA } from '../../utils/catalogoValidators';

export default function ProductForm({ 
  modo = 'crear', 
  productoInicial = null, 
  onClose, 
  onSuccess, 
  productosExistentes = [] 
}) {
  
  const [sku, setSku] = useState(productoInicial?.sku || '');
  const [nombre, setNombre] = useState(productoInicial?.nombre || '');
  const [marca, setMarca] = useState(productoInicial?.marca || '');
  const [categoria, setCategoria] = useState(productoInicial?.categoria || '');
  const [precio, setPrecio] = useState(productoInicial?.precio || '');
  const [gramaje, setGramaje] = useState(productoInicial?.gramaje || '');

  
  const [errores, setErrores] = useState({});
  const [touched, setTouched] = useState({});

  
  useEffect(() => {
    const errorSku = validarSKU(sku, productosExistentes, modo, productoInicial?.sku);
    const erroresSelectores = validarSelectores(marca, categoria);
    const erroresNumericos = validarNumericos(precio, gramaje);

    setErrores({
      sku: errorSku,
      marca: erroresSelectores.marca || '',
      categoria: erroresSelectores.categoria || '',
      precio: erroresNumericos.precio || '',
      gramaje: erroresNumericos.gramaje || '',
      nombre: !nombre.trim() ? 'El nombre del producto es obligatorio.' : '',
    });
  }, [sku, nombre, marca, categoria, precio, gramaje, modo, productoInicial, productosExistentes]);

  
  const hayErrores = Object.values(errores).some((err) => err !== '');

  const handleBlur = (campo) => {
    setTouched((prev) => ({ ...prev, [campo]: true }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    setTouched({
      sku: true,
      nombre: true,
      marca: true,
      categoria: true,
      precio: true,
      gramaje: true,
    });

    if (hayErrores) return;

    const productoData = {
      id: productoInicial?.id || Date.now(),
      sku: sku.trim(),
      nombre: nombre.trim(),
      marca,
      categoria: categoria.trim(),
      precio: Number(precio),
      gramaje: Number(gramaje),
    };

    if (onSuccess) {
      onSuccess(productoData, modo);
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-sazon-marfil dark:bg-sazon-verdeNutresaCard text-sazon-texto dark:text-sazon-marfil w-full max-w-xl rounded-2xl shadow-2xl border border-[#DAD9C4] dark:border-white/10 p-6 sm:p-8 transition-all">
        
        {/* Cabecera con Logotipo e Identidad Sa·zón */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#DAD9C4] dark:border-white/10">
          <div className="flex items-center gap-2">
            <h2 className="font-poppins font-bold text-2xl text-sazon-verdeNoche dark:text-sazon-marfil tracking-tight m-0">
              Sa<span className="text-sazon-hoja">·</span>zón
            </h2>
            <span className="text-xs font-mono-tag px-2.5 py-1 rounded-full bg-sazon-verdeHondo/10 dark:bg-sazon-hoja/20 text-sazon-verdeHondo dark:text-sazon-hoja">
              {modo === 'crear' ? 'Registrar Producto' : 'Modificar Producto'}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-sazon-texto2 dark:text-sazon-marfil/70 hover:text-sazon-verdeNoche dark:hover:text-white font-mono-tag text-sm transition-colors cursor-pointer"
            aria-label="Cerrar formulario"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* Formulario Controlado */}
        <form onSubmit={handleSubmit} className="space-y-4 font-inter text-sm">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* SKU */}
            <div>
              <label className="block font-mono-tag text-xs font-semibold text-sazon-verdeNoche dark:text-sazon-marfil mb-1">
                SKU *
              </label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                onBlur={() => handleBlur('sku')}
                placeholder="Ej. ZEN-001"
                className={`w-full px-3 py-2 rounded-lg bg-white dark:bg-sazon-verdeNutresa border ${
                  touched.sku && errores.sku ? 'border-red-600 ring-1 ring-red-600' : 'border-[#DAD9C4] dark:border-white/20'
                } focus:outline-none focus:ring-2 focus:ring-sazon-verdeHoja dark:focus:ring-sazon-hoja text-gray-900 dark:text-white font-mono-tag`}
              />
              {touched.sku && errores.sku && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1 font-mono-tag">{errores.sku}</p>
              )}
            </div>

            {/* Nombre del producto */}
            <div>
              <label className="block font-mono-tag text-xs font-semibold text-sazon-verdeNoche dark:text-sazon-marfil mb-1">
                Nombre *
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                onBlur={() => handleBlur('nombre')}
                placeholder="Ej. Salchicha Zenú 500g"
                className={`w-full px-3 py-2 rounded-lg bg-white dark:bg-sazon-verdeNutresa border ${
                  touched.nombre && errores.nombre ? 'border-red-600 ring-1 ring-red-600' : 'border-[#DAD9C4] dark:border-white/20'
                } focus:outline-none focus:ring-2 focus:ring-sazon-verdeHoja dark:focus:ring-sazon-hoja text-gray-900 dark:text-white`}
              />
              {touched.nombre && errores.nombre && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1 font-mono-tag">{errores.nombre}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Marca (Selectores Nutresa) */}
            <div>
              <label className="block font-mono-tag text-xs font-semibold text-sazon-verdeNoche dark:text-sazon-marfil mb-1">
                Marca Nutresa *
              </label>
              <select
                value={marca}
                onChange={(e) => setMarca(e.target.value)}
                onBlur={() => handleBlur('marca')}
                className={`w-full px-3 py-2 rounded-lg bg-white dark:bg-sazon-verdeNutresa border ${
                  touched.marca && errores.marca ? 'border-red-600 ring-1 ring-red-600' : 'border-[#DAD9C4] dark:border-white/20'
                } focus:outline-none focus:ring-2 focus:ring-sazon-verdeHoja dark:focus:ring-sazon-hoja text-gray-900 dark:text-white font-mono-tag`}
              >
                <option value="">Seleccione marca...</option>
                {MARCAS_NUTRESA.map((m) => (
                  <option key={m} value={m} className="text-gray-900 bg-white">{m}</option>
                ))}
              </select>
              {touched.marca && errores.marca && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1 font-mono-tag">{errores.marca}</p>
              )}
            </div>

            {/* Categoría */}
            <div>
              <label className="block font-mono-tag text-xs font-semibold text-sazon-verdeNoche dark:text-sazon-marfil mb-1">
                Categoría *
              </label>
              <input
                type="text"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                onBlur={() => handleBlur('categoria')}
                placeholder="Ej. Carnes Frías, Galletas, Pastas"
                className={`w-full px-3 py-2 rounded-lg bg-white dark:bg-sazon-verdeNutresa border ${
                  touched.categoria && errores.categoria ? 'border-red-600 ring-1 ring-red-600' : 'border-[#DAD9C4] dark:border-white/20'
                } focus:outline-none focus:ring-2 focus:ring-sazon-verdeHoja dark:focus:ring-sazon-hoja text-gray-900 dark:text-white`}
              />
              {touched.categoria && errores.categoria && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1 font-mono-tag">{errores.categoria}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Precio */}
            <div>
              <label className="block font-mono-tag text-xs font-semibold text-sazon-verdeNoche dark:text-sazon-marfil mb-1">
                Precio (COP) *
              </label>
              <input
                type="number"
                step="50"
                min="1"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                onBlur={() => handleBlur('precio')}
                placeholder="Ej. 12500"
                className={`w-full px-3 py-2 rounded-lg bg-white dark:bg-sazon-verdeNutresa border ${
                  touched.precio && errores.precio ? 'border-red-600 ring-1 ring-red-600' : 'border-[#DAD9C4] dark:border-white/20'
                } focus:outline-none focus:ring-2 focus:ring-sazon-verdeHoja dark:focus:ring-sazon-hoja text-gray-900 dark:text-white font-mono-tag`}
              />
              {touched.precio && errores.precio && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1 font-mono-tag">{errores.precio}</p>
              )}
            </div>

            {/* Gramaje */}
            <div>
              <label className="block font-mono-tag text-xs font-semibold text-sazon-verdeNoche dark:text-sazon-marfil mb-1">
                Gramaje / Contenido (g) *
              </label>
              <input
                type="number"
                step="1"
                min="1"
                value={gramaje}
                onChange={(e) => setGramaje(e.target.value)}
                onBlur={() => handleBlur('gramaje')}
                placeholder="Ej. 500"
                className={`w-full px-3 py-2 rounded-lg bg-white dark:bg-sazon-verdeNutresa border ${
                  touched.gramaje && errores.gramaje ? 'border-red-600 ring-1 ring-red-600' : 'border-[#DAD9C4] dark:border-white/20'
                } focus:outline-none focus:ring-2 focus:ring-sazon-verdeHoja dark:focus:ring-sazon-hoja text-gray-900 dark:text-white font-mono-tag`}
              />
              {touched.gramaje && errores.gramaje && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1 font-mono-tag">{errores.gramaje}</p>
              )}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#DAD9C4] dark:border-white/10 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-white/10 text-sazon-texto dark:text-white font-mono-tag text-xs hover:bg-gray-300 dark:hover:bg-white/20 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={hayErrores}
              style={{ backgroundColor: hayErrores ? undefined : '#7FBA00' }}
              className={`px-5 py-2 rounded-lg font-mono-tag text-xs font-bold transition-all shadow-md cursor-pointer ${
                hayErrores
                  ? 'bg-gray-300 dark:bg-white/10 text-gray-400 dark:text-white/40 cursor-not-allowed'
                  : 'text-sazon-verdeNoche hover:opacity-90 active:scale-95'
              }`}
            >
              {modo === 'crear' ? 'Guardar Producto' : 'Actualizar Cambios'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}