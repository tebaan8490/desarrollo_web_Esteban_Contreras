const paginacion = document.getElementById('paginacion');
const paginaActual = parseInt(paginacion.dataset.actual);
const totalPaginas = parseInt(paginacion.dataset.total);

    function actualizarFiltro(parametro, valor) {
        let params = new URLSearchParams(window.location.search);
        
        params.set(parametro, valor);
        
        if (parametro !== 'page') {
            params.set('page', 1); 
        }

        window.location.href = window.location.pathname + '?' + params.toString();
    }

document.addEventListener('DOMContentLoaded', () => {
    const filtroRol = document.getElementById('filtro-rol');
    const filtroOrden = document.getElementById('filtro-orden');

    if (filtroRol) {
        filtroRol.addEventListener('change', (e) => {
            actualizarFiltro('rol', e.target.value);
        });
    }

    if (filtroOrden) {
        filtroOrden.addEventListener('change', (e) => {
            actualizarFiltro('orden', e.target.value);
        });
    }
});

document.getElementById('anterior-pag').addEventListener('click', () => {
    if (paginaActual > 1) {
        actualizarFiltro('page', paginaActual - 1);
    }
})

document.getElementById('proxima-pag').addEventListener('click', () => {
    if (paginaActual -1 < totalPaginas) {
        actualizarFiltro('page', paginaActual + 1);
    }
})