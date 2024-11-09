const jwt = require('jsonwebtoken');

function authenticateRole(allowedRoles) {
  return (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) return res.status(401).json("Acceso denegado: No se proporcionó un token");

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(403).json("Token inválido");

      if (!allowedRoles.includes(decoded.rol)) {
        return res.status(403).json("Acceso denegado: No tienes permisos para acceder a esta vista");
      }

      req.user = decoded;
      next();
    });
  };
}

module.exports = authenticateRole;
