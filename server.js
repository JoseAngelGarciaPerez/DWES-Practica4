const http = require("http");
const url = require("url");
const fs = require("fs");
const { MongoClient } = require("mongodb");
const { ObjectId } = require("mongodb");
const urlConexion = "mongodb://127.0.0.1:27017";
const datos = require('./harry-potter-characters.json');
const client = new MongoClient(urlConexion);

//Creamos el server
http.createServer(function (peticion, respuesta) {

    let urlBase = url.parse(peticion.url, true);
    let pathname = urlBase.pathname;

    //Headers de MongoDB
    respuesta.setHeader('Access-Control-Allow-Origin', '*');
    respuesta.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTION, PUT, PATCH, DELETE');

    // creamos las variables de bd y coleccion con los nombres que se pide
    let bd = 'harry';
    let coleccion = "personajes";
    let datos = "harry-potter-characters.json";

    //Importamos la base de datos desde el JSON (EJERCICIO 1) usando la url "/importar"
    if (pathname == "/importar") {
        //crear conexion
        conectar(bd, coleccion, respuesta);
    }

    //Mostramos una tabla con los personajes (EJERCICIO 2)
    else if (pathname == "/consulta") {

        let finalData = "";

        //mientras no llegan los datos
        peticion.on('data', function (data) {
            finalData += data;

        }).on('end', function () {
            let datos;
            let param;
            if (peticion.method === 'GET') {
                datos = urlBase.query;
            } else {
                datos = finalData;
            }
            param = new URLSearchParams(datos);

            let db = "harry";
            let coleccion = "personajes";
            let filtro = {};

            consultar(db, coleccion, filtro, respuesta)
                .then(respuesta)
                .catch(console.error)
                .finally(() => client.close());

            console.log("-- Realizando consulta SIN FILTROS --");
        })



    }

    //FILTROS DE BUSQUEDA
    //Por especie
    else if (pathname == "/filtro1") {
        let finalData = "";

        peticion.on('data', function (data) {
            finalData += data;

        }).on('end', function () {
            let datos;
            let param;
            if (peticion.method === 'GET') {
                datos = urlBase.query;
            } else {
                datos = finalData;
            }
            param = new URLSearchParams(datos);

            let db = "harry";
            let coleccion = "personajes";
            //Si la especie es humana
            let filtro = { species: "human" };

            consultar(db, coleccion, filtro, respuesta)
                .then(respuesta)
                .catch(console.error)
                .finally(() => client.close());
            console.log("-- Realizando consulta FILTRO 1 --");
        })
    }

    //Por año
    else if (pathname == "/filtro2") {
        let finalData = "";

        peticion.on('data', function (data) {
            finalData += data;

        }).on('end', function () {
            let datos;
            let param;
            if (peticion.method === 'GET') {
                datos = urlBase.query;
            } else {
                datos = finalData;
            }
            param = new URLSearchParams(datos);

            let db = "harry";
            let coleccion = "personajes";
            //Si el año de nacimiento es anterior a 1979
            let filtro = { "yearOfBirth": { $lt: 1979 } };

            consultar(db, coleccion, filtro, respuesta)
                .then(respuesta)
                .catch(console.error)
                .finally(() => client.close());
            console.log("-- Realizando consulta FILTRO 2 --");
        })
    }
    //Por varita
    else if (pathname == "/filtro3") {
        let finalData = "";

        peticion.on('data', function (data) {
            finalData += data;

        }).on('end', function () {
            let datos;
            let param;
            if (peticion.method === 'GET') {
                datos = urlBase.query;
            } else {
                datos = finalData;
            }
            param = new URLSearchParams(datos);

            let db = "harry";
            let coleccion = "personajes";
            //Si el atributo "wood" de la propiedad "wand" es "holly"
            let filtro = { "wand.wood": "holly" };

            consultar(db, coleccion, filtro, respuesta)
                .then(respuesta)
                .catch(console.error)
                .finally(() => client.close());
            console.log("-- Realizando consulta FILTRO 3 --");
        })
    }

    //Por estado
    else if (pathname == "/filtro4") {
        let finalData = "";

        peticion.on('data', function (data) {
            finalData += data;

        }).on('end', function () {
            let datos;
            let param;
            if (peticion.method === 'GET') {
                datos = urlBase.query;
            } else {
                datos = finalData;
            }
            param = new URLSearchParams(datos);

            let db = "harry";
            let coleccion = "personajes";
            //Si está vivo y es estudiante de Hogwarts
            let filtro = { "alive": true, "hogwartsStudent": true };

            consultar(db, coleccion, filtro, respuesta)
                .then(respuesta)
                .catch(console.error)
                .finally(() => client.close());
            console.log("-- Realizando consulta FILTRO 4 --");
        })
    }

    //Borrar personaje (EJERCICIO 4)
    else if (pathname == "/borrar") {
        let finalData = "";

        peticion.on('data', function (data) {
            finalData += data;

        }).on('end', function () {
            let datos;
            let param;
            if (peticion.method === 'POST') {
                datos = finalData;
            } else {
                datos = urlBase.query;
            }
            param = new URLSearchParams(datos);

            //Seleccionamos al personaje por ID
            let selectedId = param.get('_id');

            let db = "harry";
            let coleccion = "personajes";

            //Filtramos por el id seleccionado, así solo tendremos al personaje concreto que queremos borrar
            let filtro = { _id: new ObjectId(selectedId) };

            borrarPersonaje(db, coleccion, filtro, respuesta)
                .then(respuesta)
                .catch(console.error)
                .finally(() => client.close());
        })

    }
    else if (pathname == "/añadir") {

    }
    else {
            respuesta.writeHead(404, { 'Content-Type': 'text/html;charset=utf-8' });
            respuesta.write("<h1>ERROR EN LA URL</h1><p>La página a la que intentas acceder no existe</p>");
            respuesta.end();
            client.close();


    }
    //Usaremos, como en prácticas anteriores, el puerto 8090
}).listen(8090, function (err) {
    if (err) {
        console.log("ERROR AL INICIAR SERVIDOR", err);
    }
    console.log("Servidor abierto");
});


