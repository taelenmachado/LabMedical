import React, { useState, useEffect } from 'react';
import Card from "../../components/Card/Card";
import CardPaciente from "../../components/CardPaciente/CardPaciente";

const Home = () => {

    const [pacientes, setPacientes] = useState([]);
    const [estatisticas, setEstatisticas] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchPacientes = async () => {
        try {
            const response = await fetch('http://localhost:4000/pacientes?_sort=dataCadastro&_order=desc');
            if (!response.ok) {
                throw new Error('Falha ao buscar os dados dos pacientes');
            }
            const data = await response.json();
            setPacientes(data);
        } catch (error) {
            console.error(error);
        }
    };

    const obterEstatisticas = async () => {
        try {
          const [consultasResponse, examesResponse, pacientesResponse] = await Promise.all([
            fetch('http://localhost:4000/consultas?_page=1'),
            fetch('http://localhost:4000/exames?_page=1'),
            fetch('http://localhost:4000/pacientes?_page=1'),
          ]);
      
          const consultasTotal = Number(consultasResponse.headers.get('X-Total-Count'));
          const examesTotal = Number(examesResponse.headers.get('X-Total-Count'));
          const pacientesTotal = Number(pacientesResponse.headers.get('X-Total-Count'));
      
          setEstatisticas({ consultas: consultasTotal, exames: examesTotal, pacientes: pacientesTotal });
        } catch (error) {
          console.error(error);
          return { consultas: 0, exames: 0, pacientes: 0 };
        }
      };

    useEffect(() => {
        fetchPacientes();
        obterEstatisticas();
    }, []);      

    const handleSearch = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`http://localhost:4000/pacientes?q=${searchTerm}`);
            if (!response.ok) {
                throw new Error('Falha ao buscar os dados dos pacientes');
            }
            const data = await response.json();
            setPacientes(data);
        } catch (error) {
            console.error(error);
        }
    };

    return <div>
        <div className="mt-3">
            <h4>Estatísticas do Sistema</h4>
            <div className="row">
                <Card className="col" label="Pacientes" value={estatisticas.pacientes} icon="bi-person-circle" />
                <Card className="col" label="Consultas" value={estatisticas.consultas} icon="bi-heart-pulse" />
                <Card className="col" label="Exames" value={estatisticas.exames} icon="bi-journal-text" />
            </div>
        </div>
        <div className="mt-4">
            <h4>Informações de pacientes</h4>
            <form onSubmit={handleSearch}>
                <div className="input-group mb-3">
                    <input type="text" className="form-control" placeholder="Digite o nome, telefone ou e-mail do paciente" aria-label="Digite o nome do paciente" aria-describedby="button-addon2" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    <button className="btn btn-outline-secondary" type="submit" id="button-addon2">Buscar</button>
                </div>
            </form>
            <div className="row">
                {pacientes.slice(0, 6).map((paciente) => (
                    <CardPaciente key={paciente.id} className="col-4 col-sm-4 mb-4" paciente={paciente} />
                ))}
            </div>
        </div>
    </div>;
};

export default Home;