import React, { useState, useEffect } from 'react';
import API from '../services/api';

function Productoras() {
  const [productoras, setProductoras] = useState([]);
  const [nombre, setNombre] = useState('');
  const [slogan, setSlogan] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [estado, setEstado] = useState('Activo');
  const [idEditando, setIdEditando] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [aviso, setAviso] = useState(null);

  const cargarProductoras = async () => {
    try {
      setError(null);
      const respuesta = await API.get('/productora');
      setProductoras(respuesta.data);
    } catch (err) {
      console.error('Error al cargar productoras:', err);
      setError('No se pudieron cargar las productoras.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarProductoras();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setAviso(null);
      if (idEditando) {
        await API.put(`/productora/${idEditando}`, { nombre, slogan, descripcion, estado });
        setAviso('Productora actualizada correctamente.');
      } else {
        await API.post('/productora', { nombre, slogan, descripcion, estado });
        setAviso('Productora creada exitosamente.');
      }
      limpiarFormulario();
      cargarProductoras();
    } catch (err) {
      console.error('Error al guardar productora:', err);
      setError(err.response?.data?.mensaje || 'No se pudo guardar la productora.');
    }
  };

  const handleEditar = (prod) => {
    setIdEditando(prod._id);
    setNombre(prod.nombre || '');
    setSlogan(prod.slogan || '');
    setDescripcion(prod.descripcion || '');
    setEstado(prod.estado || 'Activo');
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta productora?')) {
      try {
        await API.delete(`/productora/${id}`);
        if (idEditando === id) limpiarFormulario();
        setAviso('Productora eliminada correctamente.');
        cargarProductoras();
      } catch (err) {
        console.error('Error al eliminar productora:', err);
        setError('No se pudo eliminar la productora.');
      }
    }
  };

  const limpiarFormulario = () => {
    setIdEditando(null);
    setNombre('');
    setSlogan('');
    setDescripcion('');
    setEstado('Activo');
  };

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
      <h2 className="text-2xl font-bold mb-6 text-cyan-400">Gestión de Productores</h2>

      {error && (
        <p className="mb-4 text-sm text-red-400 bg-red-950/40 p-3 rounded border border-red-900/50">
          {error}
        </p>
      )}
      {aviso && (
        <p className="mb-4 text-sm text-cyan-400 bg-cyan-950/40 p-3 rounded border border-cyan-900/50">
          {aviso}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <form onSubmit={handleSubmit} className="bg-[#121721] p-5 rounded-xl border border-slate-800 h-fit">
          <h3 className="text-lg font-semibold mb-4 text-slate-200">
            {idEditando ? 'Editar Productor' : 'Nuevo Productor'}
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Nombre *</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full bg-[#1b2230] border border-slate-700 rounded p-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                placeholder="Ej. Warner Bros..."
                required
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Slogan</label>
              <input
                type="text"
                value={slogan}
                onChange={(e) => setSlogan(e.target.value)}
                className="w-full bg-[#1b2230] border border-slate-700 rounded p-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                placeholder="Ej. Entertainment..."
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Descripción</label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full bg-[#1b2230] border border-slate-700 rounded p-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                rows="2"
                placeholder="Ej. Estudio cinematográfico internacional..."
              />
            </div>

            <div>
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
          </div>

          <button
            type="submit"
            className="mt-6 w-full bg-cyan-600 hover:bg-cyan-500 rounded-md py-2.5 font-semibold text-white transition"
          >
            {idEditando ? 'Actualizar Productor' : 'Guardar Productor'}
          </button>

          {idEditando && (
            <button
              type="button"
              onClick={limpiarFormulario}
              className="mt-3 w-full rounded-md border border-slate-700 py-2 text-sm text-slate-200 hover:bg-slate-800 transition"
            >
              Cancelar
            </button>
          )}
        </form>

        <div className="md:col-span-2 bg-[#121721] p-5 rounded-xl border border-slate-800 min-w-0">
          <div className="flex items-center justify-between gap-3 mb-6">
            <h3 className="text-lg font-semibold text-slate-200">Productores Registrados</h3>
            <button
              type="button"
              onClick={cargarProductoras}
              className="text-sm text-cyan-400 hover:underline"
            >
              Actualizar
            </button>
          </div>

          {cargando ? (
            <p className="text-slate-400 text-sm">Cargando datos...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3 pr-4 font-semibold">Nombre</th>
                    <th className="py-3 pr-4 font-semibold">Slogan</th>
                    <th className="py-3 pr-4 font-semibold">Descripción</th>
                    <th className="py-3 pr-4 font-semibold">Estado</th>
                    <th className="py-3 pr-4 font-semibold">Creación</th>
                    <th className="py-3 pr-4 font-semibold">Actualización</th>
                    <th className="py-3 font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {productoras.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="p-6 text-center text-slate-400">
                        No hay registros de productoras en la base de datos.
                      </td>
                    </tr>
                  ) : (
                    productoras.map((prod) => (
                      <tr key={prod._id} className="border-b border-slate-800/60">
                        <td className="py-4 pr-4 font-semibold text-slate-100">{prod.nombre}</td>
                        <td className="py-4 pr-4 text-slate-300">{prod.slogan || 'N/A'}</td>
                        <td className="py-4 pr-4 text-slate-400 max-w-xs truncate">
                          {prod.descripcion || 'Sin descripción'}
                        </td>
                        <td className="py-4 pr-4">
                          <span
                            className={`px-2 py-0.5 text-xs rounded border ${
                              prod.estado === 'Activo'
                                ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800'
                                : 'bg-red-950/60 text-red-400 border-red-800'
                            }`}
                          >
                            {prod.estado}
                          </span>
                        </td>
                        <td className="py-4 pr-4 text-slate-400 text-xs">
                          {formatearFecha(prod.fechaCreacion)}
                        </td>
                        <td className="py-4 pr-4 text-slate-400 text-xs">
                          {formatearFecha(prod.fechaActualizacion)}
                        </td>
                        <td className="py-4">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => handleEditar(prod)}
                              className="px-2 py-1 rounded border border-cyan-800 text-cyan-400 hover:bg-cyan-950/50 text-xs"
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              onClick={() => handleEliminar(prod._id)}
                              className="px-2 py-1 rounded border border-red-900 bg-red-950/50 text-red-400 hover:bg-red-900 text-xs"
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Productoras;