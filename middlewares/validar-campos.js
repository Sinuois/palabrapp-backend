const { validationResult } = require('express-validator');

const validarCampos = ( req, res, next ) => {
    const errors = validationResult(req); //Reúne los errores que se hayan chequeado en routes
    if ( !errors.isEmpty() ) {
        return res.status(400).json(errors);
    } 

    next();
}

module.exports = {
    validarCampos
}