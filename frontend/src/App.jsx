import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Search, ChevronDown } from 'lucide-react';
import logoIUDigital from './assets/logo-iudigital.png';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0b0e14] text-white font-sans flex flex-col justify-between">
        <div>
          {/* HEADER SUPERIOR: LOGO MÁS GRANDE E IZQUIERDA - BUSCADOR A LA DERECHA */}
          <header className="w-full px-8 py-4 border-b border-slate-800/80 bg-[#0b0e14] sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              
              {/* Logo IUDigital (Aumentado de tamaño) */}
              <div className="flex items-center gap-3">
                <img 
                  src={logoIUDigital} 
                  alt="IU Digital de Antioquia" 
                  className="h-14 sm:h-16 object-contain"
                />
              </div>

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
              <h1 className="text-4xl font-extrabold text-white tracking-tight">
                PELI — IU Digital
              </h1>
              <span className="text-sm text-cyan-400 font-medium">
                Catálogo de películas universitarias • 6 títulos
              </span>
            </div>

            {/* BARRA DE FILTROS OVALADOS (Sin el botón 'Tipo' duplicado) */}
            <div className="flex flex-wrap gap-3 pb-6 border-b border-slate-800/80">
              {['Género', 'Tipo', 'Director', 'Productor', 'Medio'].map((filtro, index) => (
                <button 
                  key={index}
                  className="flex items-center gap-2 px-5 py-1.5 rounded-full border border-slate-700/80 bg-[#121721] text-xs font-semibold text-slate-200 hover:border-slate-500 hover:bg-slate-800 transition"
                >
                  <span>{filtro}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>
              ))}
            </div>
          </section>

          {/* VISTA DINÁMICA DEL CATÁLOGO */}
          <main className="max-w-7xl mx-auto px-8 pb-12">
            <Routes>
              <Route path="/" element={<Home />} />
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