const { Schema, model } = require('mongoose');

const MediaSchema = new Schema({
  serial: { type: String, required: true, unique: true, trim: true },
  titulo: { type: String, required: true, trim: true },
  sinopsis: { type: String, required: true, trim: true },
  url: { type: String, required: true, unique: true, trim: true },
  imagen: { type: String, required: true, trim: true },
  anioEstreno: { type: Number, required: true, min: 1888 },
  genero: { type: Schema.Types.ObjectId, ref: 'Genero', required: true },
  director: { type: Schema.Types.ObjectId, ref: 'Director', required: true },
  productora: { type: Schema.Types.ObjectId, ref: 'Productora', required: true },
  tipo: { type: Schema.Types.ObjectId, ref: 'Tipo', required: true },
  fechaCreacion: { type: Date, default: Date.now, immutable: true },
  fechaActualizacion: { type: Date, default: Date.now }
});

MediaSchema.pre('save', function () {
  if (!this.isNew) this.fechaActualizacion = new Date();
});

module.exports = model('Media', MediaSchema, 'medias');
