import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { Link } from 'react-router-dom';
import { getFormattedDate, getFormattedTime } from "../../utils/DateUtils";

const DetalhaProntuario = () => {
    const { idPaciente } = useParams();
    const [pacienteData, setPacienteData] = useState({});
    const [consultas, setConsultas] = useState([]);
    const [exames, setExames] = useState([]);
    const { showToast } = useToast();

    useEffect(() => {
        const fetchPacienteData = async () => {
            try {
                const response = await fetch(`http://localhost:4000/pacientes/${idPaciente}`);
                if (!response.ok) {
                    throw new Error('Falha ao buscar os dados do paciente');
                }
                const data = await response.json();
                setPacienteData(data);
            } catch (error) {
                console.error(error);
                showToast('Falha ao buscar os dados do paciente');
            }
        };

        const fetchConsultas = async () => {
            try {
                const response = await fetch(`http://localhost:4000/consultas?idPaciente=${idPaciente}&_sort=dataCadastro&_order=desc`);
                if (!response.ok) {
                    throw new Error('Falha ao buscar as consultas');
                }
                const data = await response.json();
                setConsultas(data);
            } catch (error) {
                console.error(error);
                showToast('Falha ao buscar as consultas');
            }
        };

        const fetchExames = async () => {
            try {
                const response = await fetch(`http://localhost:4000/exames?idPaciente=${idPaciente}&_sort=dataCadastro&_order=desc`);
                if (!response.ok) {
                    throw new Error('Falha ao buscar os exames');
                }
                const data = await response.json();
                setExames(data);
            } catch (error) {
                console.error(error);
                showToast('Falha ao buscar os exames');
            }
        };

        fetchPacienteData();
        fetchConsultas();
        fetchExames();
    }, [idPaciente]);

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="d-flex align-items-center mb-4">
                        <i className="bi bi-file-earmark-text fs-1 me-2 text-blue align-middle"></i>
                        <h2 className="mb-0 text-blue">Prontuário Médico</h2>
                    </div>

                    <div className="card mb-4">
                        <div className="card-body">
                            <h5 className="card-title mb-4 mt-1">Dados do Paciente</h5>
                            <p className="card-text">
                                <strong>Nome Completo:</strong> {pacienteData.nomeCompleto}
                            </p>
                            <p className="card-text">
                                <strong>Convênio:</strong> {pacienteData.convenio}
                            </p>
                            <p className="card-text">
                                <strong>Alergias:</strong> {pacienteData.alergias || 'Nenhuma alergia registrada'}
                            </p>
                            <p className="card-text">
                                <strong>Contato de Emergência:</strong> {pacienteData.contatoEmergencia || 'Nenhum contato de emergência especificado'}
                            </p>
                            <p className="card-text">
                                <strong>Cuidados específicos:</strong> {pacienteData.cuidadosEspecificos || 'Nenhum cuidado específico registrado'}
                            </p>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-body d-flex justify-content-between align-items-center">
                            <h5 className="card-title">Consultas</h5>
                            <Link to={`/pacientes/${idPaciente}/consultas`}>
                                <button type="button" className="btn btn-info">
                                    <i className="bi bi-hospital"></i> Cadastrar
                                </button>
                            </Link>
                        </div>
                        {consultas.length > 0 ? (
                            <ul className="list-group p-3">
                                {consultas.slice(0, 5).map((consulta) => (
                                    <li key={consulta.id} className="list-group-item d-flex justify-content-between align-items-center">
                                        <span>
                                            <span className="fw-bold">Data:</span> {consulta.dataConsulta}
                                            <span className="fw-bold">- Horário:</span> {consulta.horarioConsulta}
                                            <span className="fw-bold">- Motivo:</span> {consulta.motivoConsulta}
                                        </span>
                                        <Link to={`/pacientes/${pacienteData.id}/consultas/${consulta.id}`}>
                                            <button type="button" className="btn btn-secondary">
                                                <i className="bi bi-search"></i>
                                            </button>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="card-body">
                                <p>Nenhuma consulta registrada</p>
                            </div>
                        )}

                    </div>

                    <div className="card mt-4">
                        <div className="card-body d-flex justify-content-between align-items-center">
                            <h5 className="card-title">Exames</h5>
                            <Link to={`/pacientes/${idPaciente}/exames`}>
                                <button type="button" className="btn btn-info">
                                    <i className="bi bi-clipboard-pulse"></i> Cadastrar
                                </button>
                            </Link>
                        </div>
                        {exames.length > 0 ? (
                            <ul className="list-group p-3">
                                {exames.slice(0, 5).map((exame) => (
                                    <li key={exame.id} className="list-group-item d-flex justify-content-between align-items-center">
                                        <span>
                                            <span className="fw-bold">Data:</span> {exame.dataExame}
                                            <span className="fw-bold"> - Horário:</span> {exame.horarioExame}
                                            <span className="fw-bold"> - Tipo:</span> {exame.tipoExame}
                                        </span>
                                        <Link to={`/pacientes/${pacienteData.id}/exames/${exame.id}`}>
                                            <button type="button" className="btn btn-secondary">
                                                <i className="bi bi-search"></i>
                                            </button>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="card-body">
                                <p>Nenhum exame registrado</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
};

export default DetalhaProntuario;
