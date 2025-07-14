
import { api } from './api.js';

export const auth = {
 // login function
  login: async (email, password) => {
    const users = await api.get('users');
    const user = users.find(u => u.email === email);
    if (!user || user.password !== password) {
      throw new Error('Credenciales inválidas');
    }
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Registration function
  register: async (name, email, password) => {
    const users = await api.get('users');
    const exists = users.some(u => u.email === email);
    if (exists) {
      throw new Error('El email ya está registrado');
    }

    const newUser = {
      name,
      email,
      password,
      role: 'visitor' 
    };
    const savedUser = await api.post('users', newUser);
    localStorage.setItem('user', JSON.stringify(savedUser));
  },

 // Logout function
  logout: () => {
    localStorage.removeItem('user');
    location.hash = '#/login';
  },

 // Check if there is an authenticated user
  isAuthenticated: () => {
    return localStorage.getItem('user') !== null;
  },

  // Get the authenticated user
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};
