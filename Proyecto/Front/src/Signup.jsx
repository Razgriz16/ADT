import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Users");
  const [area, setArea] = useState("Eléctrica");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
  
    if (!name || !email || !password || !role || !area) {
      setMessage("Error: Por favor, completa todos los campos.");
      setAlertType("alert-danger"); // Rojo
      return;
    }
  
    try {
      let url;
      let data;
  
      switch (role) {
        case "Users":
          url = "http://localhost:5000/api/users";
          data = {
            nombre: name,
            rol: "Terreno",
            area: area,
            tareas: [],
            id_empleados: `TERR-${Date.now()}`, // Genera un ID único
            contraseña: password,
            correo: email,
            progreso: [],
            comentarios: " ",
          };
          break;
  
        case "Supervisor":
          url = "http://localhost:5000/api/supervisors";
          const id_supervisor = `SUP-${Date.now()}`; // Generar ID único para supervisor
          data = {
            id_supervisor,
            nombre: name,
            area: area,
            rol: "Supervisor",
            contraseña: password,
            correo: email,
            progreso: 0,
            comentarios: " ",
            tareas: [],
          };
          break;
  
        case "Subgerente":
          url = "http://localhost:5000/api/subgerentes";
          data = {
            id_subgerente: `SUB-${Date.now()}`, // Genera un ID único
            nombre: name,
            area: area,
            rol: "SubGerente",
            contraseña: password,
            correo: email,
            progreso: 0,
            comentarios: " ",
          };
          break;
  
        default:
          setMessage("Rol no válido");
          setIsLoading(false);
          return;
      }
  
      console.log("Datos enviados:", data);
  
      await axios.post(url, data);
      setMessage("Registro exitoso!");
      setAlertType("alert-success"); // Verde
    } catch (error) {
      console.error(error);
      setMessage("Error: No se pudo completar el registro.");
      setAlertType("alert-danger"); // Rojo
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-3 bg-body rounded w-50 mx-auto">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Registro</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                <strong>Nombre</strong>
              </label>
              <input
                type="text"
                placeholder="Ingresa tu Nombre"
                autoComplete="off"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-control shadow-sm"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                <strong>Email</strong>
              </label>
              <input
                type="text"
                placeholder="Ingresa tu Correo"
                autoComplete="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control shadow-sm"
              />
            </div>
            <div className="mb-3">
          <label htmlFor="role" className="form-label" id="roleLabel">
            <strong>Rol asignado</strong>
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="form-select shadow-sm"
          >
                <option value="Users">Terreno</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Subgerente">Subgerente</option>
              </select>
            </div>
            <div className="mb-3">
          <label htmlFor="area" className="form-label" id="areaLabel">
            <strong>Área asignada</strong>
          </label>
          <select
            id="area" 
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="form-select shadow-sm"
          >
                <option value="Eléctrica">Eléctrica</option>
                <option value="Mecánica">Mecánica</option>
                <option value="Operaciones">Operaciones</option>
              </select>
            </div>
            {message && (
              <div className={`alert ${alertType}`} role="alert">
                {message}
              </div>
            )}
            <button type="submit" className="btn btn-primary w-100 shadow-sm">
              Regístrate
            </button>

            <p className="text-center mt-3">¿Ya tienes una cuenta?</p>

            <Link
              to="/login"
              className="btn btn-outline-secondary w-100 shadow-sm text-decoration-none"
            >
              Login
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
