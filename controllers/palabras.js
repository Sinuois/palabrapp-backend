const { response } = require('express');
const palabra = require('../models/palabra');
const Palabra = require('../models/palabra');

const palabrasGet = async(req, res = response) => { //Obtener palabras

    const { limite = 5, desde = 0 } = req.query; //Parámetros opcionales que vienen en el url

    const [ total, palabras ] = await Promise.all([
        Palabra.countDocuments(), //Contar total de palabras en la BD
        Palabra.find() //Obtener las palabras tomando en cuenta los parámetros (que pueden venir o no)
            .skip( Number(desde) )
            .limit( Number(limite) )
        ]);

    const mostrando = palabras.length;

    res.json({
        mostrando,
        total,
        palabras
    });
}

const palabrasPost = async(req, res = response) => { //Agregar palabra

    const { concepto, significado } = req.body;
    const palabra = new Palabra( { concepto, significado } );

    //Verificar si concepto existe
    const existeConcepto = await Palabra.findOne({ concepto });
    if ( existeConcepto ) {
        return res.status(400).json({
            msg: 'Este concepto ya está registrado.'
        })
    }

    //Guardar en BD
    await palabra.save();

    res.json({
        msg: 'Concepto correctamente añadido.',
        palabra
    })
}


const palabrasPut = async(req, res = response) => { //Actualizar palabra

    const { id } = req.params;
    const { concepto, significado, ...todos } = req.body;

    if ( concepto ) todos.concepto = concepto;
    if ( significado ) todos.significado = significado;

    //Verificar si concepto existe por id
    const existeId = await Palabra.findById(id);
    
    if ( !existeId ) {
        return res.status(400).json({
            msg: 'El id no existe'
        })
    }

    //Verificar si concepto existe por concepto
    const existeConcepto = await Palabra.findOne({ concepto });
    if ( existeConcepto ) {
        return res.status(400).json({
            msg: 'Este concepto ya está registrado.'
        })
    }

    const palabra = await Palabra.findByIdAndUpdate( id, todos );

    res.json({
        msg: 'Concepto correctamente actualizado',
        concepto,
        significado
    })
}

const palabrasDelete = async(req, res = response) => { //Borrar palabra

    const { id } = req.params;

    //Verificar si concepto existe por id
    //Si existe, borrado físico
    const conceptoEliminado = await Palabra.findByIdAndDelete(id);

    //Si no existe, generar error
    if ( !conceptoEliminado ) {
        return res.status(400).json({
            msg: 'El id no existe'
        })
    }

    res.json({

        msg: 'petición delete desde el controlador',
        id,
        conceptoEliminado
    })
}

module.exports = {
    palabrasGet,
    palabrasPost,
    palabrasPut,
    palabrasDelete
    
}