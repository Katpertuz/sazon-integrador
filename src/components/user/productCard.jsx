import PropTypes from 'prop-types';
import {useNavigate} from 'react-router-dom';

/**
 * Colores característicos por marca (clave normalizada: minúsculas y sin tildes).
 * Se usan valores arbitrarios de Tailwind para no depender de la config del CDN.
 * Las clases están escritas completas para que Tailwind las detecte al compilar.
 */
const BRAND_BADGE_STYLES = {
  zenu: 'bg-[#D32F2F]',
  doria: 'bg-[#E65100]',
  noel: 'bg-[#C2185B]',
  pietran: 'bg-[#2E7D32]',
  colcafe: 'bg-[#6D4C41]',
  jet: 'bg-[#1565C0]',
  ranchera: 'bg-[#7B1FA2]',
};
const DEFAULT_BADGE_STYLE = 'bg-[#3D8E33]'; // verde hoja de Sazón

const PLACEHOLDER_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480"><rect width="100%" height="100%" fill="#E9E7D6"/><text x="50%" y="50%" fill="#643B22" font-family="sans-serif" font-size="22" text-anchor="middle">Sin imagen</text></svg>'
  );

/** Quita tildes y pasa a minúsculas: "Zenú" -> "zenu". */
const normalize = (text = '') =>
  text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

const copFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

/**
 * Tarjeta de producto del catálogo.
 * Es un componente de presentación: no conoce el contexto ni los filtros.
 */
export default function ProductCard({ producto, onVerFicha }) {
  const navigate = useNavigate();
  const { id, nombre, marcaNombre, categoriaNombre, presentacion, precio, imagenUrl, imagenAlt } =
    producto;
  const badgeStyle = BRAND_BADGE_STYLES[normalize(marcaNombre)] ?? DEFAULT_BADGE_STYLE;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#643B22]/10 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-white/10 dark:bg-[#133326]">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#E9E7D6] dark:bg-[#114622]">
        <img
          src={imagenUrl || PLACEHOLDER_IMAGE}
          alt={imagenAlt || nombre}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = PLACEHOLDER_IMAGE;
          }}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
        <span
          className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold text-white shadow ${badgeStyle}`}
        >
          {marcaNombre}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-xs text-[#5B5E60] dark:text-[#F4F4E8]/70">{categoriaNombre}</p>
        <h3 className="font-poppins text-base font-semibold leading-snug text-[#3F4040] dark:text-[#F4F4E8]">
          {nombre}
        </h3>
        <p className="text-sm text-[#5B5E60] dark:text-[#F4F4E8]/70">{presentacion}</p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <span className="font-poppins text-lg font-bold text-[#643B22] dark:text-[#66d149]">
            {copFormatter.format(precio)}
          </span>
          <button
            type="button"
            onClick={() => {
            onVerFicha?.(producto);
            navigate(`/catalogo/${id}`);
            }}
            aria-label={`Ver ficha de ${nombre}`}
            className="rounded-full bg-[#3D8E33] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#215B33] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7FBA00] focus-visible:ring-offset-2"
          >
            Ver Ficha
          </button>
        </div>
      </div>
    </article>
  );
}

ProductCard.propTypes = {
  producto: PropTypes.shape({
    id: PropTypes.number.isRequired,
    nombre: PropTypes.string.isRequired,
    marcaNombre: PropTypes.string.isRequired,
    categoriaNombre: PropTypes.string.isRequired,
    presentacion: PropTypes.string.isRequired,
    precio: PropTypes.number.isRequired,
    imagenUrl: PropTypes.string,
    imagenAlt: PropTypes.string,
  }).isRequired,
  onVerFicha: PropTypes.func,
};
