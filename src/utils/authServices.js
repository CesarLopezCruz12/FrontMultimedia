import axios from 'axios';
import Cookies from 'js-cookie';

/**
 * Llama al endpoint de login, guarda la cookie y devuelve true/false.
 * @param {string} username 
 * @param {string} password 
 */

export async function loginService(username, password) {
  try {
    const res = await axios.post('/api/auth/login', {
      username,
      password
    });
    // asumimos que devuelve { token: '...' }
    if (res.data.token) {
      Cookies.set('token', res.data.token);
      return true;
    }
    return false;
  } catch (err) {
    console.error('loginService error:', err);
    return false;
  }
}
