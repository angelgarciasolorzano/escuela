import PDFDocument from "pdfkit-table";
import { ChartJSNodeCanvas } from "chartjs-node-canvas"
import { __dirname } from "../index.js";
import * as path from "path";

async function hojaMatricula(dataCallback, endCallback, datos, materias_prof) {

  const doc = new PDFDocument({ bufferPages: true });
  const imagePath = path.join(__dirname, 'public', 'img', 'logo_colegio.png');
  const añoActual = new Date(Date.now());
  const fechaActual = new Date(Date.now()).toLocaleDateString();
  var genero = '';
  let i;
  let end;
  const porfeMateria = materias_prof[0][0][1];
  const asignados = porfeMateria.map(item => [item.Materias, item.Profesores]);
  var profesor_guia = '';
  if(materias_prof[0][0][0][0] != undefined) {
    profesor_guia =  materias_prof[0][0][0][0].profesor_guia;
  }
  if (datos.sexo_est === 'M') {
    genero = 'Masculino';
  } else {
    genero = 'Femenino';
  }
  // table 
  const tableProfeMateria = {
    headers: ["Materias", "Profesores"], 
    rows: asignados
  };
  doc.on("data", dataCallback);
  doc.on("end", endCallback);
  doc.image(imagePath, 60, 65, { fit: [70, 70] });
  doc.fontSize(23).text("Colegio Cristiano Fuente de Vida", 130, 40);
  doc.fontSize(15).text("Fecha: " + fechaActual, 423, 90)
  doc.fontSize(20).text("Hoja de matrícula 2024", 200, 138)
  doc.fontSize(20).text("I. Datos generales:", 50, 190)
  doc.fontSize(15).text("Estudiante: " + datos.nombres_est + ' ' + datos.apellidos_est + '.', 50, 230);
  doc.fontSize(15).text("Código estudiantil: " + datos.codigo_est + '.', 50, 260);
  doc.fontSize(15).text("Fecha de nacimiento: " + datos.fechaNac_est + '.', 50, 290);
  doc.fontSize(15).text("Sexo: " + genero + '.', 50, 320);
  doc.fontSize(15).text("Dirección domiciliar: " + datos.direccion_est + '.', 50, 350);
  doc.fontSize(15).text("Modalidad: " + datos.modalidad + '.', 50, 380);
  doc.fontSize(15).text("Nivel/Grado: " + datos.nivel_grado + '.', 220, 380);
  doc.fontSize(15).text("Sección: " + datos.grupo + '.', 435, 380);
  doc.fontSize(20).text("II. Datos del tutor y padres de familia:", 50, 415);
  doc.fontSize(15).text("Nombre del tutor:  " + datos.nombres_tutor + '.', 50, 450);
  doc.fontSize(15).text("Cédula del tutor:  " + datos.cedula_tutor + '.', 50, 480);
  doc.fontSize(15).text("Teléfono del Tutor:  " + datos.telefono_tutor + '.', 50, 510);
  doc.fontSize(15).text("Nombre de la madre: " + datos.nombres_madre + '.', 50, 540);
  doc.fontSize(15).text("Cédula de la madre:  " + datos.cedula_madre + '.', 50, 570);
  doc.fontSize(15).text("Nombre de la padre: " + datos.nombres_padre + '.', 50, 600);
  doc.fontSize(15).text("Cédula del padre:  "  + datos.cedula_padre + '.', 50, 630);
  doc.fontSize(15).text("___________________________________", 170, 680);
  doc.fontSize(15).text("Sello y fírma del director(a)", 215, 700);
  doc.addPage();
  doc.image(imagePath, 60, 65, { fit: [70, 70] });
  doc.fontSize(23).text("Colegio Cristiano Fuente de Vida", 130, 40);
  doc.fontSize(15).text("Fecha: " + datos.fecha, 423, 90)
  doc.fontSize(20).text(`Año lectivo ${añoActual.getFullYear()}`, 225, 138);
  doc.fontSize(15).text("Modalidad: " + datos.modalidad + '.', 50, 200);
  doc.fontSize(15).text("Nivel/Grado: " + datos.nivel_grado + '.', 220, 200);
  doc.fontSize(15).text("Sección: " + datos.grupo + '.', 435, 200);
  doc.fontSize(15).text("Profesor guía: " + profesor_guia + '.', 50, 240);
  doc.fontSize(20).text("Materias y profesores asignados", 150, 300);
  await doc.table(tableProfeMateria, { width: 450, x: 75, y: 350,
    prepareHeader: () => doc.font("Helvetica-Bold").fontSize(13),
        prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
          doc.font("Helvetica").fontSize(11);
        }
  });
  // see the range of buffered pages
  const range = doc.bufferedPageRange(); // => { start: 0, count: 2 }
  for (i = range.start, end = range.start + range.count, range.start <= end; i < end; i++) {
    doc.switchToPage(i);
    doc.fontSize(12).text(`${i + 1} de ${range.count}`, 12, 
      doc.page.height - 40, 
      { height : 25, width : 100
    });
  }
  // manually flush pages that have been buffered
  doc.flushPages();
  doc.end();
}//Imprime la hoja de matricula reciente