// FUNCIONES

//Crear la función de conexion
async function conectar(bd, coleccion, respuesta) {
   
    await client.connect();
    console.log("Conexión creada correctamente");
    const dbo = client.db(bd);
    let resultadoLectura = "";

    //Leemos los datos
    resultadoLectura = await resultadoLecturaJSON(bd, coleccion, respuesta);
    //Muestra de datos
    console.log("RESULTADO DE resultadoLectura " + resultadoLectura);

    respuesta.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
    respuesta.write("<h1>Conexión creada</h1><p>Se conecto a la base de datos correctamente</p>");

    respuesta.end();
    client.close();
}

//Función para resultadoLectura el JSON e insertar los datos
async function resultadoLecturaJSON(bd, coleccion, respuesta) {
    //Leemos el archivo JSON
    fs.readFile("harry-potter-characters.json", function (err, datos) {
        if (err) throw err;
        //Creamos la colección
        crearColeccion(bd, coleccion, respuesta)
            .then(console.log)
            .catch(console.error)
        console.log("-Coleccion creada-");
        
        // Insertamos los datos parseados
        insertarDatos(bd, coleccion, respuesta, JSON.parse(datos))
            .then(console.log)
            .catch(console.error)
        console.log("-Coleccion insertada-");

    });
}
// Función que crea la coleccion (EJERCICIO 1)
async function crearColeccion(bd, coleccion, respuesta) {
    await client.connect();
    console.log("Conexión creada correctamente");
    const dbo = client.db(bd);
    //Creamos la colección
    let coleccionCreada = await dbo.createCollection(coleccion);
    
    console.log("===Se creo la colección: ", coleccionCreada.collectionName.collection);
}

//Creamos la función de insertarDatos datos
async function insertarDatos(bd, coleccion, respuesta, datos) {
    await client.connect();
    console.log("Conexión creada correctamente");
    const dbo = client.db(bd);

    //Eliminamos los datos de la coleccion
    await dbo.collection(coleccion).deleteMany();

    // Insertamos los datos del JSON en la colección
    await dbo.collection(coleccion).insertMany(datos);

    respuesta.writeHead(404, { 'Content-Type': 'text/html;charset=utf-8' });
    respuesta.write("<h1>Inserción creada correctamente</h1>");
    console.log("-Datos insertados en la coleccion-");
}

//Función que realiza la consulta en la BD según su filtro
async function consultar(db, coleccion, filtro, respuesta) {
    await client.connect();
    console.log("Conexión creada correctamente");
    const dbo = client.db(db);
    //Filtramos la BD
    const resultado = await dbo.collection(coleccion).find(filtro).toArray();
    respuesta.end(JSON.stringify(resultado));
    //Devolvemos los resultados
    return JSON.stringify(resultado);
}

//Función para borrar a un personaje
async function borrarPersonaje(db, coleccion, filtro, respuesta) {
    await client.connect();
    console.log("Conexión creada correctamente");
    const dbo = client.db(db);
    //Borramos un dato segun el filtro
    let borrar = await dbo.collection(coleccion).deleteOne(filtro);
    console.log("Datos borrados: ", borrar.deletedCount)
    respuesta.end(JSON.stringify(borrar.deletedCount));
}
