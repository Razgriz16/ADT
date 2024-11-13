import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');


  const navigate = useNavigate();

  const verificarRol = async () => {
    try {
      // Verificar si es un Supervisor
      const responseSupervisor = await axios.get('http://localhost:5000/api/supervisors');
      const supervisor = responseSupervisor.data.find(user => user.correo === correo && user.contraseña === contraseña);
      if (supervisor) {
        localStorage.setItem('rol', 'Supervisor');
        localStorage.setItem('nombreSupervisor', supervisor.nombre);
        navigate('/supervisor');
        return;
      }

      // Verificar si es un SubGerente
      const responseSubgerente = await axios.get('http://localhost:5000/api/subgerentes');
      const subgerente = responseSubgerente.data.find(user => user.correo === correo && user.contraseña === contraseña);
      if (subgerente) {
        localStorage.setItem('rol', 'SubGerente');
        localStorage.setItem('nombreSubgerente', subgerente.nombre);
        navigate('/subgerente');
        return;
      }

      // Verificar si es un Gerente
      const responseGerente = await axios.get('http://localhost:5000/api/gerentes');
      const gerente = responseGerente.data.find(user => user.correo === correo && user.contraseña === contraseña);
      if (gerente) {
        localStorage.setItem('rol', 'Gerente');
        localStorage.setItem('nombreGerente', gerente.nombre);
        navigate('/gerente');
        return;
      }

      // Verificar si es un usuario de Terreno
      const responseUser = await axios.get('http://localhost:5000/api/users');
      const user = responseUser.data.find(user => user.correo === correo && user.contraseña === contraseña);
      if (user) {
        localStorage.setItem('rol', 'Terreno');
        localStorage.setItem('nombre', user.nombre);
        navigate('/terreno');
        return;
      }

      // Si no coincide con ningún rol
      alert('Rol no encontrado o credenciales incorrectas');
    } catch (error) {
      console.error('Error al verificar el rol:', error);
      alert('Error al verificar el rol');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Realizar la solicitud de login al backend
      const response = await axios.post('http://localhost:5000/api/login', { correo, contraseña });

      if (response.data.token) {
        // Guardar el token en localStorage
        localStorage.setItem('token', response.data.token);

        // Verificar el rol del usuario
        await verificarRol();
      } else {
        alert('Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Error en el servidor');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
      <div className="bg-white p-3 rounded w-25">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email</strong>
            </label>
            <input
              type="text"
              placeholder="Enter Email"
              autoComplete="off"
              name="email"
              className="form-control rounded-0"
              onChange={(e) => setCorreo(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password">
              <strong>Password</strong>
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              autoComplete="off"
              name="password"
              className="form-control rounded-0"
              onChange={(e) => setContraseña(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-success w-100 rounded-0">
            Login
          </button>
        </form>
        <p>Already Have an Account</p>
        <Link
          to="/register"
          className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none"
        >
          Register
        </Link>
      </div>
    </div>
  );
};

export default Login;
