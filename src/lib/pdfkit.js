import PDFDocument from "pdfkit";
import { ChartJSNodeCanvas } from "chartjs-node-canvas"
import { __dirname } from "../index.js";
import * as path from "path";

// (async () => {

//   const width = 400; //px
//   const height = 400; //px
//   const backgroundColour = 'white'; // Uses https://www.w3schools.com/tags/canvas_fillstyle.asp
//   const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, backgroundColour });

//   const configuration = {
//     type: 'bar',
//     data: {
//       labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
//       datasets: [{
//         label: '# of Votes',
//         data: [12, 19, 3, 5, 2, 3],
//         backgroundColor: [
//           'rgba(255, 99, 132, 0.2)',
//           'rgba(54, 162, 235, 0.2)',
//           'rgba(255, 206, 86, 0.2)',
//           'rgba(75, 192, 192, 0.2)',
//           'rgba(153, 102, 255, 0.2)',
//           'rgba(255, 159, 64, 0.2)'
//         ],
//         borderColor: [
//           'rgba(255,99,132,1)',
//           'rgba(54, 162, 235, 1)',
//           'rgba(255, 206, 86, 1)',
//           'rgba(75, 192, 192, 1)',
//           'rgba(153, 102, 255, 1)',
//           'rgba(255, 159, 64, 1)'
//         ],
//         borderWidth: 1
//       }]
//     },
//     options: {
//     },
//     plugins: [{
//       id: 'background-colour',
//       beforeDraw: (chart) => {
//         const ctx = chart.ctx;
//         ctx.save();
//         ctx.fillStyle = 'white';
//         ctx.fillRect(0, 0, width, height);
//         ctx.restore();
//       }
//     }]
//   };
//   const imageEjemplo = await chartJSNodeCanvas.renderToBuffer(configuration);
//   console.log(imageEjemplo);
// })();

export async function buildPDF(dataCallback, endCallback, datos) {

  const doc = new PDFDocument();
  const imagePath = path.join(__dirname, 'public', 'img', 'logo_colegio.png');
  doc.on("data", dataCallback);
  doc.on("end", endCallback);
  doc.image(imagePath, 60, 65, { fit: [70, 70] });
  doc.fontSize(23).text("Colegio Cristiano Fuente de Vida", 130, 40);
  doc.fontSize(15).text("Fecha: " + datos.fecha, 423, 90)
  doc.fontSize(20).text("Hoja de matricula 2024", 200, 138)
  doc.fontSize(20).text("I. Datos Generales:", 50, 190)
  doc.fontSize(15).text("Estudiante: " + datos.nombres_est + ' ' + datos.apellidos_est + '.', 50, 230);
  doc.fontSize(15).text("Numero Registro: " + datos.registroNac_est + '.', 50, 260);
  doc.fontSize(15).text("Fecha de nacimiento: " + datos.fechaNac_est + '.', 50, 290);
  doc.fontSize(15).text("Sexo: " + datos.sexo_est + '.', 50, 320);
  doc.fontSize(15).text("Modalidad: " + datos.modalidad + '.', 50, 350);
  doc.fontSize(15).text("Nivel/Grado: " + datos.nivel_grado + '.', 220, 350);
  doc.fontSize(15).text("Sección: " + datos.grupo + '.', 435, 350);
  doc.fontSize(20).text("II. Datos Tutor:", 50, 385);
  doc.fontSize(15).text("Tutor:   " + datos.nombres_tutor + ' ' + datos.apellidos_tutor + '.', 50, 425);
  doc.fontSize(15).text("Cedula:  " + datos.cedula_tutor + '.', 50, 455);
  doc.fontSize(15).text("Correo Electrónico: " + datos.correo_e_tutor + '.', 50, 485);
  doc.fontSize(15).text("Sexo: " + datos.sexo_tutor + '.', 50, 515);
  doc.fontSize(15).text("Telefono: " + datos.telefono_tutor + '.', 50, 545);
  doc.fontSize(15).text("Direccion: " + datos.direccion_tutor + '.', 50, 575);
  doc.fontSize(15).text("___________________", 90, 665);
  doc.fontSize(15).text("Firma Tutor", 135, 695);
  doc.fontSize(15).text("___________________", 350, 665);
  doc.fontSize(15).text("Secretaria Académica", 358, 695);

  doc.end();
}

export async function reporteMatricula(dataCallback, endCallback) {
  const doc = new PDFDocument();
  const imagePath = path.join(__dirname, 'public', 'img', 'logo_colegio.png');
  const width = 400; //px
  const height = 400; //px
  const backgroundColour = 'black'; // Uses https://www.w3schools.com/tags/canvas_fillstyle.asp
  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, backgroundColour });
  const configuration = {
    type: 'bar',
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255,99,132,1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: 'Estudiantes Matriculados por año lectivo',
          color: 'black'
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
        }
      }
    }
  };
  const imageEjemplo = await chartJSNodeCanvas.renderToBuffer(configuration);
  const fechaActual = new Date(Date.now()).toLocaleDateString();
  doc.on("data", dataCallback);
  doc.on("end", endCallback);
  doc.image(imagePath, 30, 40, { fit: [70, 70] });
  doc.fontSize(23).text("Colegio Cristiano Fuente de Vida", 130, 40);
  doc.fontSize(10).text(`Fecha: ${fechaActual}`, 465, 100);
  doc.fontSize(15).text("Reporte de estudiantes matriculados", 180, 80)
  doc.image(imageEjemplo, 150, 160, { fit: [260, 260] });

  doc.end();
}