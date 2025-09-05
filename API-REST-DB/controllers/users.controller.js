const { Usuario } = require('../models');

// Obtener todos los usuarios
const getUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll();
        res.json({ status: 200, data: usuarios });
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Error al obtener usuarios', error: error.message });
    }
};

// Obtener usuario por ID
const getUsuarioById = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) return res.status(404).json({ status: 404, message: 'Usuario no encontrado' });
        res.json({ status: 200, data: usuario });
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Error al obtener usuario', error: error.message });
    }
};

// Editar usuario
const updateUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) return res.status(404).json({ status: 404, message: 'Usuario no encontrado' });

        const { nombre, email, edad } = req.body;
        usuario.nombre = nombre || usuario.nombre;
        usuario.email = email || usuario.email;
        usuario.edad = edad || usuario.edad;

        await usuario.save();
        res.status(200).json({ status: 200, message: 'Usuario editado exitosamente', data: usuario });
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Error al editar usuario', error: error.message });
    }
};

// Eliminar usuario
const deleteUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) return res.status(404).json({ status: 404, message: 'Usuario no encontrado' });

        await usuario.destroy();
        res.status(200).json({ status: 200, message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Error al eliminar usuario', error: error.message });
    }
};

// Actualizar rol de un usuario (solo admin)
const updateUserRole = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

        usuario.rol = req.body.rol || usuario.rol;
        await usuario.save();
        res.status(200).json({ message: 'Rol actualizado exitosamente', data: usuario });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar rol', error: error.message });
    }
};

module.exports = {
    getUsuarios,
    getUsuarioById,
    updateUsuario,
    deleteUsuario,
    updateUserRole
};
