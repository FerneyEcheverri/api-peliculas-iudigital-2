import React, { useState, useEffect } from 'react';
import API from '../services/api';

function Generos() {
  const [generos, setGeneros] = useState([]);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [cargando, setCargando] = useState(true);

  // 1. Cargar géneros desde MongoDB
  const cargarGeneros = async () => {
    try {
      const respuesta = await API.get('/genero');
      setGeneros(respuesta.data);
    } catch (error) {
      console.error("Error al cargar géneros:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarGeneros();
  }, []);

  // 2. Guardar un nuevo género (POST)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/genero', { 
        nombre, 
        descripcion, 
        estado: 'Activo' 
      });
      setNombre('');
      setDescripcion('');
      cargarGeneros(); // Recarga la tabla automáticamente al guardar
    } catch (error) {
      console.error("Error al guardar género:", error);
      alert("No se pudo guardar el género. Revisa si el nombre ya existe.");
    }
  };

  // 3. Eliminar un género por su ID (DELETE)
  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este género?")) {
      try {
        await API.delete(`/genero/${id}`);
        cargarGeneros(); // Recarga la lista tras eliminar
      } catch (error) {
        console.error("Error al eliminar género:", error);
        alert("Error al eliminar el registro.");
      }
    }
  };

  return (
    <div className="p-2 text-white max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-cyan-400">Gestión de Géneros</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Formulario de Creación */}
        <form onSubmit={handleSubmit} className="bg-[#121721] p-5 rounded-xl border border-slate-800 h-fit">
          <h3 className="text-lg font-semibold mb-4 text-slate-200">Nuevo Género</h3>
          <div className="mb-4">
            <label className="block text-xs text-slate-400 mb-1">Nombre</label>
            <input 
              type="text" 
              value={nombre} 
              onChange={(e) => setNombre(e.target.value)}
              className="w-full bg-[#1b2230] border border-slate-700 rounded p-2 text-sm text-white focus:outline-none focus:border-cyan-500"
              placeholder="Ej. Acción, Comedia..."
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-xs text-slate-400 mb-1">Descripción</label>
            <textarea 
              value={descripcion} 
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full bg-[#1b2230] border border-slate-700 rounded p-2 text-sm text-white focus:outline-none focus:border-cyan-500"
              rows="3"
              placeholder="Películas con secuencias de alto impacto..."
            />
          </div>
          <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-medium py-2 rounded transition">
            Guardar Género
          </button>
        </form>

        {/* Tabla de Listado */}
        <div className="md:col-span-2 bg-[#121721] p-5 rounded-xl border border-slate-800">
          <h3 className="text-lg font-semibold mb-4 text-slate-200">Géneros Registrados</h3>
          {cargando ? (
            <p className="text-slate-400 text-sm">Cargando datos...</p>
          ) : (
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="border-b border-slate-800 text-slate-400">
                <tr>
                  <th className="pb-3">Nombre</th>
                  <th className="pb-3">Estado</th>
                  <th className="pb-3">Descripción</th>
                  <th className="pb-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {generos.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-6 text-center text-slate-500">
                      No hay géneros registrados en la base de datos.
                    </td>
                  </tr>
                ) : (
                  generos.map((gen) => (
                    <tr key={gen._id}>
                      <td className="py-3 font-medium text-white">{gen.nombre}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 text-xs rounded ${gen.estado === 'Activo' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'}`}>
                          {gen.estado}
                        </span>
                      </td>
                      <td className="py-3 text-slate-400">{gen.descripcion || 'Sin descripción'}</td>
                      <td className="py-3 text-right">
                        <button 
                          onClick={() => handleEliminar(gen._id)}
                          className="bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white px-3 py-1 rounded text-xs border border-rose-600/40 transition"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Generos;