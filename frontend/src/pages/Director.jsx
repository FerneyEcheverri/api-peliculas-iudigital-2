import React, { useState, useEffect } from 'react';
import API from '../services/api';

function Directores() {
  const [directores, setDirectores] = useState([]);
  const [nombres, setNombres] = useState('');
  const [estado, setEstado] = useState('Activo');
  const [idEditando, setIdEditando] = useState(null);
  const [cargando, setCargando] = useState(true);

  // 1. Consultar todos los directores desde MongoDB (GET)
  const cargarDirectores = async () => {
    try {
      const respuesta = await API.get('/director');
      setDirectores(respuesta.data);
    } catch (error) {
      console.error('Error al cargar directores:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDirectores();
  }, []);

  // 2. Guardar un director nuevo (POST) o actualizar uno existente (PUT)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (idEditando) {
        // Si hay un ID seleccionado, actualiza ese director (PUT)
        await API.put(`/director/${idEditando}`, {
          nombres,
          estado,
        });
      } else {
        // Si no hay ID seleccionado, crea un director nuevo (POST)
        await API.post('/director', {
          nombres,
          estado,
        });
      }
      limpiarFormulario();
      cargarDirectores(); // Actualiza la tabla automáticamente
    } catch (error) {
      console.error('Error al guardar director:', error);
      alert('No se pudo guardar el director. Verifica que el servidor esté encendido.');
    }
  };

  // 3. Cargar los datos de un director en el formulario al hacer clic en "Editar"
  const handleEditar = (director) => {
    setIdEditando(director._id);
    setNombres(director.nombres);
    setEstado(director.estado);
  };

  // 4. Restablecer el formulario al modo "Nuevo Director"
  const limpiarFormulario = () => {
    setIdEditando(null);
    setNombres('');
    setEstado('Activo');
  };

  // Dar formato legible a las fechas de MongoDB
  const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="p-2 text-white max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-cyan-400">Gestión de Directores</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Formulario de Registro y Edición */}
        <form onSubmit={handleSubmit} className="bg-[#121721] p-5 rounded-xl border border-slate-800 h-fit">
          <h3 className="text-lg font-semibold mb-4 text-slate-200">
            {idEditando ? 'Editar Director' : 'Nuevo Director'}
          </h3>

          <div className="mb-4">
            <label className="block text-xs text-slate-400 mb-1">Nombres</label>
            <input
              type="text"
              value={nombres}
              onChange={(e) => setNombres(e.target.value)}
              className="w-full bg-[#1b2230] border border-slate-700 rounded p-2 text-sm text-white focus:outline-none focus:border-cyan-500"
              placeholder="Ej. Christopher Nolan..."
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-xs text-slate-400 mb-1">Estado</label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="w-full bg-[#1b2230] border border-slate-700 rounded p-2 text-sm text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-medium py-2 rounded transition"
            >
              {idEditando ? 'Actualizar Director' : 'Guardar Director'}
            </button>

            {idEditando && (
              <button
                type="button"
                onClick={limpiarFormulario}
                className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium px-4 py-2 rounded transition"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        {/* Tabla de Directores Registrados */}
        <div className="md:col-span-2 bg-[#121721] p-5 rounded-xl border border-slate-800 overflow-x-auto">
          <h3 className="text-lg font-semibold mb-4 text-slate-200">Directores Registrados</h3>
          {cargando ? (
            <p className="text-slate-400 text-sm">Cargando datos...</p>
          ) : (
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="border-b border-slate-800 text-slate-400">
                <tr>
                  <th className="pb-3">Nombres</th>
                  <th className="pb-3">Estado</th>
                  <th className="pb-3">Creación</th>
                  <th className="pb-3">Actualización</th>
                  <th className="pb-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {directores.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-6 text-center text-slate-500">
                      No hay directores registrados en la base de datos.
                    </td>
                  </tr>
                ) : (
                  directores.map((dir) => (
                    <tr key={dir._id}>
                      <td className="py-3 font-medium text-white">{dir.nombres}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 text-xs rounded ${
                            dir.estado === 'Activo'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-rose-950 text-rose-400 border border-rose-800'
                          }`}
                        >
                          {dir.estado}
                        </span>
                      </td>
                      <td className="py-3 text-slate-400 text-xs">
                        {formatearFecha(dir.fechaCreacion)}
                      </td>
                      <td className="py-3 text-slate-400 text-xs">
                        {formatearFecha(dir.fechaActualizacion)}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => handleEditar(dir)}
                          className="bg-cyan-600/20 hover:bg-cyan-600 text-cyan-400 hover:text-white px-3 py-1 rounded text-xs border border-cyan-600/40 transition"
                        >
                          Editar
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

export default Directores;