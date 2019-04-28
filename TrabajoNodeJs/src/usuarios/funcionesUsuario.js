const fs = require ('fs');
const Usuario = require('../models/usuarios');
listaUsuarios = [];
const crear = (documentoDeIdentidad,nombre,correo,telefono) => {
	let usuario = new Usuario({
		documentoDeIdentidad:documentoDeIdentidad,
		nombre: nombre,
		correo: correo,
		telefono: telefono,
		rol: 'aspirante'
	})
	console.log( usuario);
	Usuario.findOne({documentoDeIdentidad:documentoDeIdentidad}).exec((err,respuesta)=>{
		if(respuesta!= null){
			return console.log('Noooooo se puede insertar')
		}
		else{
			usuario.save((err, resultado)=>{
				if(err){
					console.log('No se pudo guardar')
				}
				console.log('Se guardo exitosamente')
			});
		}
	})	
}

const listar = () => {
	try{
	listaUsuarios = require('./usuarios.json');
		}
		catch(error){
			listaUsuarios=[];
		}
}

const guardar = () => {
	let datos = JSON.stringify(listaUsuarios);
	fs.writeFile('src/usuarios/usuarios.json',datos,(err)=>{
		if (err) throw (err);
		console.log('Usuario creado con exito');
	})
}

module.exports = {
	crear
}