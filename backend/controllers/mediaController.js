const mongoose = require('mongoose');
const Media = require('../models/Media');
const Genero = require('../models/Genero');
const Tipo = require('../models/Tipo');

// Los modelos de Director y Productora se incorporarán desde las ramas de los compañeros.
// Consultamos sus colecciones sin sobrescribir ni duplicar sus implementaciones.
const RELACIONES = [
  { campo: 'genero', coleccion: 'generos', modelo: Genero, activo: true },
  { campo: 'director', coleccion: 'directores', activo: true },
  { campo: 'productora', coleccion: 'productoras', activo: true },
  { campo: 'tipo', coleccion: 'tipos', modelo: Tipo, activo: false }
];
const CAMPOS = ['serial', 'titulo', 'sinopsis', 'url', 'imagen', 'anioEstreno', 'genero', 'director', 'productora', 'tipo'];
const poblar = [{ path: 'genero' }, { path: 'tipo' }];

function errorRespuesta(res, error) {
  if (error.code === 11000) return res.status(409).json({ msg: 'El serial o la URL ya están registrados', campos: error.keyValue });
  if (error.name === 'ValidationError' || error.name === 'CastError') return res.status(400).json({ msg: error.message });
  console.error(error);
  return res.status(500).json({ msg: 'Ocurrió un error en el servidor' });
}

async function validarRelaciones(datos) {
  for (const relacion of RELACIONES) {
    const id = datos[relacion.campo];
    if (!mongoose.isValidObjectId(id)) return `El ID de ${relacion.campo} no es válido`;
    const coleccion = relacion.modelo ? relacion.modelo.collection : mongoose.connection.collection(relacion.coleccion);
    const documento = relacion.modelo
      ? await relacion.modelo.findById(id).lean()
      : await coleccion.findOne({ _id: new mongoose.Types.ObjectId(id) });
    if (!documento) return `No existe el registro de ${relacion.campo} indicado`;
    if (relacion.activo && documento.estado !== 'Activo') return `El registro de ${relacion.campo} debe estar Activo`;
  }
  return null;
}

const createMedia = async (req, res) => {
  try {
    const datos = Object.fromEntries(CAMPOS.filter(c => req.body[c] !== undefined).map(c => [c, req.body[c]]));
    const error = await validarRelaciones(datos);
    if (error) return res.status(400).json({ msg: error });
    const media = await Media.create(datos);
    return res.status(201).json(media);
  } catch (error) { return errorRespuesta(res, error); }
};

const getMedias = async (req, res) => {
  try { return res.json(await Media.find().populate(poblar).sort({ fechaCreacion: -1 })); }
  catch (error) { return errorRespuesta(res, error); }
};

const getMediaById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ msg: 'ID no válido' });
    const media = await Media.findById(req.params.id).populate(poblar);
    return media ? res.json(media) : res.status(404).json({ msg: 'Media no encontrada' });
  } catch (error) { return errorRespuesta(res, error); }
};

const updateMedia = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ msg: 'ID no válido' });
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ msg: 'Media no encontrada' });
    const cambios = Object.fromEntries(CAMPOS.filter(c => req.body[c] !== undefined).map(c => [c, req.body[c]]));
    const relaciones = Object.fromEntries(RELACIONES.map(r => [r.campo, cambios[r.campo] ?? media[r.campo]]));
    const error = await validarRelaciones(relaciones);
    if (error) return res.status(400).json({ msg: error });
    Object.assign(media, cambios);
    await media.save();
    return res.json(media);
  } catch (error) { return errorRespuesta(res, error); }
};

const deleteMedia = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ msg: 'ID no válido' });
    const media = await Media.findByIdAndDelete(req.params.id);
    return media ? res.json({ msg: 'Media eliminada correctamente' }) : res.status(404).json({ msg: 'Media no encontrada' });
  } catch (error) { return errorRespuesta(res, error); }
};

module.exports = { createMedia, getMedias, getMediaById, updateMedia, deleteMedia };