async function reporteMatricula(dataCallback, endCallback, [datosGeneral, atributos]) {
  const datos = datosGeneral[0][0];
  const datosSexo = datos.map(item =>[item.Años, item.Masculino, item.Femenino, item.Total]);
  const datosModalidad = datos.map(item =>[item.Años, item.Preescolar, item.Primaria, item.Secundaria]);
  const tablaSexo = {
    headers: ["Años", "Masculino", "Femenino", "Total"], 
    rows: datosSexo
  };
  const tablaModalidad = {
    headers: ["Años", "Preescolar", "Primaria", "Secundaria"], 
    rows: datosModalidad
  };
  const doc = new PDFDocument({ bufferPages: true });
  const imagePath = path.join(__dirname, 'public', 'img', 'logo_colegio.png');
  const width = 550; //px
  const height = 280; //px
  const anios = datosGeneral[0][0].map(item => item.Años);
  const matriculas_anio = datosGeneral[0][0].map(item => item.Total);
  const sexo_masculino = datosGeneral[0][0].map(item => item.Masculino);
  const sexo_femenino = datosGeneral[0][0].map(item => item.Femenino);
  const matricula_preescolar = datosGeneral[0][0].map(item => item.Preescolar);
  const matricula_primaria = datosGeneral[0][0].map(item => item.Primaria);
  const matricula_secundaria = datosGeneral[0][0].map(item => item.Secundaria);
  const backgroundColour = '#F7F7F7';
  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, backgroundColour });
  const chartJSNodeCanvas2 = new ChartJSNodeCanvas({ width, height, backgroundColour });
  const chartJSNodeCanvas3 = new ChartJSNodeCanvas({ width, height, backgroundColour });
  const configuration = {
    type: 'bar',
    data: {
      labels: anios,
      datasets: [{
        label: 'Número de matriculas',
        data: matriculas_anio,
        backgroundColor: 'MediumOrchid',
      }]
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: 'Gráfica de matrículas por año.',
          color: 'black',
          font: {
            size: 18
          }
        },
        labels: {
          // This more specific font property overrides the global property
          font: {
            size: 14
          },
          color: 'black'
        },
        legend: {
          labels: {
            font: {
              size: 17
            },
            color: 'black' // Color de las etiquetas de la leyenda
          },
        }
      },
      scales: {
        xAxes: {
          ticks: {
            maxRotation: 90,
            minRotation: 55,
            font: {
              size: 15
            },
            color: 'black'
          },
        },
        yAxes: {
          beginAtZero: true,
          ticks: {
            font: {
              size: 15
            },
            color: 'black' // Color de las etiquetas del eje y
          }
        }
      }
    }
  };
  const configuration2 = {
    type: 'bar',
    data: {
      labels: anios,
      datasets: [{
        label: 'Masculino',
        data: sexo_masculino,
        backgroundColor: 'SkyBlue',
        stack: 'Stack 0',
      },
      {
        label: 'Femenino',
        data: sexo_femenino,
        backgroundColor: 'LightPink',
        stack: 'Stack 1',
      }]
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: 'Gráfica matrículas por género',
          color: 'black',
          font: {
            size: 18
          }
        },
        labels: {
          // This more specific font property overrides the global property
          font: {
            size: 14
          },
          color: 'black'
        },
        legend: {
          labels: {
            font: {
              size: 17
            },
            color: 'black' // Color de las etiquetas de la leyenda
          },
        }
      },
      scales: {
        xAxes: {
          ticks: {
            maxRotation: 90,
            minRotation: 55,
            font: {
              size: 15
            },
            color: 'black'
          },
        },
        yAxes: {
          beginAtZero: true,
          ticks: {
            font: {
              size: 15
            },
            color: 'black' // Color de las etiquetas del eje y
          }
        }
      }
    }
  };
  const configuration3 = {
    type: 'bar',
    data: {
      labels: anios,
      datasets: [{
        label: 'Preescolar',
        data: matricula_preescolar,
        backgroundColor: 'LightBlue',
        stack: 'Stack 0',
      },
      {
        label: 'Primaria',
        data: matricula_primaria,
        backgroundColor: 'LightGreen',
        stack: 'Stack 0',
      },
      {
        label: 'Secundaria',
        data: matricula_secundaria,
        backgroundColor: 'LightSalmon',
        stack: 'Stack 0',
      }]
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: 'Gráfica de matrículas por modalidad',
          color: 'black',
          font: {
            size: 18
          }
        },
        labels: {
          // This more specific font property overrides the global property
          font: {
            size: 14
          },
          color: 'black'
        },
        legend: {
          labels: {
            font: {
              size: 17
            },
            color: 'black' // Color de las etiquetas de la leyenda
          },
        }
      },
      scales: {
        xAxes: {
          ticks: {
            maxRotation: 90,
            minRotation: 55,
            font: {
              size: 15
            },
            color: 'black'
          },
        },
        yAxes: {
          beginAtZero: true,
          ticks: {
            font: {
              size: 15
            },
            color: 'black' // Color de las etiquetas del eje y
          }
        }
      }
    }
  };
  const imageEjemplo = await chartJSNodeCanvas.renderToBuffer(configuration);
  const imageEjemplo2 = await chartJSNodeCanvas2.renderToBuffer(configuration2);
  const imageEjemplo3 = await chartJSNodeCanvas3.renderToBuffer(configuration3);
  const fechaActual = new Date(Date.now()).toLocaleDateString();
  let i;
  let end;

  doc.on("data", dataCallback);
  doc.on("end", endCallback);
  doc.image(imagePath, 45, 45, { fit: [70, 70] });
  doc.fontSize(23).text("Colegio Cristiano Fuente de Vida", 130, 40);
  doc.fontSize(15).text("Fecha: " + fechaActual, 423, 80)
  doc.fontSize(18).text(`Reporte general de estudiantes matriculados`, 130, 122);
  doc.image(imageEjemplo, 130, 160, { width: 350 });
  if(atributos === 'sexo'){
    doc.image(imageEjemplo2, 130, 360, { width: 350 });
    doc.fontSize(18).text(`Tabla de estudiantes matriculados por género`, 120, 570);
  await doc.table(tablaSexo, { width: 450, x: 75, y: 610,
    prepareHeader: () => doc.font("Helvetica-Bold").fontSize(13),
        prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
          doc.font("Helvetica").fontSize(11);
        }
  });
  }
  if(atributos === 'modalidad'){
    doc.image(imageEjemplo3, 130, 360, { width: 350 });
    doc.fontSize(18).text(`Tabla de estudiantes matriculados por modalidad`, 120, 570);
  await doc.table(tablaModalidad, { width: 450, x: 75, y: 610,
    prepareHeader: () => doc.font("Helvetica-Bold").fontSize(13),
        prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
          doc.font("Helvetica").fontSize(11);
        }
  });
  }


  // see the range of buffered pages
  const range = doc.bufferedPageRange(); // => { start: 0, count: 2 }
  for (i = range.start, end = range.start + range.count, range.start <= end; i < end; i++) {
    doc.switchToPage(i);
    doc.fontSize(12).text(`${i + 1} de ${range.count}`, 12, 
      doc.page.height - 40, 
      { height : 25, width : 100
    });
  }
  // manually flush pages that have been buffered
  doc.flushPages();

  doc.end();
}//Imprime un reporte que muestra las matriculas realizadas en un anio determinado

export { hojaMatricula, reporteMatricula }