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
// 4. Eliminar un Tipo por ID (DELETE)
const deleteTipo = async (req, res) => {
  try {
    const { id } = req.params;
    const tipoBorrado = await Tipo.findByIdAndDelete(id);

    if (!tipoBorrado) {
      return res.status(404).json({ msg: 'El tipo a eliminar no fue encontrado' });
    }

    return res.json({ msg: 'Tipo eliminado correctamente' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Error al eliminar el tipo' });
  }
};

module.exports = {
  createTipo,
  getTipos,
  updateTipo,
  deleteTipo
};

