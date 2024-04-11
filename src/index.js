//TODO Importaciones modulos
import express from "express";
import morgan from "morgan";
import { engine } from "express-handlebars";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import MySQLStoreFactory from "express-mysql-session";
import passport from "passport";
import { database } from "./keys.js";
import helpers from "./lib/helpers.js";
import * as path from "path"

//*Importaciones de Caminos (Routes)
import indexRoutes from "./routes/index.routes.js";
import authenticationRoutes from "./routes/authentication.routes.js";
import secretariaRoutes from "./routes/client/secretaria.routes.js";
import "./lib/passport.js";

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
const MySQLStore = MySQLStoreFactory(session);

//TODO Configurando puerto del servidor
app.set('port', process.env.PORT || 4000);

//TODO Configurando motor de plantilla hbs (handlebars)
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', engine({
  defaultLayout: 'main',
  layoutsDir: join(app.set('views'), 'layouts'),
  partialsDir: join(app.set('views'), 'partials'),
  extname: '.hbs',
  helpers: helpers
}));
app.set('view engine', '.hbs');

//*Configurando sesiones del usuario
app.use(session({
  secret: 'secret',
  saveUninitialized: false,
  resave: false,
  store: new MySQLStore(database)
}));

//TODO Otras configuraciones
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

//*Variables Globales
app.use((req, res, next) => {
  if (req.user && Array.isArray(req.user) && req.user.length > 0) {
    app.locals.user = req.user[0];
  } else {
    app.locals.user = null;
  }
  next();
});

//*Configurando caminos
app.use(indexRoutes);
app.use(authenticationRoutes);
app.use(secretariaRoutes);

//TODO Carpetas publicas
app.use(express.static(path.join(__dirname, 'public')));

//*Ejecutando servidor
app.listen(app.get('port'), () => {
  console.log(`Servidor corriendo en el puerto ${app.get('port')}`);
});