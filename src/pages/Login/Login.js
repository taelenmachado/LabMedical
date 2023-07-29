import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.scss';
import { useToast } from '../../context/ToastContext';
import UserRegistrationModal from '../../components/UserRegistrationModal/UserRegistrationModal';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`http://localhost:4000/usuarios?email=${encodeURIComponent(email)}&senha=${encodeURIComponent(password)}`);
      if (!response.ok) {
        throw new Error('Falha ao verificar as credenciais');
      }
  
      const users = await response.json();
      if (users.length > 0) {
        console.log('Login bem-sucedido!');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userPassword', password);
        navigate('/home');
      } else {
        setErrorMessage('Credenciais inválidas! Verifique seu e-mail e senha.');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Falha ao verificar as credenciais');
    }
  };

  const handleRegistration = async (newEmail, newPassword) => {
    try {
      const response = await fetch('http://localhost:4000/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newEmail, senha: newPassword }),
      });

      if (!response.ok) {
        showToast('Erro ao cadastrar usuário.');
      } else {
        showToast('Usuário cadastrado com sucesso!');
        setShowModal(false);
      }
    } catch (error) {
      showToast('Erro ao cadastrar usuário.');
    }
  };

  return (
    <div className="login">
      <UserRegistrationModal
        showModal={showModal}
        setShowModal={setShowModal}
        onRegister={handleRegistration}
      />
      <div className="row">
        <div className="col-md-11 d-flex justify-content-end mt-4">
          <p className="me-2 text-secondary">Não possui uma conta?</p>
          <button type="button" className="btn btn-primary" onClick={() => setShowModal(true)}>Cadastrar</button>
        </div>
      </div>
      <div className="row">
        <div className="login__container col-md-4 offset-md-4 p-3">
          <div className="container">
            <div className="d-flex align-items-center mb-4">
              <i className="bi bi-heart-pulse-fill fs-1 me-2 align-middle text-blue"></i>
              <h2 className="text-blue mb-0">LabMedical</h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">E-mail</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="senha" className="form-label">Senha</label>
                <input
                  type="password"
                  className="form-control"
                  id="senha"
                  name="senha"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {errorMessage && <div className="error-message">{errorMessage}</div>}

              <div className="mb-3">
                <button type="button" className="btn btn-link" onClick={() => showToast('Funcionalidade em construção!')}>Esqueceu a senha?</button>
              </div>

              <div className="d-flex justify-content-center">
                <button type="submit" className="btn btn-primary">Login</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
