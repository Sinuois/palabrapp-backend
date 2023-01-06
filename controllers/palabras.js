const { response } = require('express');
const palabra = require('../models/palabra');
const Palabra = require('../models/palabra');

const palabrasGet = async(req, res = response) => { //Obtener palabras

    const { limite, desde } = req.query; //Parámetros opcionales que vienen en el url

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

const palabraGet = async(req, res = response) => { //Verificar palabra
    const { id } = req.params;
    //Verificar si concepto existe por id
    const existeId = await Palabra.findById(id);
    if ( existeId ) {
        const significado = existeId.significado;
        return res.status(200).json({
            msg: 'El id sí existe',
            significado
        })
    } else {
        return res.status(400).json({
            msg: 'El id no existe',

        })
    }
}

const palabrasPost = async(req, res = response) => { //Agregar palabra

    const { concepto, significado } = req.body;
    const palabra = new Palabra( { concepto, significado } );

    //Verificar si concepto existe
    const existeConcepto = await Palabra.findOne({ concepto });
    if ( existeConcepto ) {
        return res.status(400).json({
            msg: `El concepto "${ existeConcepto.concepto }" ya está registrado.`
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
    const { significado, ...todos } = req.body;

    if ( significado ) todos.significado = significado;

    //Verificar si concepto existe por id
    const existeId = await Palabra.findById(id);
    
    if ( !existeId ) {
        return res.status(400).json({
            msg: 'El id no existe'
        })
    }

    const palabra = await Palabra.findByIdAndUpdate( id, todos );

    res.json({
        msg: 'Concepto correctamente actualizado'
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

        msg: `El concepto "${ conceptoEliminado.concepto }" eliminado correctamente.`,
        id,
        conceptoEliminado
    })
}

module.exports = {
    palabrasGet,
    palabraGet,
    palabrasPost,
    palabrasPut,
    palabrasDelete
    
}