import express from 'express';
import generalRoutes from './routes/generalRoutes.js';
import userRoutes from './routes/userRoutes.js';
import propertyRoutes from './routes/properties.js'
import db from './db/config.js';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';

// Conexión a la base de datos
try {
    await db.authenticate(); // Verifica las credenciales del usuario 
    db.sync();
    console.log('Conexión correcta a la base de datos');
} catch (error) {
    console.log(error);
}

const app = express();

// Definir la carpeta pública de recursos estáticos
app.use(express.static('./public'));

// Habilitar la lectura de datos desde formularios
app.use(express.urlencoded({ extended: true }));

// Habilitar Cookie Parser y CSRF
app.use(cookieParser());
app.use(csrf({ cookie: true }));

// Routing
app.use('/', generalRoutes);
app.use('/auth', userRoutes);
app.use('/properties', propertyRoutes); // Ruta de propiedades
// Habilitar Pug
app.set('view engine', 'pug');
app.set('views', './views');

// Configuración del servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`La aplicación ha iniciado en el puerto: ${port}`);
});