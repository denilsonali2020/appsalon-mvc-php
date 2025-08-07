let paso = 1;
const pasoInicial = 1;
const pasoFinal = 3;

//objeto en js con la informacion del servicio seleccionado
const cita = {
    id: '',
    nombre: '',
    fecha: '',
    hora: '',    
    servicios: []
}

document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
})

function iniciarApp() {
    mostrarSeccion();//muestra y oculta las secciones
    tabs(); //cambia la seccion cuanndo se presionan los tabs
    botonesPaginador(); //agrega o quieta los botones del paginador
    paginaSiguiente();
    paginaAnterior();

    consultarApi();//consulta la API en el backend en el php

    idCliente();
    nombreCliente();//añade el nombre del cliente al objeto de cita
    seleccionarFecha();//añade la fecha de la cita en el objeto
    seleccionarHora();//añade la hora en el objeto

    mostrarResumen();//muestra el resumen de la cita
}

function mostrarSeccion(){
    //ocultar ka seccion que tenga la clase de mostrar
    const seccionAnterior = document.querySelector('.mostrar');
    if(seccionAnterior) {
        seccionAnterior.classList.remove('mostrar');
    }

    //seleccionoar la seccion con el paso...
    const pasoSelector = `#paso-${paso}`;
    const seccion = document.querySelector(pasoSelector);
    seccion.classList.add('mostrar');

    //quita la clase de actual al tab anterior
    const tabAnterior = document.querySelector('.actual');
    if(tabAnterior) {
        tabAnterior.classList.remove('actual');
    }
    //Resalta el tab actual
    const tab = document.querySelector(`[data-paso="${paso}"]`);
    tab.classList.add('actual');
}

function tabs() {
    const botones = document.querySelectorAll('.tabs button');
    botones.forEach( boton => {
        boton.addEventListener('click', function (e) {
            paso = parseInt(e.target.dataset.paso);                        
            mostrarSeccion();
            botonesPaginador();
        });
    });
}

function botonesPaginador() {
    const paginaAnterior = document.querySelector('#anterior');
    const paginaSiguiente = document.querySelector('#siguiente');

    if(paso === 1) {
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    } else if(paso === 3) {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.add('ocultar');
        mostrarResumen();
    } else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }

    mostrarSeccion();
}

function paginaAnterior() {
    const paginaAnterior = document.querySelector('#anterior');

    paginaAnterior.addEventListener('click', function() {
        if(paso<=pasoInicial) return;
        paso--;
        
        botonesPaginador();
    });
}

function paginaSiguiente() {
    const paginaSiguiente = document.querySelector('#siguiente');

    paginaSiguiente.addEventListener('click', function() {
        if(paso>=pasoFinal) return;
        paso++;

        botonesPaginador();
    });
}

async function consultarApi () {

    try {
        const url = `${location.origin}/api/servicios`;//consultamos nuestra base de datos      
        const resultado = await fetch(url);//consultamos nuestra api con fetch
        const servicios = await resultado.json();//obtenemos los resultados como json
        mostrarServicios(servicios);
        
    } catch (error){
        console.log(error);
    }
}

function mostrarServicios(servicios) {
    servicios.forEach( servicio => {
        const { id, nombre, precio } = servicio;

        const nombreServicio = document.createElement('P');
        nombreServicio.classList.add('nombre-servicio');
        nombreServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.classList.add('precio-servicio');
        precioServicio.textContent = `L ${precio}`;

        const servicioDiv = document.createElement('DIV');
        servicioDiv.classList.add('servicio');
        servicioDiv.dataset.idServicio = id;
        //le asignamos un evento y declaramos una funcion y dentro llamamos a una funcion para que funciones
        //si lo hacemos como selecccionarServicio(servicio) js inerpreta que llamamos a todos los servicios
        servicioDiv.onclick = function () {
            seleccionarServicios(servicio);
        }

        servicioDiv.appendChild(nombreServicio);
        servicioDiv.appendChild(precioServicio);        

        document.querySelector('#servicios').appendChild(servicioDiv);
    })
}

function seleccionarServicios (servicio) {
    const { id } = servicio;
    const { servicios } = cita;

    //identificar al elemento al que se le da click
    const divServicios = document.querySelector(`[data-id-servicio = "${id}"]`)
    //conprobar si un servicio ya fue agregado
    //.some sirve para verificar si existe en un objeto
    if( servicios.some( agregado => agregado.id === id ) ) {
        //Eliminarlo si ya esta agragado
        //.filter sirve para sacar un elemento dependiendo la doncicion
        cita.servicios = servicios.filter( agregado => agregado.id !==id );
        divServicios.classList.remove('seleccionado');
    } else {
        //Agregarlo si aun no lo esta
        //asociamos cita a servicio y luego hacemos una copia del arreglo servicio con el ... y le asociamos un nuevo servicio
        cita.servicios = [...servicios, servicio];
        divServicios.classList.add('seleccionado');
    }        
}
function idCliente() {
    cita.id = document.querySelector('#id').value;
}

function nombreCliente() {
    cita.nombre = document.querySelector('#nombre').value;        
}


