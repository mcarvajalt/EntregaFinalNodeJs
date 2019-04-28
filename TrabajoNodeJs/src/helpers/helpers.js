const hbs = require('hbs');

hbs.registerHelper('crearUsuario',(documentoDeIdentidad, nombre,correo, telefono)=>{
	let texto = '';
		console.log(documentoDeIdentidad);
		console.log(nombre);
		console.log(correo);
		console.log(telefono);
		listaUsuarios = require('../usuarios/funcionesUsuario');
		listaUsuarios.crear(documentoDeIdentidad, nombre,correo,telefono);
})

hbs.registerHelper('verUsuarios',(listado)=>{
	let texto = ` <form action="/eliminar" method="get">
		<table class="table table-striped table-hover">
		<thead class="thdead-dark">
		<th>Nombre Estudiante</th>
		<th>Nombre Curso</th>
		</thead>
		<tbody>`;
		listado.forEach(usuario =>{
			texto = texto +
			`<tr>
			<td>${usuario.documentoDeIdentidad} </td>
			<td>${usuario.nombre}</td>
			<td>${usuario.correo}</td>
			<td>${usuario.telefono}</td>
			<td>${usuario.rol}</td>
			<td><button class="btn btn-danger" name="documentoDeIdentidad" value="${usuario.documentoDeIdentidad}">Eliminar</button>
			</tr>`;
		})
		texto = texto + '</tbody></table></form>'
		return texto;
})

