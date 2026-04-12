const crearCardActividad = (titulo, descripcion, lugar, dia, hora, imagen) => {
    const card = document.createElement("article");
    card.className = "card visible";

    const img = document.createElement("img");
    img.src = imagen;
    img.alt = titulo;

    const cardTitle = document.createElement("h3");
    cardTitle.className = "card-titulo";
    const categoria = document.createElement("div");
    categoria.className = "categoria";
    categoria.innerText = "Categoría: " + document.getElementById("categoria").value;
    cardTitle.appendChild(categoria);
    cardTitle.appendChild(document.createTextNode(titulo));

    const cardDesc = document.createElement("p");
    cardDesc.className = "card-descripcion";
    cardDesc.innerText = descripcion;

    const cardInfo = document.createElement("p");
    cardInfo.className = "card-info";
    cardInfo.innerHTML = `<strong>Día:</strong> ${dia}<br><strong>Hora:</strong> ${hora}<br><strong>Lugar:</strong> ${lugar}>`;

    card.appendChild(img);
    card.appendChild(cardTitle);
    card.appendChild(cardDesc);
    card.appendChild(cardInfo);

    const actividadesContainer = document.getElementById("actividades-container");
    card.addEventListener("click", () => {
        card.classList.toggle("activa");
    });
    actividadesContainer.appendChild(card);
};

const validarFormularioActividad = () => {
    const errores = [];
    const validarTitulo = (titulo) => titulo.trim() === "";
    const validarDescripcion = (descripcion) => descripcion.trim() === "";
    const validarLugar = (lugar) => lugar.trim() === "";
    const validarDia = () => {
        const dias = document.querySelectorAll('input[name="dia"]:checked');
        return dias.length > 0;
    };
    const validarHora = (hora) => {
        const re = /^([01]\d|2[0-3]):([0-5]\d)-([01]\d|2[0-3]):([0-5]\d)$/;
        return re.test(hora);
    };
    const validarImagen = (imagen) => {
        const re = /\.(jpg|jpeg|png|gif)$/i;
        return re.test(imagen);
    };

    const formulario = document.forms["añadir-card-form"];
    const titulo = formulario["titulo-actividad"].value;
    const descripcion = formulario["descripcion"].value;
    const lugar = formulario["lugar"].value;
    const dia = formulario["dia"].value;
    const hora = formulario["hora"].value;
    const imagen = formulario["imagen"].value;

    const dias = Array.from(dia).map(d => d.value).join(", ");
    if (validarTitulo(titulo)) {
        errores.push("El título no puede estar vacío.");
    }
    if (validarDescripcion(descripcion)) {
        errores.push("La descripción no puede estar vacía.");
    }
    if (validarLugar(lugar)) {
        errores.push("El lugar no puede estar vacío.");
    }
    if (validarDia()) {
        errores.push("Debes seleccionar al menos un día.");
    }
    if (!validarHora(hora)) {
        errores.push("La hora debe estar en formato HH:MM (24 horas).");
    }
    if (!validarImagen(imagen)) {
        errores.push("La imagen debe ser un archivo con extensión .jpg, .jpeg, .png o .gif.");
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
    }
    crearCardActividad(titulo, descripcion, lugar, dias, hora, imagen);
    formulario.reset();
};

let submitActividadBtn = document.getElementById("submit-actividad-btn");
submitActividadBtn.addEventListener("click", (event) => {
    event.preventDefault();
    validarFormularioActividad();
});

let filtroSelect = document.getElementById("filtro-categoria");
filtroSelect.addEventListener("change", () => {
    const categoriaSeleccionada = filtroSelect.value;
    const cards = document.querySelectorAll(".card");
    cards.forEach(card => {
        if (categoriaSeleccionada === "todas" || card.dataset.categoria === categoriaSeleccionada) {
            card.classList.add("visible");
            card.classList.remove("oculto");
        } else {
            card.classList.remove("visible");
            card.classList.add("oculto");
        }
    });
});

let agregarCardBtn = document.getElementById("añadir-actividad-btn");
agregarCardBtn.addEventListener("click", (event) => {
    event.preventDefault();
    const formulario = document.getElementById("añadir-card-form");
    if (formulario.classList.contains("visible")) {
        formulario.classList.remove("visible");
        formulario.classList.add("oculto");
    } else {
        formulario.classList.remove("oculto");
        formulario.classList.add("visible");
    }
});

document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", () => {
        card.classList.toggle("activa");
    });
});