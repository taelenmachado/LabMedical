import React, {useState} from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Toolbar from './components/Toolbar/Toolbar';
import SideMenu from './components/SideMenu/SideMenu';
import Content from './components/Content/Content';
import Login from './pages/Login/Login';
import Exames from './pages/Exames/Exames';
import Consultas from './pages/Consultas/Consultas';
import Pacientes from './pages/Pacientes/Pacientes';
import Prontuarios from './pages/Prontuarios/Prontuarios';
import DetalhaProntuario from './pages/DetalhaProntuario/DetalhaProntuario';
import Erro from './pages/Erro/Erro';
import Home from './pages/Home/Home';
import { ToastProvider } from './context/ToastContext';
import Message from './components/Message/Message';

const App = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const estaLogado = () => localStorage.getItem('userEmail') != null;

  const onToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <ToastProvider>
      <div className="container">
        <Toolbar />
        <Message />
        {!isLoginPage && estaLogado() && (
          <div className="row">
            <div className={isMenuOpen ? "col-md-3" : "col-md-1"}>
              <SideMenu isMenuOpen={isMenuOpen} onToggleMenu={onToggleMenu} />
            </div>
            <div className={isMenuOpen ? "col-md-9" : "col-md-11"}>
              <Content>
                <Routes>
                  <Route path="/home" element={<Home />} />
                  <Route path="/consultas" element={<Consultas />} />
                  <Route path="/pacientes/:idPaciente/consultas" element={<Consultas />} />
                  <Route path="/pacientes/:idPaciente/consultas/:id" element={<Consultas />} />
                  <Route path="/exames" element={<Exames />} />
                  <Route path="/pacientes/:idPaciente/exames" element={<Exames />} />
                  <Route path="/pacientes/:idPaciente/exames/:id" element={<Exames />} />
                  <Route path="/pacientes" element={<Pacientes />} />
                  <Route path="/pacientes/:id" element={<Pacientes />} />
                  <Route path="/prontuarios" element={<Prontuarios />} />
                  <Route path="/prontuarios/:idPaciente" element={<DetalhaProntuario />} />
                  <Route path="*" element={<Erro />} />
                </Routes>
              </Content>
            </div>
          </div>
        )}
        {(isLoginPage || !estaLogado()) && (
          <div className="row">
            <div className="col-md-12">
              <Login />
            </div>
          </div>
        )}
      </div>
    </ToastProvider>
  );
};

export default App;
