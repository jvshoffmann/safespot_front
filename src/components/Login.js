
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom'
import './Login.css';
import { AuthContext } from './AuthContext'; 
const apiUrl = 'https://safespot-d17a40cab9a8.herokuapp.com'

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const { setAuthData } = useContext(AuthContext); 

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação simples
    
    if (password.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Salva o token no localStorage e no contexto
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userId', data.userId);
        setAuthData(data.token);

        
        navigate('/map');
      } else {
        alert('Erro no login. Verifique seu e-mail/senha.');
      }
    } catch (error) {
      console.error('Erro ao realizar login:', error);
      alert('Erro ao realizar login. Tente novamente mais tarde.');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2 className = "login-text">Login</h2>
        <label className = "login-text">
          E-mail:
          <input
            type="text"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={handleEmailChange}
          />
        </label>
        <label className = "login-text">
          Senha:
          <input
            type="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={handlePasswordChange}
          />
        </label>
        <button type="submit">Entrar</button>
        <button onClick={() => navigate('/register')}>Registrar-se</button>
        
      </form>
    </div>
  );
}


export default Login;
