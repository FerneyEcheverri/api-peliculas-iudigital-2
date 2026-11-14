import React, { useState, useEffect, useRef } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import {
  Search,
  ChevronDown,
  X,
  Film,
  User,
  Building2,
  Tag,
  Layers,
} from 'lucide-react';
import logoIUDigital from './assets/logo-iudigital.png';
import API from './services/api';
import Home from './pages/Home';
import Generos from './pages/Generos';
import Tipos from './pages/Tipos';
import Director from './pages/Director';
import Productoras from './pages/Productoras';
import MediaCrud from './pages/MediaCrud';

// Normaliza texto para buscar sin importar mayúsculas ni tildes
const normalizarTexto = (texto = '') =>
  String(texto)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

// Consulta el endpoint en singular o plural según cómo esté definido en el backend
const obtenerColeccion = async (rutaSingular, rutaPlural) => {
  try {
    const res = await API.get(rutaSingular);
    return Array.isArray(res.data) ? res.data : [];
  } catch {
    try {
      const res = await API.get(rutaPlural);
      return Array.isArray(res.data) ? res.data : [];
    } catch {
      return [];
    }
  }
};

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const buscadorRef = useRef(null);

  const [busqueda, setBusqueda] = useState('');
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [cargandoBusqueda, setCargandoBusqueda] = useState(false);
  const [datosGlobales, setDatosGlobales] = useState({
    medias: [],
    directores: [],
    productoras: [],
    generos: [],
    tipos: [],
  });

  const cargarDatosGlobales = async () => {
    setCargandoBusqueda(true);
    try {
      const [medias, directores, productoras, generos, tipos] = await Promise.all([
        obtenerColeccion('/media', '/medias'),
        obtenerColeccion('/director', '/directores'),
        obtenerColeccion('/productora', '/productoras'),
        obtenerColeccion('/genero', '/generos'),
        obtenerColeccion('/tipo', '/tipos'),
      ]);
      setDatosGlobales({ medias, directores, productoras, generos, tipos });
    } finally {
      setCargandoBusqueda(false);
    }
  };

  useEffect(() => {
    cargarDatosGlobales();
  }, []);

  // Cierra el desplegable si se hace clic fuera del buscador
  useEffect(() => {
    const handleClickFuera = (e) => {
      if (buscadorRef.current && !buscadorRef.current.contains(e.target)) {
        setMostrarResultados(false);
      }
    };
    document.addEventListener('mousedown', handleClickFuera);
    return () => document.removeEventListener('mousedown', handleClickFuera);
  }, []);

  const termino = normalizarTexto(busqueda.trim());

  const resultadosFiltrados = termino
    ? {
        medias: datosGlobales.medias.filter((m) =>
          [
            m.titulo,
            m.serial,
            m.sinopsis,
            m.genero?.nombre,
            m.director?.nombres || m.director?.nombre,
            m.productora?.nombre,
            m.tipo?.nombre,
          ].some((campo) => normalizarTexto(campo).includes(termino))
        ),
        directores: datosGlobales.directores.filter((d) =>
          normalizarTexto(d.nombres || d.nombre).includes(termino)
        ),
        productoras: datosGlobales.productoras.filter((p) =>
          [p.nombre, p.slogan, p.descripcion].some((campo) =>
            normalizarTexto(campo).includes(termino)
          )
        ),
        generos: datosGlobales.generos.filter((g) =>
          [g.nombre, g.descripcion].some((campo) =>
            normalizarTexto(campo).includes(termino)
          )
        ),
        tipos: datosGlobales.tipos.filter((t) =>
          [t.nombre, t.descripcion].some((campo) =>
            normalizarTexto(campo).includes(termino)
          )
        ),
      }
    : { medias: [], directores: [], productoras: [], generos: [], tipos: [] };

  const totalCoincidencias =
    resultadosFiltrados.medias.length +
    resultadosFiltrados.directores.length +
    resultadosFiltrados.productoras.length +
    resultadosFiltrados.generos.length +
    resultadosFiltrados.tipos.length;

  const irARuta = (ruta) => {
    setMostrarResultados(false);
    navigate(ruta);
  };

  const claseBotonNav = (ruta) => {
    const activo = location.pathname === ruta;
    return `flex items-center gap-2 px-5 py-1.5 rounded-full border text-xs font-semibold transition ${
      activo
        ? 'border-cyan-400 bg-cyan-950/50 text-cyan-300 shadow-sm shadow-cyan-500/20'
        : 'border-cyan-500/50 bg-[#121721] text-cyan-400 hover:border-cyan-400 hover:bg-slate-800'
    }`;
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] text-white font-sans flex flex-col justify-between">
      <div>
        {/* HEADER SUPERIOR */}
        <header className="w-full px-8 py-4 border-b border-slate-800/80 bg-[#0b0e14] sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            {/* Logo IUDigital */}
            <Link to="/" className="flex items-center gap-3">
              <img
                src={logoIUDigital}
                alt="IU Digital de Antioquia"
                className="h-14 sm:h-16 object-contain"
              />
            </Link>

            {/* Buscador Global */}
            <div ref={buscadorRef} className="relative w-80 sm:w-96">
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={busqueda}
                onFocus={() => {
                  setMostrarResultados(true);
                  cargarDatosGlobales();
                }}
                onChange={(e) => {
                  setBusqueda(e.target.value);
                  setMostrarResultados(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setMostrarResultados(false);
                }}
                placeholder="Buscar películas, directores, géneros..."
                className="w-full bg-[#161b22] border border-slate-700/60 rounded-full py-1.5 pl-10 pr-8 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition"
              />
              {busqueda && (
                <button
                  type="button"
                  onClick={() => {
                    setBusqueda('');
                    setMostrarResultados(false);
                  }}
                  title="Limpiar búsqueda"
                  className="absolute right-3 top-2 text-slate-400 hover:text-white transition"
                >
                  <X className="h-4 w-4" />
                </button>
              )}

              {/* Panel desplegable de resultados */}
              {mostrarResultados && termino.length > 0 && (
                <div className="absolute right-0 mt-2 w-full sm:w-[430px] max-h-96 overflow-y-auto bg-[#121721] border border-slate-700/90 rounded-xl shadow-2xl z-50 divide-y divide-slate-800/80">
                  {cargandoBusqueda && totalCoincidencias === 0 ? (
                    <p className="p-4 text-xs text-slate-400 text-center">
                      Buscando en el catálogo...
                    </p>
                  ) : totalCoincidencias === 0 ? (
                    <p className="p-4 text-xs text-slate-400 text-center">
                      No se encontraron resultados para &ldquo;{busqueda}&rdquo;.
                    </p>
                  ) : (
                    <>
                      {/* Películas / Medios */}
                      {resultadosFiltrados.medias.length > 0 && (
                        <div className="p-2">
                          <p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                            <Film className="h-3.5 w-3.5" /> Películas / Medios (
                            {resultadosFiltrados.medias.length})
                          </p>
                          {resultadosFiltrados.medias.map((m) => (
                            <button
                              key={m._id}
                              type="button"
                              onClick={() => irARuta('/media')}
                              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800/80 transition flex items-center justify-between gap-2"
                            >
                              <div>
                                <p className="text-xs font-semibold text-slate-100">
                                  {m.titulo}
                                </p>
                                <p className="text-[11px] text-slate-400">
                                  {m.genero?.nombre || 'Sin género'} •{' '}
                                  {m.director?.nombres || m.director?.nombre || 'Sin director'}
                                </p>
                              </div>
                              <span className="text-[11px] text-cyan-400 shrink-0">
                                {m.anioEstreno || ''}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Directores */}
                      {resultadosFiltrados.directores.length > 0 && (
                        <div className="p-2">
                          <p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5" /> Directores (
                            {resultadosFiltrados.directores.length})
                          </p>
                          {resultadosFiltrados.directores.map((d) => (
                            <button
                              key={d._id}
                              type="button"
                              onClick={() => irARuta('/directores')}
                              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800/80 transition flex items-center justify-between"
                            >
                              <span className="text-xs text-slate-100">
                                {d.nombres || d.nombre}
                              </span>
                              <span className="text-[11px] text-slate-400">{d.estado}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Productoras */}
                      {resultadosFiltrados.productoras.length > 0 && (
                        <div className="p-2">
                          <p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                            <Building2 className="h-3.5 w-3.5" /> Productoras (
                            {resultadosFiltrados.productoras.length})
                          </p>
                          {resultadosFiltrados.productoras.map((p) => (
                            <button
                              key={p._id}
                              type="button"
                              onClick={() => irARuta('/productoras')}
                              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800/80 transition"
                            >
                              <p className="text-xs font-medium text-slate-100">{p.nombre}</p>
                              {p.slogan && (
                                <p className="text-[11px] text-slate-400 truncate">{p.slogan}</p>
                              )}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Géneros */}
                      {resultadosFiltrados.generos.length > 0 && (
                        <div className="p-2">
                          <p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                            <Tag className="h-3.5 w-3.5" /> Géneros (
                            {resultadosFiltrados.generos.length})
                          </p>
                          {resultadosFiltrados.generos.map((g) => (
                            <button
                              key={g._id}
                              type="button"
                              onClick={() => irARuta('/generos')}
                              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800/80 transition text-xs text-slate-100"
                            >
                              {g.nombre}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Tipos */}
                      {resultadosFiltrados.tipos.length > 0 && (
                        <div className="p-2">
                          <p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                            <Layers className="h-3.5 w-3.5" /> Tipos (
                            {resultadosFiltrados.tipos.length})
                          </p>
                          {resultadosFiltrados.tipos.map((t) => (
                            <button
                              key={t._id}
                              type="button"
                              onClick={() => irARuta('/tipos')}
                              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800/80 transition text-xs text-slate-100"
                            >
                              {t.nombre}
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* TÍTULO Y NAVEGACIÓN */}
        <section className="max-w-7xl mx-auto px-8 pt-8 pb-3">
          <div className="flex items-baseline gap-4 mb-5">
            <Link to="/" className="hover:opacity-90 transition">
              <h1 className="text-4xl font-extrabold text-white tracking-tight">
                PELI — IU Digital
              </h1>
            </Link>
            <span className="text-sm text-cyan-400 font-medium">
              Catálogo de películas universitarias •{' '}
              {datosGlobales.medias.length > 0 ? datosGlobales.medias.length : 6} títulos
            </span>
          </div>

          <div className="flex flex-wrap gap-3 pb-6 border-b border-slate-800/80">
            <Link
              to="/"
              className={`flex items-center gap-2 px-5 py-1.5 rounded-full border text-xs font-semibold transition ${
                location.pathname === '/'
                  ? 'border-cyan-400 bg-cyan-950/50 text-cyan-300'
                  : 'border-slate-700/80 bg-[#121721] text-slate-200 hover:border-cyan-400 hover:text-cyan-400 hover:bg-slate-800'
              }`}
            >
              <span>Inicio</span>
            </Link>

            <Link to="/generos" className={claseBotonNav('/generos')}>
              <span>Género</span>
              <ChevronDown className="h-3.5 w-3.5 text-cyan-400" />
            </Link>

            <Link to="/tipos" className={claseBotonNav('/tipos')}>
              <span>Tipo</span>
              <ChevronDown className="h-3.5 w-3.5 text-cyan-400" />
            </Link>

            <Link to="/directores" className={claseBotonNav('/directores')}>
              <span>Director</span>
              <ChevronDown className="h-3.5 w-3.5 text-cyan-400" />
            </Link>

            <Link to="/productoras" className={claseBotonNav('/productoras')}>
              <span>Productor</span>
              <ChevronDown className="h-3.5 w-3.5 text-cyan-400" />
            </Link>

            <Link to="/media" className={claseBotonNav('/media')}>
              <span>Medio</span>
              <ChevronDown className="h-3.5 w-3.5 text-cyan-400" />
            </Link>
          </div>
        </section>

        {/* VISTA DINÁMICA */}
        <main className="max-w-7xl mx-auto px-8 pb-12">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/generos" element={<Generos />} />
            <Route path="/tipos" element={<Tipos />} />
            <Route path="/directores" element={<Director />} />
            <Route path="/productoras" element={<Productoras />} />
            <Route path="/media" element={<MediaCrud />} />
          </Routes>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="w-full py-6 border-t border-slate-800/60 text-center text-xs text-slate-400">
        IU Digital de Antioquia • Institución Universitaria Digital de Antioquia • © 2024 — Todos los derechos reservados
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;