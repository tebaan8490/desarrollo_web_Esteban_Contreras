const mostrarErrores = (errores) => {
    const valBox = document.getElementById('val-box');
    const valMsg = document.getElementById('val-msg');
    const valList = document.getElementById('val-list');
    valMsg.innerText = "Errores de Validación:";
    valList.innerHTML = "";
    errores.forEach(error => {
        let li = document.createElement('li');
        li.innerText = error;
        valList.append(li);
    });
    valBox.hidden = false;
};

const ocultarErrores = () => {
    const valBox = document.getElementById('val-box');
    valBox.hidden = true;
};

const passwordConditions = (password) => {
    const conditions = [];
    if (password.length < 6) {
        conditions.push("La contraseña debe tener al menos 6 caracteres.");
    }
    if (!/[A-Z]/.test(password)) {
        conditions.push("La contraseña debe contener al menos una letra mayúscula.");
    }
    if (!/[a-z]/.test(password)) {
        conditions.push("La contraseña debe contener al menos una letra minúscula.");
    }
    if (!/\d/.test(password)) {
        conditions.push("La contraseña debe contener al menos un número.");
    }
    return conditions;
};

const validarFormulario = () => {
    const validarUsuario = (usuario) => usuario.trim() != "";
    const validarNombre = (nombre) => nombre.trim() != "" && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre);
    const validarEmail = (email) => {
        const re = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
        return re.test(email);
    };
    const validarTelefono = (telefono) => {
        const re = /^\+?[1-9]\d{1,14}$/;
        return re.test(telefono);
    };
    const validarRUT = (rut) => {
        const re = /^\d{0,8}-[\dkK]$/;
        return re.test(rut.replaceAll(/\./g, ''));
    };
    const validarPassword = (password) => [
        password.length >= 6 && 
        /[A-Z]/.test(password) && 
        /[a-z]/.test(password) && 
        /\d/.test(password),
        passwordConditions(password)
    ];
    const validarConfirmPassword = (password, confirmPassword) => password === confirmPassword;

    const formulario = document.forms["registro-form"];
    const usuario = formulario["username"].value;
    const nombre = formulario["nombre"].value;
    const email = formulario["email"].value;
    const telefono = formulario["telefono"].value;
    const rut = formulario["rut"].value;
    const rol = formulario["rol"].value;
    const password = formulario["password"].value;
    const confirmPassword = formulario["confirm-password"].value;

    const [PasswordValido, passwordErrores] = validarPassword(password);

    const errores = [];

    if (!validarUsuario(usuario)) {
        errores.push("El nombre de usuario no puede estar vacío.");
    }
    if (!validarNombre(nombre)) {
        errores.push("El nombre completo no puede estar vacío y solo puede contener letras y espacios.");
    }
    if (!validarEmail(email)) {
        errores.push("El correo electrónico no es válido.");
    }
    if (!validarTelefono(telefono)) {
        errores.push("El número de teléfono no es válido.");
    }
    if (!validarRUT(rut)) {
        errores.push("El RUT no es válido.");
    }
    if (PasswordValido === false) {
        errores.push(...passwordErrores);
    }
    if (!validarConfirmPassword(password, confirmPassword)) {
        errores.push("Las contraseñas no coinciden.");
    }
    
    if (errores.length > 0) {
        mostrarErrores(errores);
    } else {
        ocultarErrores();
        formulario.reset();
        window.location.href = "index.html";
    }
};

let submitBtn = document.getElementById("submit-btn");
submitBtn.addEventListener("click", (event) => {
    event.preventDefault();
    validarFormulario();
});