const buscador = document.getElementById("buscador");
const resultados = document.getElementById("resultados");
const mensaje = document.getElementById("mensajeBusqueda");
const modal = document.getElementById("modal");
const inputNota = document.getElementById("nota");

let actividadSeleccionada = null;

document.addEventListener("DOMContentLoaded", () => {
    buscador.addEventListener("input", manejarBusqueda);
    document
        .getElementById("guardar")
        .addEventListener("click", guardarNota);
    document
        .getElementById("cancelar")
        .addEventListener("click", cerrarModal);
});

async function manejarBusqueda() {
    const texto = buscador.value.trim();
    resultados.replaceChildren();

    if (texto.length < 3) {
        mensaje.textContent = "Escriba al menos 3 caracteres para comenzar la búsqueda.";
        return;
    }

    mensaje.textContent = "Buscando...";
    
    const respuesta = await fetch(
        "/api/actividades?buscar=" +
        encodeURIComponent(texto)
    );

    const actividades = await respuesta.json();
 
    if (texto !== buscador.value.trim()) {
        return;
    }
    mostrarResultados(actividades);
}

async function mostrarResultados(actividades) {

    resultados.replaceChildren();

    if (actividades.length === 0) {
        mensaje.textContent = "No se encontraron actividades.";
        return;
    }

    mensaje.textContent = "";

    for (const actividad of actividades) {

        const tarjeta = document.createElement("article");
        tarjeta.classList.add("actividad");

        const titulo = document.createElement("h2");
        textoDestacado(titulo, actividad.nombreActividad, buscador.value.trim());

        const miembro = document.createElement("p");
        miembro.textContent = `Miembro: ${actividad.miembro.nombrePersona}`;

        const dia = document.createElement("p");
        dia.textContent = `Día: ${actividad.dia}`;

        const tipo = document.createElement("p");
        tipo.textContent = `Tipo: ${actividad.tipo}`;

        const comuna = document.createElement("p");
        comuna.appendChild(document.createTextNode("Comuna: "));
        textoDestacado(comuna, actividad.miembro.comuna.nombreComuna, buscador.value.trim());

        const descripcion = document.createElement("p");
        descripcion.appendChild(document.createTextNode("Descripción: "));
        textoDestacado(descripcion, actividad.descripcion, buscador.value.trim());

        const promedio = document.createElement("p");

        try {

            const respuesta = await fetch(
                `/api/notas/promedio?actividadId=${actividad.id}`
            );

            const notaPromedio = await respuesta.json();

            if (notaPromedio === null) {
                promedio.textContent = "Nota promedio: Sin evaluaciones";
            } else {
                promedio.textContent =
                    `Nota promedio: ${Number(notaPromedio).toFixed(1)}`;
            }

        } catch (error) {

            promedio.textContent = "Nota promedio: No disponible";

        }

        const boton = document.createElement("button");
        boton.classList.add("btn-evaluar");
        boton.textContent = "Evaluar";

        boton.addEventListener("click", () => {
            abrirModal(actividad.id);
        });

        tarjeta.appendChild(titulo);
        tarjeta.appendChild(miembro);
        tarjeta.appendChild(dia);
        tarjeta.appendChild(tipo);
        tarjeta.appendChild(comuna);
        tarjeta.appendChild(descripcion);
        tarjeta.appendChild(promedio);
        tarjeta.appendChild(boton);

        resultados.appendChild(tarjeta);
    }
}

function abrirModal(id){
    actividadSeleccionada = id;
    inputNota.value = "";
    modal.classList.remove("oculto");
}

function cerrarModal(){
    modal.classList.add("oculto");
}

async function guardarNota(){

    const nota = Number(inputNota.value);

    if(!Number.isInteger(nota) || nota < 1 || nota > 7){
        alert("Ingrese una nota válida.");
        return;
    }

    await fetch(
        `/api/notas?actividadId=${actividadSeleccionada}&nota=${nota}`,
        {
            method: "POST"
        }
    );

    cerrarModal();
    manejarBusqueda();
}

function textoDestacado(elemento, texto, busqueda) {

    if (busqueda === "") {
        elemento.textContent = texto;
        return;
    }

    const textoMinuscula = texto.toLowerCase();
    const busquedaMinuscula = busqueda.toLowerCase();

    let inicio = 0;
    let indice = textoMinuscula.indexOf(busquedaMinuscula);

    while (indice !== -1) {

        if (indice > inicio) {
            elemento.appendChild(
                document.createTextNode(
                    texto.substring(inicio, indice)
                )
            );
        }

        const marca = document.createElement("mark");
        marca.textContent = texto.substring(
            indice,
            indice + busqueda.length
        );

        elemento.appendChild(marca);
        inicio = indice + busqueda.length;
        indice = textoMinuscula.indexOf(
            busquedaMinuscula,
            inicio
        );
    }

    if (inicio < texto.length) {
        elemento.appendChild(
            document.createTextNode(
                texto.substring(inicio)
            )
        );
    }
}