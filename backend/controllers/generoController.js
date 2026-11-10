const Genero = require('../models/Genero');

// 1. Crear un nuevo Género (POST)
const createGenero = async (req, res) => {
  try {
    const { nombre, descripcion, estado } = req.body;

    // Validar si el género ya existe en la BD
    const generoExiste = await Genero.findOne({ nombre });
    if (generoExiste) {
      return res.status(400).json({ msg: 'El género ya existe en la base de datos' });
    }

    // Crear la instancia del modelo
    let genero = new Genero();
    genero.nombre = nombre;
    genero.descripcion = descripcion;
    genero.estado = estado;
    genero.fechaCreacion = new Date();
    genero.fechaActualizacion = new Date();

    // Guardar en MongoDB Atlas
    genero = await genero.save();
    res.status(201).json(genero);

  } catch (error) {
    console.error(error);
    res.status(500).send('Ocurrió un error en el servidor');
  }
};

// 2. Obtener todos los Géneros (GET)
const getGeneros = async (req, res) => {
  try {
    const generos = await Genero.find();
    res.json(generos);
  } catch (error) {
    console.error(error);
    res.status(500).send('Ocurrió un error en el servidor');
  }
};

// 3. Actualizar un Género por ID (PUT)
const updateGenero = async (req, res) => {
  try {
    const { nombre, descripcion, estado } = req.body;

    let genero = await Genero.findById(req.params.id);
    if (!genero) {
      return res.status(404).json({ msg: 'El género no existe' });
    }

    genero.nombre = nombre;
    genero.descripcion = descripcion;
    genero.estado = estado;
    genero.fechaActualizacion = new Date();

    genero = await genero.save();
    res.json(genero);

  } catch (error) {
    console.error(error);
    res.status(500).send('Ocurrió un error en el servidor');
  }
};

module.exports = {
  createGenero,
  getGeneros,
  updateGenero
};