const condicionesContrasena = (password) => {
    const conditions = [];
    if (password.length < 6) {
        conditions.push("La contraseña debe tener al menos 6 caracteres.\n");
    }
    if (!/[A-Z]/.test(password)) {
        conditions.push("La contraseña debe contener al menos una letra mayúscula.\n");
    }
    if (!/[a-z]/.test(password)) {
        conditions.push("La contraseña debe contener al menos una letra minúscula.\n");
    }
    if (!/\d/.test(password)) {
        conditions.push("La contraseña debe contener al menos un número.\n");
    }
    return conditions;
};

const validarFormulario = () => {
    const validarUsuario = (usuario) => usuario.trim() != "" && /^[a-zA-Z0-9_]{3,20}$/.test(usuario);
    const validarNombre = (nombre) => nombre.trim() != "" && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre);
    const validarEmail = (email) => {
        const re = /^[a-z0-9.]+@[a-z0-9.-]+\.[a-z]{2,}$/;
        return re.test(email);
    };
    const validarTelefono = (telefono) => {
        const re = /^\+?[1-9]\d{1,14}$/;
        return re.test(telefono) || telefono.trim() === "";
    };
    const validarRUT = (rut) => {
        const ciclo = [2, 3, 4, 5, 6, 7];
        let suma = 0;
        const partes = rut.split('-');
        const rutSinDV = partes[0].replace(/\./g, '').split("").reverse().join('');
        for (let i = 0; i < rutSinDV.length; i++) {
            suma += parseInt(rutSinDV[i]) * ciclo[i%6];
        }
        let dv = 11 - (suma % 11);
        if (dv === 11) dv = 0;
        if (dv === 10) dv = 'k';

        const re = /^\d{0,8}-[\dkK]$/;
        return re.test(rut.replaceAll(/\./g, '')) && (dv == partes[1].toLowerCase());
    };
    const validarRol = () => {
        const rol = document.getElementsByName("rol");
        let eleccion = null;

        rol.forEach((radio) => {
            if (radio.checked) {
                return true;
            }
        })

        return false;
    };
    const validarPassword = (password) => [
        password.length >= 6 && 
        /[A-Z]/.test(password) && 
        /[a-z]/.test(password) && 
        /\d/.test(password),
        condicionesContrasena(password)
    ];
    const validarConfirmPassword = (password, confirmPassword) => password === confirmPassword;

    const formulario = document.forms["registro-form"];
    const usuario = formulario["username"].value;
    const nombre = formulario["nombre"].value;
    const email = formulario["email"].value;
    const telefono = formulario["telefono"].value;
    const rut = formulario["rut"].value;
    const password = formulario["password"].value;
    const confirmPassword = formulario["confirm-password"].value;

    const [PasswordValido, passwordErrores] = validarPassword(password);

    const errores = [];

    if (!validarUsuario(usuario)) {
        errores.push("El nombre de usuario no puede estar vacío.\n");
    }
    if (!validarNombre(nombre)) {
        errores.push("El nombre completo no puede estar vacío y solo puede contener letras y espacios.\n");
    }
    if (!validarEmail(email)) {
        errores.push("El correo electrónico no es válido.\n");
    }
    if (!validarTelefono(telefono)) {
        errores.push("El número de teléfono no es válido.\n");
    }
    if (!validarRUT(rut)) {
        errores.push("El RUT no es válido.\n");
    }
    if (PasswordValido === false) {
        errores.push(...passwordErrores);
    }
    if (!validarConfirmPassword(password, confirmPassword)) {
        errores.push("Las contraseñas no coinciden.\n");
    }
    
    if (errores.length > 0) {
        alert(errores);
    } else {
        alert("Te has registrado correctamente!");
        formulario.submit();
    }
};

let submitBtn = document.getElementById("submit-btn");
submitBtn.addEventListener("click", (event) => {
    event.preventDefault();
    validarFormulario();
});

const regionSelect = document.getElementById('region');
const comunaSelect = document.getElementById('comuna');
const todasLasComunas = Array.from(comunaSelect.options);

regionSelect.addEventListener('change', function() {
    const regionId = this.value;
    
    comunaSelect.innerHTML = '<option value="">Seleccione una comuna</option>';
    
    const comunasFiltradas = todasLasComunas.filter(opt => 
        opt.getAttribute('data-region') === regionId || opt.value === ""
    );
    
    comunasFiltradas.forEach(opt => comunaSelect.appendChild(opt));
});