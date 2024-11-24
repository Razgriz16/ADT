// Login.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../Login';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '@testing-library/jest-dom';

jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('1. Renders login form correctly', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    // Use getByRole to specifically target the heading
    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter Password')).toBeInTheDocument();
    // Use getByRole to specifically target the button
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByText('¿Olvidaste tu contraseña?')).toBeInTheDocument();
    expect(screen.getByText('¿No tienes una cuenta?')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Regístrate' })).toBeInTheDocument();
  });

  test('2. Allows user to input email and password', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    const emailInput = screen.getByPlaceholderText('Enter Email');
    const passwordInput = screen.getByPlaceholderText('Enter Password');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('3. Submits form and navigates to correct route based on role', async () => {
    const mockedNavigate = jest.fn();
    useNavigate.mockReturnValue(mockedNavigate);
    
    // Mock responses for different roles
    axios.post.mockResolvedValueOnce({ data: { token: 'fakeToken' } });

    axios.get.mockResolvedValueOnce({ data: [{ correo: 'test@example.com', contraseña: 'password123', nombre: 'Supervisor Test'}]})
      .mockResolvedValueOnce({ data: []})
      .mockResolvedValueOnce({ data: []})
      .mockResolvedValueOnce({ data: []});

    render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText('Enter Email');
    const passwordInput = screen.getByPlaceholderText('Enter Password');
    const loginButton = screen.getByRole('button', { name: 'Login' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);

      await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('fakeToken');
      expect(localStorage.getItem('rol')).toBe('Supervisor');
      expect(localStorage.getItem('nombreSupervisor')).toBe('Supervisor Test');
      expect(mockedNavigate).toHaveBeenCalledWith('/supervisor');
    });
  });



  
});