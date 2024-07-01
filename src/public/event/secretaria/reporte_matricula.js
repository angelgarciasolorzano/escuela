$('#btn-generar-reporte').on('click', function () {
    imprimirReporteMatricula();
});//Imprime el reporte con los gráficos


function imprimirReporteMatricula() {
    axios.get('/api/reporte_matricula', {
        //params: { matricula: data_matricula },
        responseType: "blob",
        headers: {
            "Content-Type": "application/pdf"
        }
    }).then((response) => {
        const url = window.URL.createObjectURL(response.data);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'reporte2024.pdf');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    })
        .catch(err => console.log('Error', err.message));
}//Funcion para imprimir la matricula