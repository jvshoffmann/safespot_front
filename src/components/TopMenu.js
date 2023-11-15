import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext.js';

function TopMenu() {
    const navigate = useNavigate();
    const { authToken, clearAuthData } = useContext(AuthContext); 

    const handleLogout = () => {
        clearAuthData();
        navigate('/map'); // ou para a rota inicial, caso prefira
    };

    return (
        <div className="top-menu">
            {!authToken ? (
                <>
                    <button onClick={() => navigate('/login')}>Entrar</button>
                    <button onClick={() => navigate('/register')}>Registrar-se</button>
                </>
            ) : (
                <button onClick={handleLogout}>Sair</button>
            )}
        </div>
    );
}

export default TopMenu;
