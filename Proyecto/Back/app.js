const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const bcrypt = require ('bcrypt');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors()); // Habilita CORS para todas las rutas

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
})
  .then(() => console.log('Conectado a MongoDB'))
  .catch((error) => console.error('Error al conectar a MongoDB:', error));

// Manejo de errores de conexión después de la conexión inicial
mongoose.connection.on('error', (error) => {
  console.error('Error de conexión a MongoDB:', error);
});

// Rutas
const userRoutes = require('./routes/userRoutes');
app.use('/api', userRoutes);

const supervisorRoutes = require('./routes/supervisorRoutes');
app.use('/api', supervisorRoutes);

const subgerenteRoutes = require('./routes/subgerenteRoutes');
app.use('/api', subgerenteRoutes);

const gerenteRoutes = require('./routes/gerenteRoutes');
app.use('/api', gerenteRoutes);

const tareaRoutes = require('./routes/tareaRoutes');
app.use('/api', tareaRoutes);

const areaRoutes = require('./routes/areaRoutes');
const userModel = require('./models/userModel');
app.use('/api', areaRoutes);


//////////////////////REGISTER

app.post('/register', (req, res)=> {
  userModel.create(req.body)
  .then(users => res.json(users))
  .catch(err =>res.json(err))
})


//////////////////////LOGIN

app.post("/login", (req,res) => {
  const {correo, contraseña} = req.body;
  userModel.findOne({correo: correo}) 
  .then(user => {
    if(user) {
      if(user.contraseña === contraseña){
        res.json("Sesión iniciada correctamente")
      } else {
        res.json("La contraseña es incorrecta")
      }
    } else {
      res.json("No existe")
    }
  })
})



//////////////////////REGISTER

/*app.post('/register', (req, res)=> {
  const {id_empleados, nombre, rol, area, correo, contraseña} = req.body;
  bcrypt.hash(contraseña,10)
  .then(hash => {
    userModel.create({id_empleados, nombre, rol, area, correo, contraseña:hash})
    .then(users => res.json(users))
    .catch(err =>res.json(err))
  }).catch(err => console.log(err.message))

})


//////////////////////LOGIN

app.post("/login", (req,res) => {
  const {correo, contraseña} = req.body;
  userModel.findOne({correo: correo}) 
  .then(user => {
    if(user) {
      bcrypt.compare(contraseña, user.contraseña, (err, response) =>{
        if (response) {
          res.json("Sesión iniciada correctamente")
      } else {
          res.json("La contraseña es incorrecta")
      }
      })
    } else {
      res.json("No existe")
    }
  })
})

*/

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error interno del servidor' });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

// Manejo de cierre 
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Conexión a MongoDB cerrada');
    process.exit(0);
  });
});
