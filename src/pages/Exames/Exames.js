import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Autocomplete from '../../components/Autocomplete/Autocomplete';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '../../context/ToastContext';
import { getFormattedDate, getFormattedTime } from "../../utils/DateUtils";
import useConfirmation from '../../hooks/useConfirmation';


const Exames = () => {
    const { idPaciente, id } = useParams();
    const navigate = useNavigate();
    const { showConfirm, ConfirmationModal } = useConfirmation();
    const { showToast } = useToast();

    const [pacienteData, setPacienteData] = useState({});
    const [exameData, setExameData] = useState({
        dataExame: getFormattedDate(),
        horarioExame: getFormattedTime(),
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
        const fetchExameData = async () => {
            try {
                const response = await fetch(`http://localhost:4000/exames/${id}`);
                if (!response.ok) {
                    throw new Error('Falha ao buscar os dados do exame');
                }
                const data = await response.json();
                setExameData(data);
            } catch (error) {
                console.error(error);
            }
        };
        if (id) {
            fetchExameData();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setExameData((prevData) => ({ ...prevData, [name]: value }));
    };

    const validateForm = () => {
        if (exameData.resultado.length < 15 || exameData.resultado.length > 1000) {
            showToast('O Resultado do Exame deve conter entre 15 e 1000 caracteres.');
            return false;
        }
        return true;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            if(!validateForm()){
                return;
            }

            const exameDataCopy = { ...exameData };
            exameDataCopy.id = uuidv4();
            exameDataCopy.dataCadastro = getFormattedDate();
            exameDataCopy.idPaciente = pacienteData.id;
            exameDataCopy.nomeCompleto = pacienteData.nomeCompleto;

            const response = await fetch(`http://localhost:4000/exames`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(exameDataCopy),
            });

            if (!response.ok) {
                showToast('Falha ao cadastrar exame do paciente!');
            }

            showToast(`Exame do paciente "${pacienteData.nomeCompleto}" cadastrada com sucesso!`);
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
            
            const exameDataCopy = { ...exameData };
            exameDataCopy.idPaciente = idPaciente;
            exameDataCopy.dataCadastro = getFormattedDate();
            exameDataCopy.nomeCompleto = pacienteData.nomeCompleto;

            const response = await fetch(`http://localhost:4000/exames/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(exameDataCopy),
            });

            if (!response.ok) {
                showToast('Falha ao atualizar exame do paciente!');
            }
            showToast(`Exame do paciente "${pacienteData.nomeCompleto}" atualizada com sucesso!`);
            navigate('/home');
        } catch (error) {
            console.error(error);
        }
    }

    const handleDelete = async (e) => {

        showConfirm('Deseja realmente excluir este exame?', async () => {
            try {

                const response = await fetch(`http://localhost:4000/exames/${id}`, {
                    method: 'DELETE'
                });

                if (!response.ok) {
                    showToast('Falha ao deletar os dados do paciente!');
                }

                showToast(`Exame do paciente "${pacienteData.nomeCompleto}" deletado com sucesso!`);
                navigate('/home');
            } catch (error) {
                showToast('Falha ao deletar o exame do paciente!');
            }
        });
    };

    const onSelect = (paciente) => {
        navigate(`/pacientes/${paciente.id}/exames`);
    }

    return (
        <div className="container">
            <ConfirmationModal />
            <div className="row">
                <div className="col-md-12">
                    <div className="d-flex align-items-center mb-4">
                        <i className="bi bi-clipboard-pulse fs-1 me-2 text-blue align-middle"></i>
                        <h2 className="mb-0 text-blue">Cadastro de Exame</h2>
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
                                <span className="text-blue fw-bold fs-4">Exame para: {pacienteData && pacienteData.nomeCompleto}</span>
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
                                    <label htmlFor="nomeExame" className="form-label">Nome do exame:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="nomeExame"
                                        name="nomeExame"
                                        required
                                        minLength="6"
                                        maxLength="60"
                                        value={exameData.nomeExame}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="dataExame" className="form-label">Data do exame:</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="dataExame"
                                        name="dataExame"
                                        value={exameData.dataExame}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="horarioExame" className="form-label">Horário do exame:</label>
                                    <input
                                        type="time"
                                        className="form-control"
                                        id="horarioExame"
                                        name="horarioExame"
                                        value={exameData.horarioExame}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="row mb-3">

                                <div className="col-md-8 mb-3">
                                    <label htmlFor="tipoExame" className="form-label">Tipo do Exame</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="tipoExame"
                                        name="tipoExame"
                                        value={exameData.tipoExame}
                                        onChange={handleChange}
                                        required
                                        minLength="5"
                                        maxLength="30"
                                    />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label htmlFor="laboratorio" className="form-label">Laboratório</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="laboratorio"
                                        name="laboratorio"
                                        value={exameData.laboratorio}
                                        onChange={handleChange}
                                        required
                                        minLength="5"
                                        maxLength="30"
                                    />
                                </div>
                            </div>


                            <div className="row mb-3">
                                <div className="col-md-12">
                                    <label htmlFor="urlDocumento" className="form-label">URL do documento do Exame:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="urlDocumento"
                                        name="urlDocumento"
                                        value={exameData.urlDocumento}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-md-12">
                                    <label htmlFor="resultado" className="form-label">Resultado do Exame:</label>
                                    <textarea
                                        className="form-control"
                                        id="resultado"
                                        name="resultado"
                                        required
                                        minLength="15"
                                        maxLength="1000"
                                        rows="10"
                                        value={exameData.resultado}
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

export default Exames;
