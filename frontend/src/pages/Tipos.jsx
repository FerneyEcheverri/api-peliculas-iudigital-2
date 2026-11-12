import React, { useState, useEffect } from 'react';
import API from '../services/api';

function Tipos() {
  const [tipos, setTipos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [cargando, setCargando] = useState(true);

  // 1. Cargar tipos desde MongoDB (GET)
  const cargarTipos = async () => {
    try {
      const respuesta = await API.get('/tipo');
      setTipos(respuesta.data);
    } catch (error) {
      console.error("Error al cargar tipos:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarTipos();
  }, []);

  // 2. Guardar un nuevo tipo (POST)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/tipo', { 
        nombre, 
        descripcion 
      });
      setNombre('');
      setDescripcion('');
      cargarTipos(); // Recarga la tabla automáticamente al guardar
    } catch (error) {
      console.error("Error al guardar tipo:", error.response?.data || error.message);
      const mensajeError = error.response?.data?.msg || "No se pudo guardar el tipo. Revisa si ya existe.";
      alert(mensajeError);
    }
  };

  // 3. Eliminar un tipo por su ID (DELETE)
  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este tipo de multimedia?")) {
      try {
        await API.delete(`/tipo/${id}`);
        cargarTipos(); // Recarga la lista tras eliminar
      } catch (error) {
        console.error("Error al eliminar tipo:", error);
        alert("Error al eliminar el registro.");
      }
    }
  };

  return (
    <div className="p-2 text-white max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-cyan-400">Gestión de Tipos de Multimedia</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Formulario de Creación */}
        <form onSubmit={handleSubmit} className="bg-[#121721] p-5 rounded-xl border border-slate-800 h-fit">
          <h3 className="text-lg font-semibold mb-4 text-slate-200">Nuevo Tipo</h3>
          <div className="mb-4">
            <label className="block text-xs text-slate-400 mb-1">Nombre</label>
            <input 
              type="text" 
              value={nombre} 
              onChange={(e) => setNombre(e.target.value)}
              className="w-full bg-[#1b2230] border border-slate-700 rounded p-2 text-sm text-white focus:outline-none focus:border-cyan-500"
              placeholder="Ej. Película, Serie, Documental..."
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
              placeholder="Descripción del formato audiovisual..."
            />
          </div>
          <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-medium py-2 rounded transition">
            Guardar Tipo
          </button>
        </form>

        {/* Tabla de Listado */}
        <div className="md:col-span-2 bg-[#121721] p-5 rounded-xl border border-slate-800">
          <h3 className="text-lg font-semibold mb-4 text-slate-200">Tipos Registrados</h3>
          {cargando ? (
            <p className="text-slate-400 text-sm">Cargando datos...</p>
          ) : (
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="border-b border-slate-800 text-slate-400">
                <tr>
                  <th className="pb-3">Nombre</th>
                  <th className="pb-3">Descripción</th>
                  <th className="pb-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {tipos.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="py-6 text-center text-slate-500">
                      No hay tipos registrados en la base de datos.
                    </td>
                  </tr>
                ) : (
                  tipos.map((item) => (
                    <tr key={item._id}>
                      <td className="py-3 font-medium text-white">{item.nombre}</td>
                      <td className="py-3 text-slate-400">{item.descripcion || 'Sin descripción'}</td>
                      <td className="py-3 text-right">
                        <button 
                          onClick={() => handleEliminar(item._id)}
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

export default Tipos;