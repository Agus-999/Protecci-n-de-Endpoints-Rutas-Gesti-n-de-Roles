const mysql = require('mysql2/promise');

const crearBaseDeDatos = async () => {
    try {
        // Conexión al servidor MySQL
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '2004'
        });

        // Crear las bases de datos necesarias
        await connection.query('CREATE DATABASE IF NOT EXISTS crud_db');
        await connection.query('CREATE DATABASE IF NOT EXISTS database_test');
        await connection.query('CREATE DATABASE IF NOT EXISTS database_production');

        console.log("Bases de datos creadas exitosamente");

        // Cerrar la conexión
        await connection.end();
    } catch (error) {
        console.error("Error creando las bases de datos:", error.message);
    }
};

// Ejecutar la función
crearBaseDeDatos();
