
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom'
import './Login.css';
import { AuthContext } from './AuthContext'; // Supondo que você colocou o AuthContext neste diretório

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const { setAuthData } = useContext(AuthContext); // Para acessar a função setAuthData do nosso contexto

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
      const response = await fetch('${process.env.REACT_APP_API_BASE_URL}/api/login', {
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
        setAuthData(data.token);

        // Redireciona o usuário para a tela principal (por exemplo, mapa)
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
        <label>
          E-mail ou Username:
          <input
            type="text"
            placeholder="Digite seu e-mail ou username"
            value={email}
            onChange={handleEmailChange}
          />
        </label>
        <label>
          Senha:
          <input
            type="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={handlePasswordChange}
          />
        </label>
        <button type="submit">Entrar</button>
      </form>
      <button onClick={() => navigate('/register')}>
        Registrar-se
      </button>
    </div>
  );
}

export default Login;
