const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
    documentoDeIdentidad:{
        type : Number,
        required: true
    },
    nombre:{
        type: String,
        require: true
    },
    correo: {
        type: String,
        required: true
    },
    telefono:{
        type: String
    },
    rol:{
        type: String
    },
    archivo:{
        type: Buffer
    }
})

const Usuario = mongoose.model('Usuario', usuarioSchema);
module.exports = Usuario