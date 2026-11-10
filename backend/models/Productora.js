const { Schema, model } = require('mongoose');

const ProductoraSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre de la productora es obligatorio'],
        unique: true,
        trim: true
    },
    estado: {
        type: String,
        required: true,
        enum: ['Activo', 'Inactivo'],
        default: 'Activo'
    },
    slogan: {
        type: String,
        trim: true
    },
    descripcion: {
        type: String,
        trim: true
    },
    fechaCreacion: {
        type: Date,
        required: true,
        default: new Date()
    },
    fechaActualizacion: {
        type: Date,
        required: true,
        default: new Date()
    }
});

module.exports = model('Productora', ProductoraSchema, 'productoras');