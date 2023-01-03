const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos')

const { 
    palabrasGet, 
    palabrasPut, 
    palabrasPost, 
    palabrasDelete} = require('../controllers/palabras');

const router = Router();

router.get('/', palabrasGet);

router.put('/:id', [
    check('id', 'No es un ID válido.').isMongoId(),
    validarCampos
],  palabrasPut);

router.post('/', [
    check('concepto', 'La palabra o concepto es obligatorio.').not().isEmpty(),
    check('significado', 'El significado es obligatorio.').not().isEmpty(),
    validarCampos
], palabrasPost);

router.delete('/:id', [
    check('id', 'No es un ID válido.').isMongoId(),
    validarCampos
], palabrasDelete);



module.exports = router;