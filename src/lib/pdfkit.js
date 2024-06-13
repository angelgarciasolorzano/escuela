import PDFDocument from "pdfkit";

export function buildPDF(dataCallback, endCallback, datos) {
  const doc = new PDFDocument();
  console.log(datos.nombres_est);
  doc.on("data", dataCallback);
  doc.on("end", endCallback);

//   doc.image('public/img/logo_colegio.png', {
//     fit: [250, 300],
//     align: 'center',
//     valign: 'center'
//   });
  doc.fontSize(23).text("Colegio Cristiano Fuente de Vida", 130, 40);
  doc.fontSize(15).text("Fecha: " + datos.fecha, 423, 90)
  doc.fontSize(20).text("Hoja de matricula 2024", 200, 138)
  doc.fontSize(20).text("I. Datos Generales:", 50, 190)
  doc.fontSize(15).text("Estudiante: " + datos.nombres_est +' '+ datos.apellidos_est+'.', 50, 230);
  doc.fontSize(15).text("Numero Registro: " + datos.registroNac_est+'.', 50, 260);
  doc.fontSize(15).text("Fecha de nacimiento: " + datos.fechaNac_est+'.', 50, 290);
  doc.fontSize(15).text("Sexo: " + datos.sexo_est+'.', 50, 320);
  doc.fontSize(15).text("Modalidad: " + datos.modalidad+'.', 50, 350);
  doc.fontSize(15).text("Nivel/Grado: " + datos.nivel_grado+'.', 220, 350);
  doc.fontSize(15).text("Sección: " + datos.grupo+'.', 435, 350);
  doc.fontSize(20).text("II. Datos Tutor:", 50, 385);
  doc.fontSize(15).text("Tutor:   " + datos.nombres_tutor +' '+ datos.apellidos_tutor+'.', 50, 425);
  doc.fontSize(15).text("Cedula:  " + datos.cedula_tutor +'.', 50, 455);
  doc.fontSize(15).text("Correo Electrónico: " + datos.correo_e_tutor +'.', 50, 485);
  doc.fontSize(15).text("Sexo: " + datos.sexo_tutor +'.', 50, 515);
  doc.fontSize(15).text("Telefono: " + datos.telefono_tutor +'.', 50, 545);
  doc.fontSize(15).text("Direccion: " + datos.direccion_tutor +'.', 50, 575);
  doc.fontSize(15).text("___________________", 90, 665);
  doc.fontSize(15).text("Firma Tutor", 135, 695);
  doc.fontSize(15).text("___________________", 350, 665);
  doc.fontSize(15).text("Secretaria Académica", 358, 695);

  doc.end();
}