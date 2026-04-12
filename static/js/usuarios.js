const miembros = [
    {
        nombre: "María González",
        telefono: "987-654-3210",
        correo: "maria.gonzalez@ug.uchile.cl",
        rol: "estudiante"
    },
    {
        nombre: "Carlos Pérez",
        telefono: "555-987-6543",
        correo: "carlos.perez@ug.uchile.cl",
        rol: "estudiante"
    },
    {
        nombre: "Ana López",
        telefono: "555-123-4567",
        correo: "ana.lopez@ug.uchile.cl",
        rol: "estudiante"
    },
    {
        nombre: "Luis Martínez",
        telefono: "",
        correo: "luis.martinez@ug.uchile.cl",
        rol: "docente"
    },
    {
        nombre: "Elena Rodríguez",
        telefono: "111-123-1234",
        correo: "elena.rodriguez@ug.uchile.cl",
        rol: "funcionario"
    },
    {
        nombre: "Jorge Fernández",
        telefono: "666-123-4321",
        correo: "jorge.fernandez@ug.uchile.cl",
        rol: "funcionario"
    }
]

let paginaActual = 1;
let rolSeleccionado = "todos";
let tipoOrden = "nombre-asc"

function actualizarVista() {
    // Se obtiene el container donde van a ir los usuarios
    const contenedor = document.getElementById("usuario-container");
    contenedor.innerHTML = "";

    // Se filtran los miembros según el rol registrado en la base de datos (lista con diccionarios por ahora)
    let miembrosFiltrados = miembros.filter(function (miembro) {
        if (rolSeleccionado === "todos") {
            return true;
        }
        return miembro.rol === rolSeleccionado;
    });

    // Se ordenan los miembros ya filtrados según el orden indicado
    miembrosFiltrados.sort(function (a, b) {
        let nombreA = a.nombre.toLowerCase();
        let nombreB = b.nombre.toLowerCase();

        if (tipoOrden === "nombre-asc") {
            if (nombreA < nombreB) return -1;
            if (nombreA > nombreB) return 1;
            return 0;
        } else {
            if (nombreA < nombreB) return 1;
            if (nombreA > nombreB) return -1;
            return 0;
        }
    });

    // Se determinan la cantidad de usuarios de cada página
    const inicio = (paginaActual - 1) * 5;
    const fin = inicio + 5;
    const miembrosPagina = miembrosFiltrados.slice(inicio, fin);

    // Se vuelve a cargar la función en el caso de que no coincida la página Actual y la cantidad de páginas existentes
    if (miembrosPagina.length === 0 && paginaActual > 1) {
        paginaActual--;
        return actualizarVista();
    }

    // Crea cada article donde va cada usuario
    miembrosPagina.forEach(function (miembro) {
        const article = document.createElement("article");
        article.className = "card-usuario card visible";

        article.innerHTML = `
            <h3>${miembro.nombre}</h3>
            <p>${miembro.telefono || "Sin teléfono"}</p>
            <p>${miembro.correo}</p>
            <p>${miembro.rol}</p>
        `;

        contenedor.appendChild(article);
    });

    // Actualiza número de página
    document.getElementById("numero-pag").innerText = `Página ${paginaActual}`;
}

actualizarVista()

let buttonPrev = document.getElementById("anterior-pag")
buttonPrev.addEventListener("click", () => {
    if (paginaActual > 1) {
        paginaActual--;
        actualizarVista();
    }
});

let buttonNext = document.getElementById("proxima-pag")
buttonNext.addEventListener("click", () => {
    if (paginaActual * 5 < miembros.length) {
        paginaActual++;
        actualizarVista();
    }
});

let filtroSelect = document.getElementById("filtro-rol");
filtroSelect.addEventListener("change", () => {
    rolSeleccionado = filtroSelect.value;
    paginaActual = 1;
    actualizarVista()
});

const ordenSelect = document.getElementById("filtro-orden");
ordenSelect.addEventListener("change", function () {
    tipoOrden = ordenSelect.value;
    actualizarVista();
});