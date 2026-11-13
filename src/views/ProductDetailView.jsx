import { useContext, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CatalogoContext } from "../context/CatalogoContext";
import catalogoMockData from "../data/CatalogoMock";

/* ------------------------------ Utilidades ------------------------------ */

const formatearCOP = (valor) => {
  const numero = Number(valor);
  if (valor === null || valor === undefined || Number.isNaN(numero)) return "—";
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(numero);
};

const mostrar = (valor) =>
  valor === null || valor === undefined || valor === "" ? "—" : valor;

/* ------------------------------ Placeholder ----------------------------- */

const ImagenPlaceholder = () => (
  <div
    className="flex h-full w-full flex-col items-center justify-center gap-2 text-[#5B5E60] dark:text-[#F4F4E8]/70"
    role="img"
    aria-label="Imagen no disponible"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-16 w-16"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="8.5" cy="9" r="1.5" />
      <path d="M21 16l-5.2-5.2a1 1 0 0 0-1.4 0L6 19" />
    </svg>
    <span className="font-inter text-sm">Sin imagen disponible</span>
  </div>
);

/* ------------------------------- Componente ----------------------------- */

const ProductDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const idProducto = Number(id);

  // Si no hay Provider, se usa el mock como respaldo (igual que CatalogoView)
  const contexto = useContext(CatalogoContext) ?? catalogoMockData;
  const {
    productos = [],
    marcas = [],
    categorias = [],
    presentaciones = [],
    imagenesProducto = [],
  } = contexto;

  // Cruce de datos entre arreglos
  const { producto, marca, categoria, presentacion, imagen } = useMemo(() => {
    if (!Number.isFinite(idProducto)) return {};

    const prod = (productos ?? []).find((p) => Number(p?.id) === idProducto);
    if (!prod) return {};

    const marcaEncontrada = (marcas ?? []).find(
      (m) => Number(m?.id) === Number(prod.idMarca)
    );
    const categoriaEncontrada = (categorias ?? []).find(
      (c) => Number(c?.id) === Number(prod.idCategoria)
    );

    const presentacionEncontrada = (presentaciones ?? []).find(
      (pr) => Number(pr?.idProducto) === idProducto
    );

    const imagenesDelProducto = (imagenesProducto ?? []).filter(
      (img) => Number(img?.idProducto) === idProducto
    );
    const imagenPrincipal =
      imagenesDelProducto.find((img) => img?.esPrincipal === true) ??
      imagenesDelProducto[0];

    return {
      producto: prod,
      marca: marcaEncontrada,
      categoria: categoriaEncontrada,
      presentacion: presentacionEncontrada,
      imagen: imagenPrincipal,
    };
  }, [idProducto, productos, marcas, categorias, presentaciones, imagenesProducto]);

  const volver = () => navigate(-1);

  /* ---------------------------- Estado 404 ---------------------------- */
  if (!producto) {
    return (
      <section
        className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center"
        aria-live="polite"
      >
        <h2 className="font-poppins text-2xl font-semibold text-[#5B5E60] dark:text-[#F4F4E8]">
          Producto no encontrado
        </h2>
        <p className="font-inter max-w-md text-[#5B5E60] dark:text-[#F4F4E8]/80">
          El producto que buscas no existe o ya no está disponible en el
          catálogo.
        </p>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="font-mono-tag rounded-full bg-[#3D8E33] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#215B33] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#66d149] focus-visible:ring-offset-2"
        >
          Volver al catálogo
        </button>
      </section>
    );
  }

  /* ------------------------ Datos listos para pintar ------------------------ */
  const urlImagen = imagen?.url ?? null;
  const nombre = producto?.nombre ?? "Producto sin nombre";
  const contenido =
    presentacion?.contenidoNeto !== undefined &&
    presentacion?.contenidoNeto !== null
      ? `${presentacion.contenidoNeto} ${presentacion?.unidadMedida ?? ""}`.trim()
      : "—";

  // El precio de la presentación manda; si no existe, el precio de referencia
  const precio = presentacion?.precio ?? producto?.precioReferencia;

  const atributos = [
    { etiqueta: "Contenido neto", valor: contenido },
    { etiqueta: "Presentación", valor: mostrar(presentacion?.descripcion) },
    { etiqueta: "Precio", valor: formatearCOP(precio) },
  ];

  /* ------------------------------- Render ------------------------------- */
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <button
        type="button"
        onClick={volver}
        className="font-poppins mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#643B22] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3D8E33] dark:text-[#66d149]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Volver al catálogo
      </button>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
        {/* Columna izquierda: imagen */}
        <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-[#643B22]/10 bg-[#E9E7D6] shadow-sm dark:border-white/10 dark:bg-[#114622]">
          {urlImagen ? (
            <img
              src={urlImagen}
              alt={imagen?.textoAlternativo ?? nombre}
              className="h-full w-full object-contain p-4"
              loading="lazy"
            />
          ) : (
            <ImagenPlaceholder />
          )}
        </div>

        {/* Columna derecha: información */}
        <div className="flex flex-col gap-4">
          {categoria?.nombre && (
            <span className="font-mono-tag w-fit rounded-full bg-[#3D8E33]/10 px-3 py-1 text-xs font-medium text-[#215B33] dark:bg-[#66d149]/15 dark:text-[#66d149]">
              {categoria.nombre}
            </span>
          )}

          <h1 className="font-poppins text-3xl font-bold leading-tight text-[#3F4040] dark:text-[#F4F4E8] md:text-4xl">
            {nombre}
          </h1>

          {marca?.nombre && (
            <p className="font-poppins text-base font-medium text-[#643B22] dark:text-[#66d149]">
              {marca.nombre}
            </p>
          )}

          <p className="font-inter leading-relaxed text-[#5B5E60] dark:text-[#F4F4E8]/85">
            {producto?.descripcion ?? "Este producto aún no tiene descripción."}
          </p>

          {/* Atributos */}
          <dl className="mt-2 divide-y divide-[#643B22]/10 overflow-hidden rounded-2xl border border-[#643B22]/10 bg-white shadow-sm dark:divide-white/10 dark:border-white/10 dark:bg-[#133326]">
            {atributos.map(({ etiqueta, valor }) => (
              <div
                key={etiqueta}
                className="flex items-center justify-between gap-4 px-5 py-3"
              >
                <dt className="font-inter text-sm text-[#5B5E60] dark:text-[#F4F4E8]/70">
                  {etiqueta}
                </dt>
                <dd
                  className={`font-mono-tag text-right text-sm font-semibold ${
                    etiqueta === "Precio"
                      ? "text-base text-[#3D8E33] dark:text-[#66d149]"
                      : "text-[#3F4040] dark:text-[#F4F4E8]"
                  }`}
                >
                  {valor}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailView;