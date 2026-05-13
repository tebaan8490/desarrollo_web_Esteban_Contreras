const validarInicio = () => {
    user = document.getElementById('nombre_usuario')
    pass = document.getElementById('contrasena')

    const validarUsuario = (usuario) => usuario.trim() != "" && /^[a-zA-Z0-9_]{3,20}$/.test(usuario);
    const validarPassword = (pass) => pass.trim() != "" && pass.trim().length >= 6;

    if (validarUsuario(user) && validarPassword(pass)) {
        document.forms["login-form"].submit();
    } else {
        alert("El usuario ingresado o la contrasseña ingresada pueden estar equivocadas.")
    }
}