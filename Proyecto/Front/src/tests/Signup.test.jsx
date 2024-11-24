import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Signup from '../Signup'; 
import axios from 'axios';

describe('Signup Component', () => {
  test('renderiza el formulario de registro correctamente', () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );


    axios.post.mockClear(); 

    expect(screen.getByText('Registro')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ingresa tu Nombre')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ingresa tu Correo')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ingresa tu contraseña')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Regístrate' })).toBeInTheDocument();
    expect(screen.getByText('¿Ya tienes una cuenta?')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Login' })).toBeInTheDocument();
  });

    test('maneja el envío del formulario correctamente para un usuario de Terreno', async () => {
        axios.post.mockResolvedValue({data: {}})
        render(
          <MemoryRouter>
            <Signup />
          </MemoryRouter>
        );
    
        // Simular la entrada de datos
        await waitFor(() => screen.getByPlaceholderText("Ingresa tu Nombre")); 
        fireEvent.change(screen.getByPlaceholderText('Ingresa tu Nombre'), { target: { value: 'Usuario Prueba' } });
        fireEvent.change(screen.getByPlaceholderText('Ingresa tu Correo'), { target: { value: 'prueba@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Ingresa tu contraseña'), { target: { value: 'contraseña123' } });
        fireEvent.change(screen.getByRole('combobox', { name: 'Rol asignado' }), { target: { value: 'Users' } });
        fireEvent.change(screen.getByRole('combobox', { name: 'Área asignada' }), { target: { value: 'Eléctrica' } });
        
    
        // Mock para la respuesta exitosa de Axios
        axios.post.mockResolvedValueOnce({ status: 200, data: {} });
    
        // Simular el envío del formulario
        fireEvent.click(screen.getByRole('button', { name: 'Regístrate' }));
    
        // Verificar que se haya llamado a la API con los datos correctos
        expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/api/users', {
          nombre: 'Usuario Prueba',
          rol: 'Terreno',
          area: 'Eléctrica',
          tareas: [],
          id_empleados: expect.stringMatching(/TERR-\d+/), // Usar una expresión regular para validar el formato del ID
          contraseña: 'contraseña123',
          correo: 'prueba@example.com',
          progreso: [],
          comentarios: ' ',
        });
    
        // Esperar a que aparezca el mensaje de éxito
        await waitFor(() => {
          expect(screen.getByText('Registro exitoso!')).toBeInTheDocument();
        });
      });

      test("maneja el envio del formulario correctamente para un supervisor", async () => {
        axios.post.mockClear(); 
        render(
          <MemoryRouter>
            <Signup />
          </MemoryRouter>
        );
  

        // Mueve la lógica para llenar el formulario AQUÍ, dentro del test
        const nombreInput = await screen.findByPlaceholderText("Ingresa tu Nombre");
        fireEvent.change(nombreInput, { target: { value: "Supervisor Prueba" } });

        fireEvent.change(screen.getByPlaceholderText("Ingresa tu Correo"), {
          target: { value: "supervisor@example.com" },
        });
        fireEvent.change(screen.getByPlaceholderText("Ingresa tu contraseña"), {
          target: { value: "contraseña123" },
        });
        fireEvent.change(screen.getByRole("combobox", { name: "Rol asignado" }), {
          target: { value: "Supervisor" },
        });
        fireEvent.change(screen.getByRole("combobox", { name: "Área asignada" }), {
          target: { value: "Mecánica" },
        });
    
        axios.post.mockResolvedValueOnce({ status: 200, data: {} });
    
        fireEvent.click(screen.getByRole("button", { name: "Regístrate" }));

      expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/api/supervisors', {
        id_supervisor: expect.stringMatching(/SUP-\d+/),
        nombre: 'Supervisor Prueba',
        area: 'Mecánica',
        rol: 'Supervisor',
        contraseña: 'contraseña123',
        correo: 'supervisor@example.com',
        progreso: 0,
        comentarios: ' ',
        tareas: [],
      });

       // Esperar a que aparezca el mensaje de éxito
       await waitFor(() => {
        expect(screen.getByText('Registro exitoso!')).toBeInTheDocument();
      });

    });
});