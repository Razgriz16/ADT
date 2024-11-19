import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Signup() {
    const [name, setname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:5000/api/users', {name, email, password})
        .then(result => console.log(result))
        .catch(error => console.log(error))
    }
    return (
        <div className="container mt-5">
          <div className="card shadow-lg p-3 bg-body rounded w-50 mx-auto">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Registro</h2>
              <form>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    <strong>Nombre</strong>
                  </label>
                  <input
                    type="text"
                    placeholder="Ingresa tu nombre"
                    autoComplete="off"
                    name="name"
                    className="form-control shadow-sm"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    <strong>Email</strong>
                  </label>
                  <input
                    type="email" // Corregido a type="email"
                    placeholder="Ingresa tu Correo"
                    autoComplete="off"
                    name="email"
                    className="form-control shadow-sm"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    <strong>Contraseña</strong>
                  </label>
                  <input
                    type="password"
                    placeholder="Ingresa tu contraseña"
                    autoComplete="off"
                    name="password"
                    className="form-control shadow-sm"
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100 shadow-sm">
                  Regístrate
                </button>
    
                <p className="text-center mt-3">¿Ya tienes una cuenta?</p>
    
                <Link  // Usamos Link para la navegación
                  to="/login" // Ruta al componente de login
                  className="btn btn-outline-secondary w-100 shadow-sm text-decoration-none"
                >
                  Login
                </Link>
              </form>
            </div>
          </div>
        </div>
      );
};

export default Signup;