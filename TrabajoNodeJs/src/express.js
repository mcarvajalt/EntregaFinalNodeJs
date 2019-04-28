require('./helpers/helpers');
const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Usuario = require('./models/usuarios');
const multer =require('multer')
const directoriopublico = path.join(__dirname,'../public' );
const directoriopartials = path.join(__dirname,'../templates/partials' );

const http = require('http');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
app.use(express.static(directoriopublico));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))
app.set('view engine','hbs');
path.join(__dirname,'../public' );
hbs.registerPartials(directoriopartials);
const dirPublic = path.join(__dirname, "../public")
app.use(express.static(dirPublic))
const {Usuarios} = require('./usuarios')

mongoose.connect('mongodb://localhost:27017/univercidad', {useNewUrlParser: true},(err, resultado) =>{
	if(err){
		return console.log(error)
	}
	console.log("Conectado")
});
const usuarios = new Usuarios();
let contador = 0;
io.on('connection', client => {
	console.log("un usuario se ha conectado")
	
	client.on('usuarioNuevo',(usuario) =>{
		let listado = usuarios.agregarUsuario(client.id, usuario)
		console.log(listado)
		let texto = `Se ha conectado ${usuario}`
		io.emit('nuevoUsuario', texto )
	})
	client.on('disconnect',()=>{
		let usuarioBorrado = usuarios.borrarUsuario(client.id)
		let texto = `Se ha desconectado ${usuarioBorrado.nombre}`
		io.emit('usuarioDesconectado', texto)
	})
	client.on("texto",(text, callback) =>{
		let usuario = usuarios.getUsuario(client.id)
		let texto = `${usuario.nombre} : ${text}`
		console.log(text)
		io.emit("texto", texto)
		callback()
	})
	client.on("textoPrivado", (text, callback) =>{
		let usuario = usuarios.getUsuario(client.id)
		let texto = `${usuario.nombre} : ${text.mensajePrivado}`
		let destinatario = usuarios.getDestinatario(text.destinatario)
		client.broadcast.to(destinatario.id).emit("textoPrivado", (texto))
		callback()
	})
});
app.get('/',(req,res)=>{
	//console.log(req.query);
	res.render('index',{
		estudiante: req.body.nombre,
		nota1:parseInt(req.body.nota1),
		nota2:parseInt(req.body.nota2)
	});
});
app.get('/login',(req,res)=>{
	Usuario.findOne({documentoDeIdentidad: req.query.documentoDeIdentidad}).exec((err,respuesta)=>{
		if(err){
			return console.log(err)
		}
		if(respuesta != null){
			
				
			res.render('inicio',{
				listado: respuesta
			
			});	
		}else{
			res.render('login');
		}
	});
})
app.get('/crearUsuario',(req,res)=>{
	let usuario = new Usuario({
		documentoDeIdentidad:req.query.documentoDeIdentidad,
		nombre: req.query.nombre,
		correo: req.query.correo,
		telefono: req.query.telefono,
		rol: 'usuario'
	})
	Usuario.findOne({documentoDeIdentidad:req.query.documentoDeIdentidad}).exec((err,respuesta)=>{
		if(respuesta!= null){
			return console.log('No se puede insertar')
		}
		else{
			usuario.save((err, resultado)=>{
				console.log('Se guardo exitosamente')
				res.render('crearUsuario', {
					titulo: "Error No se pudo guardar",
				})
			});
		}
	})
})
app.get('/verUsuarios',(req, res)=>{
	Usuario.find({}).exec((err,respuesta)=>{
		if(err){
			return console.log(err)
		}
		res.render('verUsuarios',{
			listado: respuesta
		});
	})
})

app.get('*',(req,res)=>{
	res.render('error',{
		estudiante :'error'
	})
})

app.post('/',(req,res)=>{
	console.log( req.body.documentoDeIdentidad);
	console.log( req.body.nombre);
	console.log( req.body.correo);
	console.log( req.body.telefono);
	console.log( req.body.rol);
	let usuario = new Usuario({
		documentoDeIdentidad: req.body.documentoDeIdentidad,
		nombre: req.body.nombre,
		correo: req.body.correo,
		telefono: req.body.telefono,
		rol: req.body.rol
	})
	console.log( usuario);
	usuario.save((err, resultado)=>{
		if(err){
			res.render('verInscritos', {
				titulo: "Error 404",
				mostrar: err
			})
		}
		res.render('verInscritos',{
			mostrar: resultado

		})
		
	});
})

const port = process.env.PORT||3000;
console.log(__dirname);
server.listen(port,()=>{
	console.log('escucha por el puerto ' + port);
});

