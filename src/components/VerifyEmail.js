import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

//const apiUrl = 'http://localhost:3000'
const apiUrl = 'https://safespot-d17a40cab9a8.herokuapp.com'

function VerifyEmail() {
  const [verificationStatus, setVerificationStatus] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${apiUrl}/api/verify-email/${token}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          setVerificationStatus('Seu e-mail foi verificado com sucesso!');
          setTimeout(() => navigate('/login'), 3000);
        } else {
          setVerificationStatus('Falha na verificação do e-mail.');
        }
      })
      .catch(() => setVerificationStatus('Falha na verificação do e-mail.'));
  }, [token, navigate]);

  return (
    <div>
      <h2>Verificação de E-mail</h2>
      <p>{verificationStatus}</p>
    </div>
  );
}

export default VerifyEmail;
