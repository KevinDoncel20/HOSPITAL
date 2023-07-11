var express = require('express');
var router = express.Router();
const { connection } = require('../database/conexion.js')


//obtener los datos del sql
router.get('/', function (req, res, next){
    connection.query('SELECT * FROM medicos', (error, ressults) => {
        if (error){
            console.log("Error en la consulta", error);
            res.status(500).send("error en la consulta")
        } else{
            res.render('medicos', { title: 'medicos', medicos: ressults, opcion: 'disabled', estado: true })
        }
    })
})


//actualizar medicos
router.get('/enviar/:clave', function (req, res, next) {
    const clave = req.params.clave;
    connection.query('SELECT * FROM medicos', (error, results) => {
        if (error) {
            console.log("Error en la consulta", error)
            res.status(500).send("Error en la consulta")
        } else {
            res.render('medicos', { title: 'medicos', claveSeleccionada: clave, medicos: results, opcion: 'disabled', estado: false })
        }
    });
});

router.post('/actualizar/:cedula', (req, res) => {
    const cedula = req.params.cedula;
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const especialidad = req.body.especialidad;
    const consultorio = req.body.consultorio;
    const correo = req.body.correo;
    connection.query(`UPDATE medicos SET nombre='${nombre}', apellido ='${apellido}', consultorio='${consultorio}', correo='${correo}' WHERE cedula=${cedula}`, (error, result) => {
        if (error) {
            console.log("Ocurrio un error en la ejecución", error)
            res.status(500).send("Error en la consulta");
        } else {
            res.redirect('/medicos');
        }
    });
})


//agregar medicos
router.post('/agregar', (req, res) => {
    const cedula = req.body.cedula;
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const especialidad = req.body.especialidad;
    const consultorio = req.body.consultorio;
    const correo = req.body.correo;
    connection.query(`INSERT INTO medicos (cedula, nombre, apellido, especialidad, consultorio, correo) VALUES (${cedula},'${nombre}', '${apellido}', '${especialidad}', '${consultorio}', '${correo}')`, (error, result) => {
        if (error) {
            console.log("Ocurrio un error en la ejecución", error)
            res.status(500).send("Error en la consulta");
        } else {
            res.redirect('/medicos');
        }
    });
})


//agregar medicos
router.get('/agregar-medico', function (req, res, next) {
    connection.query('SELECT especialidad FROM medicos', (error, results) => {
        if (error) {
            console.log("Error en la consulta", error)
            res.status(500).send("Error en la consulta")
        } else {
            let especialidades = ['Medicina general', 'Dermatología', 'Odontología', 'Cardiología', 'Rehabilitación física', 'Radiología', 'Medicina Interna', 'Psicología']
            let resultsEspecialidades = results.map(objeto => objeto.especialidad);//separar packete
            let resultsSinRepetidos = especialidades.filter((elemento) => {//filtrar repetidos
                return !resultsEspecialidades.includes(elemento);
            });
            res.render('registro-medicos', { layout: 'registro', especialidades:resultsSinRepetidos})
        }
    });
});

//eliminar medicos
router.get('/eliminar/:cedula', function (req, res, next) {
    const cedula = req.params.cedula
    connection.query(`DELETE FROM cita_medica WHERE id_medico = ${cedula}`, (error, results) => {
        if (error) {
            console.log("Error en la consulta", error)
            res.status(500).send("Error en la consulta")
        } else {
            connection.query(`DELETE FROM medicos WHERE cedula = ${cedula}`, (error, results) => {
                if (error) {
                    console.log("Error en la consulta", error)
                    res.status(500).send("Error en la consulta")
                } else {
                    res.redirect('/medicos')
                }
            });
        }
    });
});


module.exports = router;