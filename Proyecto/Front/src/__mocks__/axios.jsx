// __mocks__/axios.js
const mockAxios = {
  post: jest.fn(() => Promise.resolve({ data: {} })),
  get: jest.fn(), // Agregamos el método get
  put: jest.fn(), // Agrega otros métodos si los necesitas
};

export default mockAxios;