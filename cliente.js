//Variable para comprobar que filtro estamos usando
let filtro = 0;


$(document).ready(function () {
    let tabla;

    // EJERCICIO 3.1 - Mostrar todos los personajes
    $("#sinFiltros").click(function () {

        $.ajax({
            url: "http://127.0.0.1:8090/consulta",
            method: 'GET',
            data: {},
            success: function (respuesta) {
                let respuestaJSON = JSON.parse(respuesta);
                tabla = crearTabla(respuestaJSON);
                // $.append("#tabla-personajes").html(body);
                $("#contenido").html(tabla);

                filtro = 0;
            }
        })
    })

    // EJERCICIO 3.2 - Mostrar todos los humanos
    $("#filtro1").click(function () {
        $.ajax({
            url: "http://127.0.0.1:8090/filtro1",
            method: 'GET',
            data: {},
            success: function (respuesta) {
                // alert(respuesta);
                let respuestaJSON = JSON.parse(respuesta);
                tabla = crearTabla(respuestaJSON);
                // $.append("#tabla-personajes").html(body);
                $("#contenido").html(tabla);

                filtro = 1;
            }
        })

    })

    // EJERCICIO 3.3 - Mostrar si el año de nacimiento es anterior a 1979
    $("#filtro2").click(function () {
        $.ajax({
            url: "http://127.0.0.1:8090/filtro2",
            method: 'GET',
            data: {},
            success: function (respuesta) {
                // alert(respuesta);
                let respuestaJSON = JSON.parse(respuesta);
                tabla = crearTabla(respuestaJSON);
                // $.append("#tabla-personajes").html(body);
                $("#contenido").html(tabla);

                filtro = 2;
            }
        })

    })

    // EJERCICIO 3.4 - Mostrar si la varita tiene el valor "holly"
    $("#filtro3").click(function () {
        $.ajax({
            url: "http://127.0.0.1:8090/filtro3",
            method: 'GET',
            data: {},
            success: function (respuesta) {
                // alert(respuesta);
                let respuestaJSON = JSON.parse(respuesta);
                tabla = crearTabla(respuestaJSON);
                // $.append("#tabla-personajes").html(body);
                $("#contenido").html(tabla);

                filtro = 3;
            }
        })

    })

    // EJERCICIO 3.5 - Mostrar a los vivos estudiantes de Hogwarts
    $("#filtro4").click(function () {
        $.ajax({
            url: "http://127.0.0.1:8090/filtro4",
            method: 'GET',
            data: {},
            success: function (respuesta) {
                // alert(respuesta);
                let respuestaJSON = JSON.parse(respuesta);
                tabla = crearTabla(respuestaJSON);
                // $.append("#tabla-personajes").html(body);
                $("#contenido").html(tabla);

                filtro = 4;
            }
        })
    })
});


//EJERCICIO 4 - Borra al personaje de la fila segun su id
$(document).on("click", "#borrar", function (event) {
    // Cojemos el id del dato segun su atributo 'datoId' creado con la tabla
    id = $(this).attr('datoId');

    $.ajax({
        url: "http://localhost:8090/borrar",
        method: 'POST',
        data: { _id: id },
        success: function (respuesta) {

            //Si no se pudo borrar al personaje
            if (respuesta == '0') {
                //Mostramos un mensaje de error
                alert("ERROR AL BORRAR, no se pudo borrar al personaje");
            }
            //Si borramos al personaje
            else {
                //Mostramos un mensaje
                alert("Se borró al personaje con exito");

                //Segun el filtro en el que nos encontremos, recargamos la página con el filtro en cuestión
                switch (filtro) {
                    case 0:
                        $("#sinFiltros").click();
                        break;
                    case 1:
                        $("#filtro1").click();
                        break;
                    case 2:
                        $("#filtro2").click();
                        break;
                    case 3:
                        $("#filtro3").click();
                        break;
                    case 4:
                        $("#filtro4").click();
                        break;
                    default:
                        $("#sinFiltros").click();
                        break;
                }
            }
        }
    });
});

// Función para crear la tabla
function crearTabla(datos) {
    // Creamos la tabla
    let tabla = `<table class="table">
            <thead>
            <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Especie</th>
                <th>Género</th>
                <th>Casa</th>
                <th>Año de nacimiento</th>
            </tr>
        </thead>`
        ;

    tabla += '<tbody class="table">';

    //Para cada objeto de la BD
    $.each(datos, function () {
        // Insertamos una linea con sus datos en la tabla del HTML 
        tabla += `<tr><td><img src="${this.image}" width="100" height="100"></img></td><td>${this.name}</td><td>${this.species}</td>
        <td>${this.gender}</td><td>${this.house}</td><td>${this.yearOfBirth}</td>
        <td><button id="borrar" datoId="${this._id}" type="submit" class="btn btn-warning">Borrar</button></td></tr>`;
    })
    tabla += '</tbody></table>';
    return tabla;
}
