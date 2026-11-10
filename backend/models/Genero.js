const { Schema, model } = require('mongoose');

const GeneroSchema = Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del género es obligatorio'],
    unique: true,
    trim: true
  },
  estado: {
    type: String,
    required: true,
    enum: ['Activo', 'Inactivo'],
    default: 'Activo'
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

module.exports = model('Genero', GeneroSchema, 'generos');