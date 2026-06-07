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

// Validación del formulario de comentario

const validarComentario = () => {
    const validarTexto = (texto) => {
        return texto.length >= 5;
    }
    const validarComentador = (comentador) => {
        return comentador.length >= 3 && comentador.length <= 50;
    }
    const textoComentario = document.querySelector("textarea[name='texto-comentario']").value.trim();
    const comentador = document.querySelector("input[name='comentador']").value.trim();
    const errores = [];

    if (!validarTexto(textoComentario)) {
        errores.push("El comentario debe tener al menos 5 caracteres.");
    }
    if (!validarComentador(comentador)) {
        errores.push("El nombre del comentador debe tener entre 3 y 50 caracteres.");
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
        document.getElementById("form-comentario").submit();
    }
}

let submitActividadBtn = document.getElementById("enviar-comentario-btn");
submitActividadBtn.addEventListener("click", (event) => {
    event.preventDefault();
    validarComentario();
});
