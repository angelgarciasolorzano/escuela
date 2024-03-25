//TODO Importaciones modulos
import express from "express";
import morgan from "morgan";
import { engine } from "express-handlebars";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

//*Importaciones de Caminos (Routes)
import indexRoutes from "./routes/index.routes.js";

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

//TODO Configurando puerto del servidor
app.set('port', process.env.PORT || 4000);

//TODO Configurando motor de plantilla hbs (handlebars)
app.set('views', join(__dirname, 'views'));
app.engine('.hbs', engine({
  defaultLayout: 'main',
  layoutsDir: join(app.set('views'), 'layouts'),
  partialsDir: join(app.set('views'), 'partials'),
  extname: '.hbs'
}));
app.set('view engine', '.hbs');

//TODO Otras configuraciones
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//*Configurando caminos
app.use(indexRoutes);

//TODO Carpetas publicas
app.use(express.static(join(__dirname, 'public')));

//*Ejecutando servidor
app.listen(app.get('port'), () => {
  console.log(`Servidor corriendo en el puerto ${app.get('port')}`);
});