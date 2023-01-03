const { Schema, model } = require('mongoose');

const PalabraSchema = Schema({
    concepto: {
        type: String,
        required: [true, 'La palabra o concepto es obligatorio.'],
        unique: true
    },
    significado: {
        type: String,
        required: [true, 'El significado es obligatorio.']
    }
});

module.exports = model( 'Palabra', PalabraSchema )