var express = require('express');
var router = express.Router();
const { connection } = require('../database/conexion.js')


//obtener los datos del sql
router.get('/', function (req, res, next){
    connection.query('SELECT * FROM pacientes', (error, ressults) => {
        if (error){
            console.log("Error en la consulta", error);
            res.status(500).send("error en la consulta")
        } else{
            res.render('pacientes', { title: 'pacientes', pacientes: ressults, opcion: 'disabled', estado: true })
        }
    })
})

//actualizar pacientes
router.get('/enviar/:clave', function (req, res, next) {
    const clave = req.params.clave;
    connection.query('SELECT * FROM pacientes', (error, results) => {
        if (error) {
            console.log("Error en la consulta", error)
            res.status(500).send("Error en la consulta")
        } else {
            res.render('pacientes', { title: 'pacientes', claveSeleccionada: clave, pacientes: results, opcion: 'disabled', estado: false })
        }
    });
});

router.post('/actualizar/:cedula', (req, res) => {
    const cedula = req.params.cedula;
    const nombre = req.body.nombre;
    const apellido = req.body.apellido
    const edad = req.body.edad;
    const telefono = req.body.telefono;
    connection.query(`UPDATE pacientes SET nombre='${nombre}', apellido ='${apellido}', edad=${edad}, telefono=${telefono} WHERE cedula=${cedula}`, (error, result) => {
        if (error) {
            console.log("Ocurrio un error en la ejecución", error)
            res.status(500).send("Error en la consulta");
        } else {
            res.redirect('/pacientes');
        }
    });
})

//agregar pacientes
router.post('/agregar', (req, res) => {
    const cedula = req.body.cedula;
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const edad = req.body.edad
    const telefono = req.body.telefono
    connection.query(`INSERT INTO pacientes (cedula, nombre, apellido, edad, telefono) VALUES (${cedula},'${nombre}', '${apellido}', ${edad}, ${telefono})`, (error, result) => {
        if (error) {
            console.log("Ocurrio un error en la ejecución", error)
            res.status(500).send("Error en la consulta");
        } else {
            res.redirect('/pacientes');
        }
    });
})

router.get('/agregar-paciente', function (req, res, next){
    res.sendFile('registro-pacientes.html', {root: 'public'})
})

//eliminar pacientes
router.get('/eliminar/:cedula', function (req, res, next) {
    const cedula = req.params.cedula
    connection.query(`DELETE FROM cita_medica WHERE id_paciente = ${cedula}`, (error, results) => {
        if (error) {
            console.log("Error en la consulta", error)
            res.status(500).send("Error en la consulta")
        } else {
            connection.query(`DELETE FROM pacientes WHERE cedula = ${cedula}`, (error, results) => {
                if (error) {
                    console.log("Error en la consulta", error)
                    res.status(500).send("Error en la consulta")
                } else {
                    res.redirect('/pacientes')
                }
            });
        }
    });
});

module.exports = router;

