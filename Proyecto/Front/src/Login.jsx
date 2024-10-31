import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'


const Login = () => {
    const [correo, setCorreo] = useState('');
    const [contraseña, setContraseña] = useState('');
    const navigate = useNavigate();
    
    const handleLoginUsers = () => {
      axios.get('http://localhost:5000/api/users')
        .then(response => {
          const usuarios = response.data; // Obtener la lista de usuarios
        
          // Paso 3: Filtrar el usuario por correo
          const usuario = usuarios.find(user => user.correo === correo);
          if (usuario) {
            // Guardar el nombre del usuario en localStorage
            localStorage.setItem('nombre', usuario.nombre);
          
            // Navegar a la página de 'terreno'
            navigate('/terreno');
            console.log(`Bienvenido, ${usuario.nombre}`);
          } 
        })
        .catch(error => {
          console.error('Error al obtener los usuarios:', error);
        });
    }

    const handleLoginSupervisor = () => {
      axios.get('http://localhost:5000/api/supervisors')
        .then(response => {
          const usuarios = response.data; // Obtener la lista de usuarios
        
          // Paso 3: Filtrar el usuario por correo
          const usuario = usuarios.find(user => user.correo === correo);
          if (usuario) {
            // Guardar el nombre del usuario en localStorage
            localStorage.setItem('nombreSupervisor', usuario.nombre);
          
            // Navegar a la página de 'terreno'
            navigate('/Supervisor');
            console.log(`Bienvenido, ${usuario.nombre}`);
          } 
        })
        .catch(error => {
          console.error('Error al obtener los usuarios:', error);
        });
    }

    const handleLoginSubgerente = () => {
      axios.get('http://localhost:5000/api/subgerentes')
        .then(response => {
          const usuarios = response.data; // Obtener la lista de usuarios
        
          // Paso 3: Filtrar el usuario por correo
          const usuario = usuarios.find(user => user.correo === correo);
          if (usuario) {
            // Guardar el nombre del usuario en localStorage
            localStorage.setItem('nombreSubgerente', usuario.nombre);
          
            // Navegar a la página de 'terreno'
            navigate('/Subgerente');
            console.log(`Bienvenido, ${usuario.nombre}`);
          } 
        })
        .catch(error => {
          console.error('Error al obtener los usuarios:', error);
        });
    }
    const handleSubmit = (e) => {
      e.preventDefault();

      // Paso 1: Hacer el login con el correo y la contraseña
      axios.post('http://localhost:5000/api/login', { correo, contraseña })
        .then(result => {
          //handleLoginUsers();
          // Verificar si el login fue exitoso
          if (result.data === "Sesión iniciada correctamente") {
            
            // Paso 2: Obtener todos los usuarios después del login exitoso

            handleLoginSupervisor() || handleLoginUsers() || handleLoginSubgerente();
            

          } else {
            alert("Credenciales incorrectas");
          }
        })
        .catch(err => console.log(err));
    };
    return (
        <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
          <div className="bg-white p-3 rounded w-25">
            <h2>Login</h2>
            <form onSubmit={handleSubmit} >
              <div className="mb-3">
                <label htmlFor="email">
                  <strong>Email</strong>
                </label>
                <input
                  type="Email"
                  placeholder="Enter Email"
                  autoComplete="off"
                  name="email"
                  className="form-control rounded-0"
                  onChange={(e) => setCorreo(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email">
                  <strong>Password</strong>
                </label>
                <input
                  type="Password"
                  placeholder="Enter Password"
                  autoComplete="off"
                  name="Password"
                  className="form-control rounded-0"
                  onChange={(e) => setContraseña(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-success w-100 rounded-0">
                Login
              </button>
              </form>
              <p>Already Have an Account</p>
              <Link to = '/register' className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">
                Register
              </Link> 
            
          </div>
        </div>
      )
}

export default Login