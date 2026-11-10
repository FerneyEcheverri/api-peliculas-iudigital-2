import React, { useEffect, useState } from 'react';
import API from '../services/api';

function Home() {
  const [peliculas, setPeliculas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerPeliculas = async () => {
      try {
        const respuesta = await API.get('/media');
        setPeliculas(respuesta.data);
      } catch (error) {
        console.error("Error al obtener las películas de la base de datos:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerPeliculas();
  }, []);

  if (cargando) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cyan-500"></div>
        <span className="ml-3 text-slate-400 text-sm">Cargando películas de la IU Digital...</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
      {peliculas.length === 0 ? (
        <div className="col-span-2 text-center py-16 text-slate-400 bg-[#121721] rounded-xl border border-slate-800">
          <p className="text-lg font-semibold text-slate-300">No hay películas registradas aún en el sistema.</p>
          <span className="text-xs text-slate-500 mt-1 block">
            Registra títulos desde Postman o los módulos de administración para verlos reflejados aquí.
          </span>
        </div>
      ) : (
        peliculas.map((peli) => (
          <div key={peli._id} className="relative rounded-xl overflow-hidden border border-slate-800/80 bg-[#121721] hover:border-cyan-500/50 transition">
            <img src={peli.foto} alt={peli.titulo} className="w-full h-64 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-bold text-white">{peli.titulo}</h3>
              <p className="text-slate-400 text-sm mt-1 line-clamp-2">{peli.sinopsis}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Home;