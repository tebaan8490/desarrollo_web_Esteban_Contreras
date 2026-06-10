const cargarGraficoMiembros = async () => {
    const response = await fetch("/estadisticas/grafico_miembros");
    const data = await response.json();

    Highcharts.chart("grafico-miembros", {
        chart: {
            type: "line"
        },
        title: {
            text: "Miembros registrados por día"
        },
        xAxis: {
            categories: data.valores
        },
        series: [{
            name: "Miembros",
            data: data.data
        }]
    });
};

const cargarGraficoTipos = async () => {
    const response = await fetch("/estadisticas/grafico_actividades");
    const data = await response.json();

    const datosPie = data.valores.map((tipo, i) => ({
        name: tipo,
        y: data.data[i]
    }));

    Highcharts.chart("grafico-tipos", {
        chart: {
            type: "pie"
        },
        title: {
            text: "Actividades por tipo"
        },
        series: [{
            data: datosPie
        }]
    });
};

const cargarGraficoComunas = async () => {
    const response = await fetch("/actividades/grafico_actividades_comuna");
    const data = await response.json();

    Highcharts.chart("grafico-comuna", {
        chart: {
            type: "column"
        },
        title: {
            text: "Actividades por comuna"
        },
        xAxis: {
            categories: data.valores
        },
        series: [{
            name: "Actividades",
            data: data.data
        }]
    });
};

window.addEventListener("load", async () => {
    await cargarGraficoMiembros();
    await cargarGraficoTipos();
    await cargarGraficoComunas();
});