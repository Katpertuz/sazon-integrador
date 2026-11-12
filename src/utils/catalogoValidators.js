// Lista oficial de marcas del ecosistema Grupo Nutresa
export const MARCAS_NUTRESA = [
  'Zenú',
  'Doria',
  'Jet',
  'Pietrán',
  'Noel',
  'Corona',
  'Novaventa',
  'Grupo Nutresa',
];


export function validarSKU(sku, listaProductosExistentes = [], modo = 'crear', skuOriginal = '') {
  if (!sku || !sku.trim()) {
    return 'El SKU es obligatorio.';
  }
  const regexAlfanumerico = /^[a-zA-Z0-9-_]+$/;
  if (!regexAlfanumerico.test(sku)) {
    return 'El SKU debe ser alfanumérico (puede incluir guiones).';
  }

  
  if (modo === 'editar' && sku === skuOriginal) {
    return '';
  }

  // Validar unicidad en la lista de productos
  const existe = listaProductosExistentes.some(
    (prod) => prod.sku.toLowerCase() === sku.toLowerCase()
  );
  if (existe) {
    return 'El SKU ya se encuentra registrado en el catálogo.';
  }

  return '';
}


export function validarSelectores(marca, categoria) {
  let errores = {};

  if (!marca) {
    errores.marca = 'Debe seleccionar una marca de Grupo Nutresa.';
  } else if (!MARCAS_NUTRESA.includes(marca)) {
    errores.marca = 'La marca seleccionada no es válida para el ecosistema.';
  }

  if (!categoria || !categoria.trim()) {
    errores.categoria = 'La categoría es obligatoria.';
  }

  return errores;
}


export function validarNumericos(precio, gramaje) {
  let errores = {};

  const numPrecio = Number(precio);
  if (precio === '' || isNaN(numPrecio)) {
    errores.precio = 'El precio es obligatorio y debe ser numérico.';
  } else if (numPrecio <= 0) {
    errores.precio = 'El precio debe ser estrictamente mayor a 0.';
  }

  const numGramaje = Number(gramaje);
  if (gramaje === '' || isNaN(numGramaje)) {
    errores.gramaje = 'El gramaje es obligatorio y debe ser numérico.';
  } else if (numGramaje <= 0) {
    errores.gramaje = 'El gramaje debe ser estrictamente mayor a 0.';
  }

  return errores;
}