import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Search, ChevronDown } from 'lucide-react';
import logoIUDigital from './assets/logo-iudigital.png';
import Home from './pages/Home';
import Generos from './pages/Generos';
import Tipos from './pages/Tipos';
import Director from './pages/Director';
import MediaCrud from './pages/MediaCrud';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0b0e14] text-white font-sans flex flex-col justify-between">
        <div>
          {/* HEADER SUPERIOR: LOGO MÁS GRANDE E IZQUIERDA - BUSCADOR A LA DERECHA */}
          <header className="w-full px-8 py-4 border-b border-slate-800/80 bg-[#0b0e14] sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              
              {/* Logo IUDigital (Aumentado de tamaño y con clic para volver al Inicio) */}
              <Link to="/" className="flex items-center gap-3">
                <img 
                  src={logoIUDigital} 
                  alt="IU Digital de Antioquia" 
                  className="h-14 sm:h-16 object-contain"
                />
              </Link>

              {/* Buscador de Películas */}
              <div className="relative w-80 sm:w-96">
                <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Buscar películas, directores, géneros..." 
                  className="w-full bg-[#161b22] border border-slate-700/60 rounded-full py-1.5 pl-10 pr-4 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition"
                />
              </div>

            </div>
          </header>

          {/* TÍTULO Y SUBTÍTULO CONTADOR */}
          <section className="max-w-7xl mx-auto px-8 pt-8 pb-3">
            <div className="flex items-baseline gap-4 mb-5">
              <Link to="/" className="hover:opacity-90 transition">
                <h1 className="text-4xl font-extrabold text-white tracking-tight">
                  PELI — IU Digital
                </h1>
              </Link>
              <span className="text-sm text-cyan-400 font-medium">
                Catálogo de películas universitarias • 6 títulos
              </span>
            </div>

            {/* BARRA DE NAVEGACIÓN Y FILTROS OVALADOS */}
            <div className="flex flex-wrap gap-3 pb-6 border-b border-slate-800/80">
              {/* Botón para regresar al catálogo principal */}
              <Link 
                to="/"
                className="flex items-center gap-2 px-5 py-1.5 rounded-full border border-slate-700/80 bg-[#121721] text-xs font-semibold text-slate-200 hover:border-cyan-400 hover:text-cyan-400 hover:bg-slate-800 transition"
              >
                <span>Inicio</span>
              </Link>

              {/* Enlace dinámico al módulo de Géneros */}
              <Link 
                to="/generos"
                className="flex items-center gap-2 px-5 py-1.5 rounded-full border border-cyan-500/50 bg-[#121721] text-xs font-semibold text-cyan-400 hover:border-cyan-400 hover:bg-slate-800 transition"
              >
                <span>Género</span>
                <ChevronDown className="h-3.5 w-3.5 text-cyan-400" />
              </Link>

              {/* Enlace dinámico al módulo de Tipos */}
              <Link 
                to="/tipos"
                className="flex items-center gap-2 px-5 py-1.5 rounded-full border border-cyan-500/50 bg-[#121721] text-xs font-semibold text-cyan-400 hover:border-cyan-400 hover:bg-slate-800 transition"
              >
                <span>Tipo</span>
                <ChevronDown className="h-3.5 w-3.5 text-cyan-400" />
              </Link>

              {/* Enlace dinámico al módulo de Director */}
              <Link 
                to="/directores"
                className="flex items-center gap-2 px-5 py-1.5 rounded-full border border-cyan-500/50 bg-[#121721] text-xs font-semibold text-cyan-400 hover:border-cyan-400 hover:bg-slate-800 transition"
              >
                <span>Director</span>
                <ChevronDown className="h-3.5 w-3.5 text-cyan-400" />
              </Link>

              {/* Botón pendiente para el módulo de Productor */}
              <button 
                className="flex items-center gap-2 px-5 py-1.5 rounded-full border border-slate-700/80 bg-[#121721] text-xs font-semibold text-slate-200 hover:border-slate-500 hover:bg-slate-800 transition"
              >
                <span>Productor</span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {/* Media abre directamente en esta misma interfaz, como Géneros y Tipos. */}
              <Link
                to="/media"
                className="flex items-center gap-2 px-5 py-1.5 rounded-full border border-cyan-500/50 bg-[#121721] text-xs font-semibold text-cyan-400 hover:border-cyan-400 hover:bg-slate-800 transition"
              >
                <span>Medio</span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </Link>
            </div>
          </section>

          {/* VISTA DINÁMICA DE LA APLICACIÓN (Cambia según la ruta seleccionada) */}
          <main className="max-w-7xl mx-auto px-8 pb-12">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/generos" element={<Generos />} />
              <Route path="/tipos" element={<Tipos />} />
              <Route path="/directores" element={<Director />} />
              <Route path="/media" element={<MediaCrud />} />
            </Routes>
          </main>
        </div>

        {/* PIE DE PÁGINA (FOOTER) */}
        <footer className="w-full py-6 border-t border-slate-800/60 text-center text-xs text-slate-400">
          IU Digital de Antioquia • Institución Universitaria Digital de Antioquia • © 2024 — Todos los derechos reservados
        </footer>
      </div>
    </Router>
  );
}

export default App;