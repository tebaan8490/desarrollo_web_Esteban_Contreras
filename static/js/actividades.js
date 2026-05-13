const crearCardActividad = (titulo, descripcion, lugar, dia, hora, imagen) => {
    const card = document.createElement("article");
    card.className = "card visible";

    const img = document.createElement("img");
    const url = URL.createObjectURL(imagen)
    img.src = url;
    img.alt = titulo;

    const categoriaElegida = document.getElementById("categoria")
    card.dataset.categoria = categoriaElegida.value;

    const categoria = document.createElement("h3");
    categoria.innerHTML = `
        Categoría: ${categoriaElegida.options[categoriaElegida.selectedIndex].text}<br>
        ${titulo}
    `;

    const cardTitle = document.createElement("h3");
    cardTitle.className = "card-titulo";
    cardTitle.innerText = titulo

    cardTitle.appendChild(categoria);
    cardTitle.appendChild(document.createTextNode(titulo));

    const cardDesc = document.createElement("p");
    cardDesc.className = "card-descripcion";
    cardDesc.innerText = descripcion;

    const cardInfo = document.createElement("p");
    cardInfo.className = "card-info";
    cardInfo.innerHTML = `<strong>Día: ${dia}</strong><br><strong>Hora: ${hora}</strong><br><strong>Lugar: ${lugar}</strong>`;

    const cardExtra = document.createElement("p");
    cardExtra.className = "card-extra";
    cardExtra.innerHTML = `
        Publicado por usuario<br>
        Teléfono: Sin teléfono<br>
        Correo: usuario@ejemplo.com
    `;

    card.appendChild(img);
    card.appendChild(categoria);
    card.appendChild(cardTitle);
    card.appendChild(cardDesc);
    card.appendChild(cardInfo);
    card.appendChild(cardExtra);

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
    const validarDia = (dias) => {
        return dias.length === 0;
    };
    const validarHora = (hora) => {
        const re = /^([01]\d|2[0-3]):([0-5]\d)$/;
        return re.test(hora);
    };
    const validarDuracion = (duracion) => {
        return !isNaN(Number(duracion)) && duracion.trim() !== "";
    }
    const validarImagen = (imagen) => {
        const re = /\.(jpg|jpeg|png|gif)$/i;
        return re.test(imagen);
    };

    const formulario = document.forms["añadir-card-form"];
    const titulo = formulario["titulo-actividad"].value;
    const descripcion = formulario["descripcion"].value;
    const lugar = formulario["lugar"].value;
    const checkbox = formulario.querySelectorAll("input[name='dia']:checked");
    const hora = formulario["hora"].value;
    const duracion = formulario["duracion"].value;
    const imagen = formulario["imagen"].value;
    const imagenArchivo = formulario["imagen"].files[0];

    const checkboxes = Array.from(checkbox).map(d => d.value)
    const dias = checkboxes.join(", ");
    if (validarTitulo(titulo)) {
        errores.push("El título no puede estar vacío.");
    }
    if (validarDescripcion(descripcion)) {
        errores.push("La descripción no puede estar vacía.");
    }
    if (validarLugar(lugar)) {
        errores.push("El lugar no puede estar vacío.");
    }
    if (validarDia(checkboxes)) {
        errores.push("Debes seleccionar al menos un día.");
    }
    if (!validarHora(hora)) {
        errores.push("La hora debe estar en formato HH:MM (24 horas).");
    }
    if (!validarDuracion(duracion)) {
        errores.push("La duración debe de ser un número, la cantidad de horas de la actividad");
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
        formulario.submit();
    }
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