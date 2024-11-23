const User = require('../models/userModel');
const Area = require('../models/areaModel');
const { calcularPuntosPorTarea } = require('../services/userService');
const { generarReportePorArea } = require('../services/reportService');

// Crear un usuario (funciona, especificar los campos que salen en modeluser)
const crearUser = async (req, res) => {
  const nuevoUser = new User(req.body);
  try {
    const userGuardado = await nuevoUser.save();
    res.status(200).json(userGuardado);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear usuario', error });
  }
};


// Obtener todos los usuarios (funciona)
const obtenerUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: 'Error al obtener usuarios', error });
  }
};

// Obtener un usuario por ID  (funciona, especificar el id de mongo)
const obtenerUserPorId = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: 'Error al obtener usuarioo', error });
  }
};

/////////

// Obtener un usuario por correo (funcionando para buscar por string)
const obtenerUserPorCorreo = async (req, res) => {
  try {
    const correo = req.params.correo; // Obtén el email desde los parámetros de la solicitud
    const user = await User.findOne({ correo: correo }); // Busca en la base de datos por el campo `email`
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: 'Error al obtener usuario', error });
  }
};




// Actualizar un usuario (funciona, especificar el id de mongo y repestar los campos)
const actualizarUser = async (req, res) => {
  try {
    const userActualizado = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!userActualizado) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.status(200).json(userActualizado);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar usuario', error });
  }
};



// Eliminar un usuario (funciona, especificar el id de mongo)
const eliminarUser = async (req, res) => {
  try {
    const userEliminado = await User.findByIdAndDelete(req.params.id);
    if (!userEliminado) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.status(200).json({ message: 'Usuario eliminado' });
  } catch (error) {
    res.status(400).json({ message: 'Error al eliminar usuario', error });
  }
};


//////////////////////////////////////////////
// Función para obtener usuarios con sus tareas y áreas
const obtenerUsuariosConTareasYArea = async (req, res) => {
  try {
    // Buscar todos los usuarios
    const usuarios = await User.find();

    // Buscar todas las áreas
    const areas = await Area.find();

    // Mapear usuarios con sus tareas y el nombre del área
    const resultado = usuarios.map(usuario => {
      const areaUsuario = areas.find(area => area.nombre === usuario.area);
      return {
        nombre: usuario.nombre,
        tareas: usuario.tareas,
        area: areaUsuario ? areaUsuario.nombre : 'Área no encontrada'
      };
    });

    // Responder con los datos
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios con sus tareas y áreas', error });
  }
};

/////////////
// Función para obtener usuarios del área Eléctrica con su nombre y tareas
const obtenerTrabajadoresAreaElectrica = async (req, res) => {
  try {
    // Buscar usuarios que pertenezcan al área "Eléctrica"
    const usuariosElectricos = await User.find({ area: "Eléctrica" }, { nombre: 1, tareas: 1, progreso: 1});

    // Responder con los datos
    res.status(200).json(usuariosElectricos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios del área Eléctrica', error });
  }
};

///////
// Función para obtener usuarios del área Mecánica con su nombre y tareas
const obtenerTrabajadoresAreaMecanica = async (req, res) => {
  try {
    // Buscar usuarios que pertenezcan al área "Mecánica"
    const usuariosMecanicos = await User.find({ area: "Mecánica" }, { nombre: 1, tareas: 1, progreso: 1 });

    // Responder con los datos
    res.status(200).json(usuariosMecanicos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios del área Mecánica', error });
  }
};

///////
// Función para obtener usuarios del área Operaciones con su nombre y tareas
const obtenerTrabajadoresAreaOperaciones = async (req, res) => {
  try {
    // Buscar usuarios que pertenezcan al área "Operaciones"
    const usuariosOperaciones = await User.find({ area: "Operaciones" }, { nombre: 1, tareas: 1, progreso: 1 });

    // Responder con los datos
    res.status(200).json(usuariosOperaciones);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios del área Operaciones', error });
  }
};



/////
// Función para obtener las tareas de una persona y otros usuarios de las áreas eléctrica, mecánica y operaciones con las mismas tareas
const obtenerTareasYUsuariosSimilares = async (req, res) => {
  const { nombre } = req.params; // Obtener el nombre de la persona como parámetro de la URL

  try {
    // Buscar las tareas y el área asignada a la persona específica
    const persona = await User.findOne({ nombre });
    if (!persona) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const tareasPersona = persona.tareas;
    const areaPersona = persona.area; // Obtener el área de la persona
    const idPersona = persona._id; // Obtener el ID de la persona

    // Buscar otros usuarios que pertenezcan a las áreas eléctrica, mecánica o de operaciones y que tengan al menos una de las mismas tareas
    const usuariosSimilares = await User.find({
      area: { $in: ["Eléctrica", "Mecánica", "Operaciones"] },
      tareas: { $in: tareasPersona },
      nombre: { $ne: nombre } // Excluir a la persona original de los resultados
    }, { nombre: 1, tareas: 1, area: 1, _id: 1 });

    // Responder con las tareas de la persona y los usuarios similares
    res.status(200).json({
      usuarioPrincipal: {
        id: idPersona,
        nombre: nombre,
        area: areaPersona,
        tareas: tareasPersona
      },
      usuariosConMismasTareas: usuariosSimilares
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener tareas y usuarios similares', error });
  }
};



///////////////////REGISTRO Y LOGIN


// Registro de usuarios
const registerUser = async (req, res) => {
  try {
    // Cifrar la contraseña antes de guardar el usuario
    const hashedPassword = await bcrypt.hash(req.body.contraseña, 10);
    const newUser = { ...req.body, contraseña: hashedPassword };
    
    const user = await User.create(newUser);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


////

/**
 * Genera y envía un reporte Excel basado en el progreso de tareas de un área.
 * @param {Request} req
 * @param {Response} res
 */
const generarReporteArea = async (req, res) => {
  const { area } = req.params; // 'Eléctrica', 'Mecánica', 'Operaciones'
  try {
    const progresoPorTarea = await calcularPuntosPorTarea(area);
    const workbook = generarReportePorArea(progresoPorTarea, area);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=reporte_${area}.xlsx`);
    workbook.write('reporte.xlsx', res);
  } catch (error) {
    console.error("Error generando reporte:", error);
    res.status(500).json({ error: "Error generando reporte" });
  }
};

module.exports = { generarReporteArea };




module.exports = {
  crearUser,
  obtenerUsers,
  obtenerUserPorId,
  actualizarUser,
  eliminarUser,
  obtenerUsuariosConTareasYArea,
  obtenerTrabajadoresAreaElectrica,
  obtenerTrabajadoresAreaMecanica,
  obtenerTrabajadoresAreaOperaciones,
  obtenerTareasYUsuariosSimilares,
  registerUser,
  obtenerUserPorCorreo
};
