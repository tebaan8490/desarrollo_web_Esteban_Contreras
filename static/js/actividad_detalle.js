let agregarCardBtn = document.getElementById("agregar-comentario-btn");
agregarCardBtn.addEventListener("click", (event) => {
    event.preventDefault();
    const formulario = document.getElementById("form-comentario");
    if (formulario.classList.contains("visible")) {
        formulario.classList.remove("visible");
        formulario.classList.add("oculto");
    } else {
        formulario.classList.remove("oculto");
        formulario.classList.add("visible");
    }
});

const actividadID = document.getElementById("actividad-detalle").dataset.actividadId;
const comentariosContainer = document.getElementById("comentarios-actividad");  

// Validación del formulario de comentario

const validarComentario = async () => {
    const validarTexto = (texto) => {
        return texto.length >= 5;
    }
    const validarComentador = (comentador) => {
        return comentador.length >= 3 && comentador.length <= 80;
    }
    const textoComentario = document.querySelector("textarea[name='texto-comentario']").value.trim();
    const comentador = document.querySelector("input[name='comentador']").value.trim();
    const errores = [];

    if (!validarTexto(textoComentario)) {
        errores.push("El comentario debe tener al menos 5 caracteres.");
    }
    if (!validarComentador(comentador)) {
        errores.push("El nombre del comentador debe tener entre 3 y 80 caracteres.");
    }

    const errorBox = document.getElementById("error-box");
    if (errores.length > 0) {
        const errorMsg = document.getElementById("error-msg");
        const errorList = document.getElementById("error-list");
        errorMsg.innerText = "Por favor corrige los siguientes errores:";
        errorList.innerHTML = "";
        errores.forEach(error => {
            let li = document.createElement("li");
            li.innerText = error;
            errorList.appendChild(li);
        });
        errorBox.hidden = false;
    } else {
        errorBox.hidden = true;
        const textoComentario = document.querySelector("textarea[name='texto-comentario']").value.trim();

        const comentador = document.querySelector("input[name='comentador']").value.trim();

        const response = await fetch(
            `/comentarios/${actividadID}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    comentador,
                    "texto-comentario": textoComentario
                })
            }
        );
        if (!response.ok) {
            console.error("Error al enviar comentario:", response.statusText);
            return;
        }

        const data = await response.json();

        if (data.success) {
            cargarComentarios();
            document.querySelector("textarea[name='texto-comentario']").value = "";
            document.querySelector("input[name='comentador']").value = "";
        }
    }
}

let submitActividadBtn = document.getElementById("enviar-comentario-btn");
submitActividadBtn.addEventListener("click", (event) => {
    event.preventDefault();
    validarComentario();
});

const cargarComentarios = async () => {
    try {
        const response = await fetch(`/comentarios/${actividadID}`);
        if (!response.ok) {
            throw new Error("Error al cargar comentarios");
        }
        const data = await response.json();
        comentariosContainer.innerHTML = "";
        data.comentarios.forEach(comentario => {
            const comentarioCard = document.createElement("article");
            comentarioCard.classList.add("comentario-card");
            comentarioLink = document.createElement("a");
            comentarioLink.href = `/perfil_usuario/${comentario.miembro_id}`;
            comentarioLink.innerText = comentario.nombre;
            comentarioCard.appendChild(comentarioLink);
            comentarioCard.appendChild(document.createTextNode(` publicó en ${comentario.fecha_comentario}: ${comentario.texto}`));
            comentariosContainer.appendChild(comentarioCard);
        })
    } catch (error) {
        console.error("Error al cargar comentarios:", error);
    }
}

window.addEventListener("load", cargarComentarios);