import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
//const apiUrl = 'http://localhost:3000'
const apiUrl = 'https://safespot-d17a40cab9a8.herokuapp.com/'
function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Aqui você fará a chamada para o back-end para registrar o usuário
    const response = await fetch(`${apiUrl}/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username, email, password
      })
    });

    const data = await response.json();
    localStorage.setItem('token', data.token);
    if (data.success) {
        navigate('/map');
    } else {
      // Tratar erro
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
}

export default Register;