import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Autocomplete from '../../components/Autocomplete/Autocomplete';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '../../context/ToastContext';
import { getFormattedDate, getFormattedTime } from "../../utils/DateUtils";
import useConfirmation from '../../hooks/useConfirmation';


const Consultas = () => {
    const { idPaciente, id } = useParams();
    const navigate = useNavigate();
    const { showConfirm, ConfirmationModal } = useConfirmation();
    const { showToast } = useToast();

    const [pacienteData, setPacienteData] = useState({});
    const [consultaData, setConsultaData] = useState({
        dataConsulta: getFormattedDate(),
        horarioConsulta: getFormattedTime(),
    });

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
            }
        };
        if (idPaciente) {
            fetchPacienteData();
        }
    }, [idPaciente]);

    useEffect(() => {
        const fetchConsultaData = async () => {
            try {
                const response = await fetch(`http://localhost:4000/consultas/${id}`);
                if (!response.ok) {
                    throw new Error('Falha ao buscar os dados da consulta');
                }
                const data = await response.json();
                setConsultaData(data);
            } catch (error) {
                console.error(error);
            }
        };
        if (id) {
            fetchConsultaData();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setConsultaData((prevData) => ({ ...prevData, [name]: value }));
    };

    const validateForm = () => {
        if (consultaData.descricaoProblema.length < 15 || consultaData.descricaoProblema.length > 1000) {
            showToast('A Descrição do Problema deve conter entre 15 e 1000 caracteres.');
            return false;
        }
    
        if (consultaData.dosagemPrecaucoes.length < 15 || consultaData.dosagemPrecaucoes.length > 250) {
            showToast('A Dosagem e Precauções devem conter entre 15 e 250 caracteres.');
            return false;
        }
        return true;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!validateForm()){
            return;
        }

        try {
            const consultaDataCopy = { ...consultaData };
            consultaDataCopy.id = uuidv4();
            consultaDataCopy.dataCadastro = getFormattedDate();
            consultaDataCopy.idPaciente = idPaciente;
            consultaDataCopy.nomeCompleto = pacienteData.nomeCompleto;

            const response = await fetch(`http://localhost:4000/consultas`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(consultaDataCopy),
            });

            if (!response.ok) {
                showToast('Falha ao cadastrar consulta do paciente!');
            }
            showToast(`Consulta do paciente "${pacienteData.nomeCompleto}" cadastrada com sucesso!`);
            navigate(`/prontuarios/${pacienteData.id}`);
        } catch (error) {
            console.error(error);
        }
    }

    const handleVoltar = () => {
        navigate(-1);
    };

    const handleUpdate = async (e) => {
        try {

            if(!validateForm()){
                return;
            }

            const consultaDataCopy = { ...consultaData };
            consultaDataCopy.idPaciente = idPaciente;
            consultaDataCopy.dataCadastro = getFormattedDate();
            consultaDataCopy.nomeCompleto = pacienteData.nomeCompleto;

            const response = await fetch(`http://localhost:4000/consultas/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(consultaDataCopy),
            });

            if (!response.ok) {
                showToast('Falha ao atualizar consulta do paciente!');
            }
            showToast(`Consulta do paciente "${pacienteData.nomeCompleto}" atualizada com sucesso!`);
            navigate('/home');
        } catch (error) {
            console.error(error);
        }
    }

    const handleDelete = async (e) => {

        showConfirm('Deseja realmente excluir esta consulta?', async () => {
            try {

                const response = await fetch(`http://localhost:4000/consultas/${id}`, {
                    method: 'DELETE'
                });

                if (!response.ok) {
                    showToast('Falha ao deletar os dados do paciente!');
                }

                showToast(`Consulta do paciente "${pacienteData.nomeCompleto}" deletada com sucesso!`);
                navigate('/home');
            } catch (error) {
                showToast('Falha ao deletar os dados do paciente!');
            }
        });
    };

    const onSelect = (paciente) => {
        navigate(`/pacientes/${paciente.id}/consultas`);
    }

    return (
        <div className="container">
            <ConfirmationModal />
            <div className="row">
                <div className="col-md-12">
                    <div className="d-flex align-items-center mb-4">
                        <i className="bi bi-hospital fs-1 me-2 text-blue align-middle"></i>
                        <h2 className="mb-0 text-blue">Cadastro de Consulta</h2>
                    </div>

                    <div className="input-group mb-3">

                        <Autocomplete
                            id="autocomplete-paciente"
                            placeholder="Digite o nome do paciente"
                            onChange={onSelect}
                        />
                        <button className="btn btn-primary" type="button" id="buscar-paciente">
                            <i className="bi bi-search"></i>
                        </button>

                    </div>

                    {pacienteData && pacienteData.id && (
                        <form className="mt-5" onSubmit={handleSubmit}>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <span className="text-blue fw-bold fs-4">Consulta para: {pacienteData && pacienteData.nomeCompleto}</span>
                                <div className="d-flex">
                                    {id && (
                                        <>
                                            <button type="button" className="btn btn-light me-2" onClick={handleVoltar}>
                                                <i className="bi bi-arrow-return-left"></i> Voltar
                                            </button>
                                        </>
                                    )}
                                    <button disabled={!id} type="button" className="btn btn-secondary me-2" onClick={handleUpdate}>
                                        <i className="bi bi-pencil"></i> Editar
                                    </button>
                                    <button disabled={!id} type="button" className="btn btn-danger me-2" onClick={handleDelete}>
                                        <i className="bi bi-trash"></i> Deletar
                                    </button>
                                    {!id && <button type="submit" className="btn btn-primary">
                                        <i className="bi bi-save"></i> Salvar
                                    </button>}
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-md-4">
                                    <label htmlFor="motivoConsulta" className="form-label">Motivo da consulta:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="motivoConsulta"
                                        name="motivoConsulta"
                                        required
                                        minLength="6"
                                        maxLength="60"
                                        value={consultaData.motivoConsulta}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="dataConsulta" className="form-label">Data da consulta:</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="dataConsulta"
                                        name="dataConsulta"
                                        value={consultaData.dataConsulta}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="horarioConsulta" className="form-label">Horário da consulta:</label>
                                    <input
                                        type="time"
                                        className="form-control"
                                        id="horarioConsulta"
                                        name="horarioConsulta"
                                        value={consultaData.horarioConsulta}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-md-12">
                                    <label htmlFor="descricaoProblema" className="form-label">Descrição do Problema:</label>
                                    <textarea
                                        className="form-control"
                                        id="descricaoProblema"
                                        name="descricaoProblema"
                                        required
                                        minLength="15"
                                        maxLength="1000"
                                        rows="10"
                                        value={consultaData.descricaoProblema}
                                        onChange={handleChange}
                                    ></textarea>
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-md-12">
                                    <label htmlFor="medicacaoReceitada" className="form-label">Medicação Receitada:</label>
                                    <textarea
                                        className="form-control"
                                        id="medicacaoReceitada"
                                        name="medicacaoReceitada"
                                        value={consultaData.medicacaoReceitada}
                                        onChange={handleChange}
                                        maxLength="1000"
                                    ></textarea>
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-md-12">
                                    <label htmlFor="dosagemPrecaucoes" className="form-label">Dosagem e Precauções:</label>
                                    <textarea
                                        className="form-control"
                                        id="dosagemPrecaucoes"
                                        name="dosagemPrecaucoes"
                                        required
                                        minLength="15"
                                        maxLength="250"
                                        value={consultaData.dosagemPrecaucoes}
                                        onChange={handleChange}
                                    ></textarea>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Consultas;
