const { Schema, model } = require('mongoose');

const TipoSchema = Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del tipo es obligatorio'],
    unique: true,
    trim: true
  },
  descripcion: {
    type: String,
    trim: true
  },
  fechaCreacion: {
    type: Date,
    default: new Date()
  },
  fechaActualizacion: {
    type: Date,
    default: new Date()
  }
});

// OBLIGATORIO: Exportar directamente el modelo devuelto por model()
module.exports = model('Tipo', TipoSchema, 'tipos');