function seleccionarFecha() {
    const inputFecha = document.querySelector('#fecha');
    inputFecha.addEventListener('input', function (e) {
        const dia = new Date(e.target.value).getUTCDay();
        
        //controlar que dias no pueden haber cita
        if( [6,0].includes(dia) ) {
            e.target.value = '';
            mostrarAlerta('Fines de semana no permitidos', 'error', '.formulario');
        }else {
            cita.fecha = e.target.value;            
        }
    })
}

function seleccionarHora() {
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', function(e) {        

        const horaCita = e.target.value;
        //split sirve para separar una cadena de texto
        const hora = parseInt(horaCita.split(":")[0], 10);//Base 10 (radix = 10) es el sistema decimal, que es el que usamos normalmente: números del 0 al 9.
        if(hora <10 || hora >18) {
            e.target.value = '';
            mostrarAlerta('Fuera del horario laboral', 'error', '.formulario');
        } else {
            cita.hora = e.target.value;            
        }
    })
}

function mostrarAlerta(mensaje, tipo, elemento, desaparece = true) {

    //previene que se genere mas de una alerta
    const alertaPrevia = document.querySelector('.alerta');
    if(alertaPrevia) {
        alertaPrevia.remove();
    };

    //scriptin para crear la alerta
    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');
    alerta.classList.add(tipo);

    const referencia = document.querySelector(elemento);
    referencia.appendChild(alerta);

    if(desaparece) {
        //eliminar la alerta
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }

}

function mostrarResumen() {
    const resumen = document.querySelector('.contenido-resumen');
    
    //limpiar el contenido de resumen
    while(resumen.firstChild ) {
        resumen.removeChild(resumen.firstChild);
    }
    //con el Object.values iteramos sobre el objeto de citar y verificamos si hay algun elemento vacio
    if(Object.values(cita).includes('') || cita.servicios.length === 0) {
        mostrarAlerta('Faltan datos de Servicio, Fecha u Hora', 'error', '.contenido-resumen', false);
        return;
    }

    //formatear el div de resumen
    const { nombre, fecha, hora, servicios } = cita;

    //Heading para servicios en resumen
    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de Servicios';
    resumen.appendChild(headingServicios);

    //iterando y mostrando los servicios
    servicios.forEach(servicio => {
        const { id, precio, nombre} = servicio; 
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.innerHTML = `<span>Precio: </span> $${precio}`;

        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        resumen.appendChild(contenedorServicio);
    })

    //Heading para cita en resumen
    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen de Cita';
    resumen.appendChild(headingCita);

    const nombreCliente = document.createElement('P');
    nombreCliente.innerHTML = `<span>Nombre: </span> ${nombre}`;

    //formatear la fecha en español
    const fechaObj = new Date(fecha);
    const mes = fechaObj.getMonth();
    const dia = fechaObj.getDate() + 2;//ocurre un desface de dias porque se utiliza new Date cosas raras de esa metodo
    const year = fechaObj.getFullYear();

    const fechaUTC = new Date( Date.UTC(year, mes, dia) );

    const opciones = { weekday : 'long', year: 'numeric', month: 'long', day: 'numeric' }
    const fechaFormateada = fechaUTC.toLocaleDateString('es-MX', opciones); //localizacion de idiomas wikipedia para otros paises
    
    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha: </span> ${fechaFormateada}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora: </span> ${hora} Horas`;

    //boton para crear una cita
    const botonReservar = document.createElement('BUTTON');
    botonReservar.classList.add('boton');
    botonReservar.textContent = 'Reservar Cita';
    botonReservar.onclick = reservarCita;//cuando se asosia un evento de esa forma no le pasas () a reservarCita pero si quieres pasasr un paramretro crea un callback osea = function () { reservarCota(); }

    resumen.appendChild(nombreCliente);//con esto gregamos al HTML
    resumen.appendChild(fechaCita);
    resumen.appendChild(horaCita);   
    resumen.appendChild(botonReservar);
}

async function reservarCita () {
    
    const { fecha, hora, servicios, id } = cita;
    const idServicios = servicios.map( servicio => servicio.id );    

    const datos = new FormData();

    //append() agraga datos a new FormData()
    datos.append('fecha', fecha);
    datos.append('hora', hora);
    datos.append('usuarioId', id);
    datos.append('servicios', idServicios);

    ///console.log([...datos]);
    
    try {
        //Peticion hacia la api
        const url = `${location.origin}/api/citas`;

        const respuesta = await fetch(url, {
            method: 'POST',        
            body: datos
        });

        const resultado = await respuesta.json();
        console.log(resultado);

        if(resultado.resultado) {
            Swal.fire({
                icon: "success",
                title: "Cita Creada",
                text: "Tu cita fue creada correctamente!",
                button: 'Ok'
            }).then( () => {
                setTimeout(() => {
                    window.location.reload();
                },3000);
            });
        } 
        //console.log([...datos]); //con esta forma se puede acceder a los datos de append()        
        
    } catch (error) {
        Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al guardar la cita",        
        });
    }
}

