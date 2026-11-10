const Productora = require('../models/Productora');
const { request, response } = require('express');

// GET: Obtener todas las productoras
const getProductoras = async (req = request, res = response) => {
    try {
        const productoras = await Productora.find();
        return res.status(200).json(productoras);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: 'Error interno en el servidor' });
    }
};

// POST: Crear una nueva productora
const createProductora = async (req = request, res = response) => {
    try {
        const { nombre, slogan, descripcion, estado } = req.body;

        // Validar si la productora ya existe
        const productoraExiste = await Productora.findOne({ nombre });
        if (productoraExiste) {
            return res.status(400).json({ mensaje: 'La productora ya se encuentra registrada' });
        }

        let productora = new Productora({
            nombre,
            slogan,
            descripcion,
            estado,
            fechaCreacion: new Date(),
            fechaActualizacion: new Date()
        });

        productora = await productora.save();
        return res.status(201).json(productora);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al registrar la productora' });
    }
};


// PUT: Actualizar una productora por ID
const updateProductora = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { nombre, slogan, descripcion, estado } = req.body;

        let productora = await Productora.findById(id);
        if (!productora) {
            return res.status(404).json({ mensaje: 'Productora no encontrada' });
        }

        const data = {
            nombre,
            slogan,
            descripcion,
            estado,
            fechaActualizacion: new Date()
        };

        // 'returnDocument: after' le indica a Mongoose que devuelva el objeto YA actualizado
        productora = await Productora.findByIdAndUpdate(id, data, { returnDocument: 'after' });
        
        return res.status(200).json(productora);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al actualizar la productora' });
    }
};

module.exports = {
    getProductoras,
    createProductora,
    updateProductora
};