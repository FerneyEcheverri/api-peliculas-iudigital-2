const Tipo = require('../models/Tipo');

// 1. Crear un nuevo Tipo (POST)
const createTipo = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    const tipoExiste = await Tipo.findOne({ nombre });
    if (tipoExiste) {
      return res.status(400).json({ msg: 'El tipo ya existe en la base de datos' });
    }

    let tipo = new Tipo();
    tipo.nombre = nombre;
    tipo.descripcion = descripcion;
    tipo.fechaCreacion = new Date();
    tipo.fechaActualizacion = new Date();

    tipo = await tipo.save();
    res.status(201).json(tipo);

  } catch (error) {
    console.error(error);
    res.status(500).send('Ocurrió un error en el servidor');
  }
};

// 2. Obtener todos los Tipos (GET)
const getTipos = async (req, res) => {
  try {
    const tipos = await Tipo.find();
    res.json(tipos);
  } catch (error) {
    console.error(error);
    res.status(500).send('Ocurrió un error en el servidor');
  }
};

// 3. Actualizar un Tipo por ID (PUT)
const updateTipo = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    let tipo = await Tipo.findById(req.params.id);
    if (!tipo) {
      return res.status(404).json({ msg: 'El tipo no existe' });
    }

    tipo.nombre = nombre;
    tipo.descripcion = descripcion;
    tipo.fechaActualizacion = new Date();

    tipo = await tipo.save();
    res.json(tipo);

  } catch (error) {
    console.error(error);
    res.status(500).send('Ocurrió un error en el servidor');
  }
};

module.exports = {
  createTipo,
  getTipos,
  updateTipo
};

