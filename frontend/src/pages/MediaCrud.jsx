import React, { useEffect, useState } from 'react';
import API from '../services/api';

// Módulo Media: formulario y listado dentro de la interfaz existente.
const VACIO = { serial: '', titulo: '', sinopsis: '', url: '', imagen: '', anioEstreno: '', genero: '', director: '', productora: '', tipo: '' };
const RELACIONES = [
  { campo: 'genero', ruta: '/genero', titulo: 'Género', etiqueta: (x) => x.nombre },
  { campo: 'director', ruta: '/director', titulo: 'Director', etiqueta: (x) => x.nombres },
  { campo: 'productora', ruta: '/productora', titulo: 'Productora', etiqueta: (x) => x.nombre },
  { campo: 'tipo', ruta: '/tipo', titulo: 'Tipo', etiqueta: (x) => x.nombre }
];
const obtenerId = (dato) => typeof dato === 'object' && dato !== null ? dato._id : (dato || '');
const mensajeError = (error) => error.response?.data?.msg || 'No fue posible completar la operación. Revisa la conexión con el servidor.';

export default function MediaCrud({ volver }) {
  const [registros, setRegistros] = useState([]);
  const [opciones, setOpciones] = useState({});
  const [formulario, setFormulario] = useState(VACIO);
  const [editando, setEditando] = useState(null);
  
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState('');

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      const respuesta = await API.get('/media');
      setRegistros(respuesta.data);
    } catch (e) {
      setError(mensajeError(e));
    } finally {
      setCargando(false);
    }
    // Los catálogos auxiliares se consultan por separado: si alguno falla,
    // la tabla de películas sigue mostrando los registros disponibles.
    const resultados = await Promise.allSettled(RELACIONES.map((r) => API.get(r.ruta)));
    setOpciones(Object.fromEntries(RELACIONES.map((r, i) => [
      r.campo, resultados[i].status === 'fulfilled' ? resultados[i].value.data : []
    ])));
  };

  useEffect(() => { cargar(); }, []);

  const nuevo = () => {
    setFormulario({ ...VACIO }); setEditando(null); setError(''); setAviso('');
  };
  const editar = (registro) => {
    setFormulario(Object.fromEntries(Object.keys(VACIO).map((campo) => [campo,
      RELACIONES.some((r) => r.campo === campo) ? obtenerId(registro[campo]) : String(registro[campo] ?? '')
    ])));
    setEditando(registro._id); setError(''); setAviso('');
  };
  const guardar = async (evento) => {
    evento.preventDefault(); setGuardando(true); setError(''); setAviso('');
    try {
      const datos = { ...formulario, anioEstreno: Number(formulario.anioEstreno) };
      if (editando) await API.put(`/media/${editando}`, datos);
      else await API.post('/media', datos);
      setAviso(editando ? 'Registro actualizado correctamente.' : 'Registro creado correctamente.');
      setEditando(null); setFormulario({ ...VACIO });
      await cargar();
    } catch (e) { setError(mensajeError(e)); }
    finally { setGuardando(false); }
  };
  const eliminar = async (registro) => {
    if (!window.confirm(`¿Eliminar el registro "${registro.titulo}"? Esta acción no se puede deshacer.`)) return;
    setError(''); setAviso('');
    try { await API.delete(`/media/${registro._id}`); setAviso('Registro eliminado correctamente.'); await cargar(); }
    catch (e) { setError(mensajeError(e)); }
  };
  const nombreRelacionado = (campo, dato) => {
    const id = obtenerId(dato);
    const encontrado = (opciones[campo] || []).find((x) => x._id === id);
    const objeto = encontrado || (typeof dato === 'object' ? dato : null);
    return objeto ? (RELACIONES.find((r) => r.campo === campo).etiqueta(objeto) || id) : id;
  };
  const campoClase = 'w-full bg-[#1b2230] border border-slate-700 rounded p-2 text-sm text-white focus:outline-none focus:border-cyan-500';
  return (
    <section className="p-2 text-white max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-cyan-400">Gestión de Medios</h2>
      {error && <p role="alert" className="mb-4 text-sm text-red-400">{error}</p>}
      {aviso && <p role="status" className="mb-4 text-sm text-cyan-400">{aviso}</p>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <form onSubmit={guardar} className="bg-[#121721] p-5 rounded-xl border border-slate-800 h-fit">
          <h3 className="text-lg font-semibold mb-4 text-slate-200">{editando ? 'Editar Medio' : 'Nuevo Medio'}</h3>
          <div className="space-y-4">
            {[
              ['serial', 'Serial'], ['titulo', 'Título'], ['url', 'URL'], ['imagen', 'Imagen (URL)'], ['anioEstreno', 'Año de estreno']
            ].map(([campo, etiqueta]) => (
              <label key={campo} className="block text-xs text-slate-400">{etiqueta}
                <input className={`${campoClase} mt-1`} required type={campo === 'anioEstreno' ? 'number' : campo === 'url' || campo === 'imagen' ? 'url' : 'text'} min={campo === 'anioEstreno' ? 1888 : undefined} value={formulario[campo]} onChange={(e) => setFormulario({ ...formulario, [campo]: e.target.value })} />
              </label>
            ))}
            <label className="block text-xs text-slate-400">Sinopsis
              <textarea required rows="3" className={`${campoClase} mt-1`} value={formulario.sinopsis} onChange={(e) => setFormulario({ ...formulario, sinopsis: e.target.value })} />
            </label>
            {RELACIONES.map((r) => (
              <label key={r.campo} className="block text-xs text-slate-400">{r.titulo}
                <select className={`${campoClase} mt-1`} required value={formulario[r.campo]} onChange={(e) => setFormulario({ ...formulario, [r.campo]: e.target.value })}>
                  <option value="">Seleccionar {r.titulo.toLowerCase()}</option>
                  {(opciones[r.campo] || []).filter((x) => x.estado !== 'Inactivo' || x._id === formulario[r.campo]).map((x) => <option key={x._id} value={x._id}>{r.etiqueta(x)}</option>)}
                </select>
              </label>
            ))}
          </div>
          <button disabled={guardando} type="submit" className="mt-6 w-full bg-cyan-600 hover:bg-cyan-500 rounded-md py-2.5 font-semibold text-white disabled:opacity-50">{guardando ? 'Guardando...' : editando ? 'Guardar Cambios' : 'Guardar Medio'}</button>
          {editando && <button type="button" onClick={nuevo} className="mt-3 w-full rounded-md border border-slate-700 py-2 text-sm text-slate-200">Cancelar edición</button>}
        </form>
        <div className="md:col-span-2 bg-[#121721] p-5 rounded-xl border border-slate-800 min-w-0">
          <div className="flex items-center justify-between gap-3 mb-6">
            <h3 className="text-lg font-semibold text-slate-200">Medios Registrados</h3>
            <button type="button" onClick={cargar} className="text-sm text-cyan-400">Actualizar</button>
          </div>
          {cargando ? <p className="text-sm text-slate-400">Cargando registros...</p> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-slate-400 border-b border-slate-800"><tr>{['Título', 'Año', 'Género', 'Director', 'Tipo', 'Acciones'].map((x) => <th key={x} className="py-3 pr-4 font-semibold">{x}</th>)}</tr></thead>
                <tbody>{registros.length ? registros.map((r) => <tr key={r._id} className="border-b border-slate-800/60">
                  <td className="py-4 pr-4 font-semibold text-slate-100">{r.titulo}</td><td className="py-4 pr-4">{r.anioEstreno}</td>
                  {['genero','director','tipo'].map((campo) => <td key={campo} className="py-4 pr-4 text-slate-400">{nombreRelacionado(campo, r[campo])}</td>)}
                  <td className="py-4"><div className="flex flex-wrap gap-2"><button type="button" onClick={() => editar(r)} className="px-2 py-1 rounded border border-cyan-800 text-cyan-400">Editar</button><button type="button" onClick={() => eliminar(r)} className="px-2 py-1 rounded border border-red-900 bg-red-950/50 text-red-400">Eliminar</button></div></td>
                </tr>) : <tr><td colSpan="6" className="p-6 text-center text-slate-400">No hay registros de Media en la base de datos.</td></tr>}</tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
