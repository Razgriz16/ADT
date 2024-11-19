import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userId, setUserId] = useState('');
  const [userRole, setUserRole] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const roles = ['gerentes', 'subgerentes', 'supervisors', 'users'];
      let userFound = false;

      for (const role of roles) {
        const response = await axios.get(`http://localhost:5000/api/${role}`);
        const user = response.data.find(user => user.correo === email);

        if (user) {
          userFound = true;
          setUserId(user._id); // Guardar el ObjectId del usuario
          setUserRole(role);  // Guardar el rol del usuario
          break;
        }
      }

      if (userFound) {
        setShowForm(true);
      } else {
        setError('El correo electrónico no está registrado.');
      }
    } catch (err) {
      setError('Error al verificar el correo electrónico.');
      console.error(err);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      // Actualizar la contraseña usando el ID y el rol
      await axios.put(`http://localhost:5000/api/${userRole}/${userId}`, { contraseña: newPassword });

      setSuccess('Contraseña actualizada con éxito. Ahora puedes iniciar sesión.');
      setNewPassword('');
      setConfirmPassword('');
      setShowForm(false);

      // Mostrar alerta de éxito
      window.alert('¡Cambio de contraseña exitoso! Ahora puedes iniciar sesión.');
    } catch (error) {
      setError('Error al actualizar la contraseña.');
      console.error(error);
    }
  };

  const passwordsMatch = newPassword === confirmPassword && newPassword.length > 0;

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-3 bg-body rounded w-50 mx-auto">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Recuperar Contraseña</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                <strong>Email</strong>
              </label>
              <input
                type="email"
                placeholder="Ingresa tu correo electrónico"
                autoComplete="off"
                name="email"
                className="form-control shadow-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 shadow-sm">
              Verificar
            </button>
            {error && <div className="alert alert-danger mt-3" role="alert">{error}</div>}
          </form>

          {showForm && (
            <form onSubmit={handlePasswordReset} className="mt-4">
              <div className="mb-3">
                <label htmlFor="newPassword" className="form-label">
                  <strong>Nueva Contraseña</strong>
                </label>
                <input
                  type="password"
                  placeholder="Ingresa tu nueva contraseña"
                  name="newPassword"
                  className="form-control shadow-sm"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">
                  <strong>Confirmar Contraseña</strong>
                </label>
                <input
                  type="password"
                  placeholder="Confirma tu nueva contraseña"
                  name="confirmPassword"
                  className="form-control shadow-sm"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {confirmPassword && (
                  <p
                    className={`mt-1 ${
                      passwordsMatch ? 'text-success' : 'text-danger'
                    }`}
                  >
                    {passwordsMatch
                      ? 'Las contraseñas coinciden.'
                      : 'Las contraseñas no coinciden.'}
                  </p>
                )}
              </div>
              <button type="submit" className="btn btn-primary w-100 shadow-sm">
                Restablecer Contraseña
              </button>
              {error && <div className="alert alert-danger mt-3" role="alert">{error}</div>}
              {success && (
                <div className="alert alert-success mt-3" role="alert">
                  {success}
                </div>
              )}
            </form>
          )}

          <div className="mt-3 text-center">
            <Link
              to="/login"
              className={`text-decoration-none ${
                success ? 'text-success fw-bold fs-5' : ''
              }`}
            >
              Volver al Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
