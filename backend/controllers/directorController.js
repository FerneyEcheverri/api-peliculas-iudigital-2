const Director = require('../models/Director');
const { request, response } = require('express');

// Obtener todos los directores (GET)
const getDirectores = async (req = request, res = response) => {
    try {
        const directores = await Director.find();
        return res.status(200).json(directores);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            mensaje: 'Ocurrió un error al consultar los directores'
        });
    }
};

// Crear un nuevo director (POST)
const createDirector = async (req = request, res = response) => {
    try {
        const { nombres, estado } = req.body;

        const director = new Director({
            nombres,
            estado
        });

        await director.save();
        return res.status(201).json(director);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            mensaje: 'Ocurrió un error al crear el director'
        });
    }
};

// Actualizar un director por ID (PUT)
const updateDirector = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombres, estado } = req.body;
        
        const director = await Director.findByIdAndUpdate(
            id,
            { nombres, estado, fechaActualizacion: new Date() },
            { new: true }
        );

        if (!director) {
            return res.status(404).json({ mensaje: 'Director no encontrado' });
        }

        return res.status(200).json(director);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ mensaje: 'Ocurrió un error al actualizar el director' });
    }
};

module.exports = {
    getDirectores,
    createDirector,
    updateDirector
};