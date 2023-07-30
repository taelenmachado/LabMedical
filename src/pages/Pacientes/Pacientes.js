import React, { useState, useEffect, useRef } from 'react';
import InputMask from 'react-input-mask';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import useCep from '../../hooks/useCep';

import './Pacientes.scss';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import useConfirmation from '../../hooks/useConfirmation';
import { v4 as uuidv4 } from 'uuid';


function Pacientes() {
    const { id } = useParams();
    const { showToast } = useToast();
    const [formData, setFormData] = useState({});
    const { showConfirm, ConfirmationModal } = useConfirmation();
    const navigate = useNavigate();
    const cepInputRef = useRef(null);
    const { cepStatus, fetchCepData } = useCep();
    
    useEffect(() => {
      if (cepStatus && cepStatus.data?.cep) {
        setFormData((prevData) => ({
          ...prevData,
          cep: cepStatus.data.cep,
          cidade: cepStatus.data.localidade,
          estado: cepStatus.data.uf,
          logradouro: cepStatus.data.logradouro,
          bairro: cepStatus.data.bairro,
        }));
      }
    }, [cepStatus]);

    useEffect(() => {
        const fetchPacienteData = async () => {
            try {
                const response = await fetch(`http://localhost:4000/pacientes/${id}`);
                if (!response.ok) {
                    throw new Error('Falha ao buscar os dados do paciente');
                }
                const data = await response.json();
                setFormData(data);
            } catch (error) {
                console.error(error);
            }
        };
        if (id) {
            fetchPacienteData();
        }
    }, [id]);

    const validateForm = () => {
        const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
        if (!cpfRegex.test(formData.cpf)) {
            showToast('CPF inválido. O formato deve ser 000.000.000-00.');
            return false;
        }

        const telefoneRegex = /^\(\d{2}\) \d{4}-\d{5}$/;
        if (!telefoneRegex.test(formData.telefone)) {
            showToast('Telefone inválido. O formato deve ser (99) 99999-9999.');
            return false;
        }

        const contatoEmergenciaRegex = /^\(\d{2}\) \d{4}-\d{5}$/;
        if (!contatoEmergenciaRegex.test(formData.contatoEmergencia)) {
            showToast('Contato de Emergência inválido. O formato deve ser (99) 99999-9999.');
            return false;
        }
        return true;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleCepBlur = (e) => {
      const { value } = e.target;
      if (value && value.length === 8) {
        fetchCepData(value);
      }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if(!validateForm()){
                return;
            }
            const formDataCopy = { ...formData };
            formDataCopy.id = uuidv4();
            formDataCopy.dataCadastro = new Date().getTime();

            const response = await fetch(`http://localhost:4000/pacientes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formDataCopy),
            });

            if (!response.ok) {
                showToast('Falha ao cadastrar os dados do paciente!');
            }
            showToast(`Paciente "${formDataCopy.nomeCompleto}" cadastrado(a) com sucesso!`);
            navigate('/home');
        } catch (error) {
            showToast('Falha ao cadastrar os dados do paciente!');
        }
    };

    const handleUpdate = async (e) => {
        try {

            if(!validateForm()){
                return;
            }

            formData.dataCadastro = new Date().getTime();
            const response = await fetch(`http://localhost:4000/pacientes/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                showToast('Falha ao atualizar os dados do paciente!');
            }
            showToast(`Paciente "${formData.nomeCompleto}" atualizado(a) com sucesso!`);
            navigate('/home');
        } catch (error) {
            showToast('Falha ao atualizar os dados do paciente!');
        }
    };

    const handleDelete = async (e) => {
        showConfirm('Deseja realmente excluir esta consulta?', async () => {
            try {
                const response = await fetch(`http://localhost:4000/pacientes/${id}`, {
                    method: 'DELETE'
                });

                if (!response.ok) {
                    showToast('Falha ao deletar os dados do paciente!');
                }
                showToast(`Paciente "${formData.nomeCompleto}" deletado(a) com sucesso!`);
                navigate('/home');
            } catch (error) {
                showToast('Falha ao deletar os dados do paciente!');
            }
        });
    };

    return (
        <div className="container form-pacientes">
            <ConfirmationModal />
            <div className="d-flex align-items-center mb-4">
                <i className="bi bi-person-vcard-fill fs-1 me-2 align-middle text-blue"></i>
                <h2 className="mb-0 text-blue">Cadastro de Pacientes</h2>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="mb-3 d-flex justify-content-between align-items-center">
                    <h3 className="text-secondary">Identificação</h3>
                    <div>
                        {id && (
                            <Link to={`/prontuarios/${id}`}>
                                <button type="button" className="btn btn-info me-2">
                                    <i className="bi bi-file-earmark-text"></i> Prontuario
                                </button>
                            </Link>
                        )}
                        <>
                            <button disabled={!id} type="button" className="btn btn-secondary me-2" onClick={handleUpdate}>
                                <i className="bi bi-pencil"></i> Editar
                            </button>
                            <button disabled={!id} type="button" className="btn btn-danger me-2" onClick={handleDelete}>
                                <i className="bi bi-trash"></i> Deletar
                            </button>
                        </>
                        {!id && <button type="submit" className="btn btn-primary">
                            <i className="bi bi-save"></i> Salvar
                        </button>}
                    </div>
                </div>
                <div className="toast-container position-fixed bottom-0 end-0 p-3">
                    <div id="liveToast" className="toast" role="alert" aria-live="assertive" aria-atomic="true">
                        <div className="toast-header">
                            <img src="..." className="rounded me-2" alt="..." />
                            <strong className="me-auto">Bootstrap</strong>
                            <small>11 mins ago</small>
                            <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                        </div>
                        <div className="toast-body">
                            Hello, world! This is a toast message.
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-4 mb-3">
                        <label htmlFor="nomeCompleto" className="form-label">Nome Completo *</label>
                        <input
                            type="text"
                            className="form-control"
                            id="nomeCompleto"
                            name="nomeCompleto"
                            value={formData.nomeCompleto}
                            onChange={handleChange}
                            required
                            minLength="5"
                            maxLength="50"
                        />
                    </div>

                    <div className="col-md-4 mb-3">
                        <label htmlFor="genero" className="form-label">Gênero *</label>
                        <select
                            className="form-select"
                            id="genero"
                            name="genero"
                            value={formData.genero}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Selecione o Gênero</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Feminino">Feminino</option>
                            <option value="Outro">Outro</option>
                        </select>
                    </div>

                    <div className="col-md-4 mb-3">
                        <label htmlFor="dataNascimento" className="form-label">Data de Nascimento *</label>
                        <input
                            type="date"
                            className="form-control"
                            id="dataNascimento"
                            name="dataNascimento"
                            value={formData.dataNascimento}
                            onChange={handleChange}
                            required
                        />
                    </div>

                </div>

                <div className="row">
                    <div className="col-md-4 mb-3">
                        <label htmlFor="cpf" className="form-label">CPF *</label>
                        <InputMask
                            mask="999.999.999-99"
                            maskChar=""
                            type="text"
                            className="form-control"
                            id="cpf"
                            name="cpf"
                            value={formData.cpf}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="col-md-4 mb-3">
                        <label htmlFor="rg" className="form-label">RG com Órgão Expedidor *</label>
                        <input
                            type="text"
                            className="form-control"
                            id="rg"
                            name="rg"
                            value={formData.rg}
                            onChange={handleChange}
                            required
                            maxLength="20"
                        />
                    </div>

                    <div className="col-md-4 mb-3">
                        <label htmlFor="estadoCivil" className="form-label">Estado Civil *</label>
                        <select
                            className="form-select"
                            id="estadoCivil"
                            name="estadoCivil"
                            value={formData.estadoCivil}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Selecione o Estado Civil</option>
                            <option value="Solteiro(a)">Solteiro(a)</option>
                            <option value="Casado(a)">Casado(a)</option>
                            <option value="Divorciado(a)">Divorciado(a)</option>
                            <option value="Viúvo(a)">Viúvo(a)</option>
                        </select>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-4 mb-3">
                        <label htmlFor="telefone" className="form-label">Telefone *</label>
                        <InputMask
                            mask="(99) 9999-99999"
                            maskChar=""
                            type="text"
                            className="form-control"
                            id="telefone"
                            name="telefone"
                            value={formData.telefone}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="col-md-4 mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-4 mb-3">
                        <label htmlFor="naturalidade" className="form-label">Naturalidade *</label>
                        <input
                            type="naturalidade"
                            className="form-control"
                            id="naturalidade"
                            name="naturalidade"
                            value={formData.naturalidade}
                            onChange={handleChange}
                            minLength={5}
                            maxLength={50}
                            required
                        />
                    </div>
                </div>


                <div className="row">
                    <div className="col-md-4 mb-3">
                        <label htmlFor="contatoEmergencia" className="form-label">Contato de Emergência *</label>
                        <InputMask
                            mask="(99) 9999-99999"
                            maskChar=""
                            type="text"
                            className="form-control"
                            id="contatoEmergencia"
                            name="contatoEmergencia"
                            value={formData.contatoEmergencia}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="col-md-4 mb-3">
                        <label htmlFor="alergias" className="form-label">Alergias</label>
                        <input
                            type="alergias"
                            className="form-control"
                            id="alergias"
                            name="alergias"
                            value={formData.alergias}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-4 mb-3">
                        <label htmlFor="cuidadosEspecificos" className="form-label">Lista de Cuidados Específicos</label>
                        <input
                            type="cuidadosEspecificos"
                            className="form-control"
                            id="cuidadosEspecificos"
                            name="cuidadosEspecificos"
                            value={formData.cuidadosEspecificos}
                            onChange={handleChange}
                        />
                    </div>
                </div>


                <div className="mb-3">
                    <h5 className='mt-2 mb-4 text-secondary border_bottom'>Convênio</h5>
                </div>

                <div className="row">
                    <div className="col-md-4 mb-3">
                        <label htmlFor="convenio" className="form-label">Convênio</label>
                        <input
                            type="text"
                            className="form-control"
                            id="convenio"
                            name="convenio"
                            value={formData.convenio}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-4 mb-3">
                        <label htmlFor="numeroConvenio" className="form-label">Número do Convênio</label>
                        <input
                            type="text"
                            className="form-control"
                            id="numeroConvenio"
                            name="numeroConvenio"
                            value={formData.numeroConvenio}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-4 mb-3">
                        <label htmlFor="validadeConvenio" className="form-label">Validade do Convênio</label>
                        <input
                            type="date"
                            className="form-control"
                            id="validadeConvenio"
                            name="validadeConvenio"
                            value={formData.validadeConvenio}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="mb-3">
                    <h5 className='mt-2 mb-4 text-secondary border_bottom'>Endereço</h5>
                </div>

                <div className="row">
                <div className="col-md-4 mb-3">
                  <label htmlFor="cep" className="form-label">CEP</label>
                  <input
                    type="text"
                    className="form-control"
                    id="cep"
                    name="cep"
                    value={formData.cep || ''}
                    onChange={handleChange}
                    onBlur={handleCepBlur}
                    ref={cepInputRef}
                    autoComplete="off"
                  />
                </div>

                    <div className="col-md-4 mb-3">
                        <label htmlFor="cidade" className="form-label">Cidade</label>
                        <input
                            type="text"
                            className="form-control"
                            id="cidade"
                            name="cidade"
                            value={formData.cidade}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-4 mb-3">
                        <label htmlFor="estado" className="form-label">Estado</label>
                        <input
                            type="text"
                            className="form-control"
                            id="estado"
                            name="estado"
                            value={formData.estado}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-8 mb-3">
                        <label htmlFor="logradouro" className="form-label">Logradouro</label>
                        <input
                            type="text"
                            className="form-control"
                            id="logradouro"
                            name="logradouro"
                            value={formData.logradouro}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-4 mb-3">
                        <label htmlFor="numero" className="form-label">Número</label>
                        <input
                            type="text"
                            className="form-control"
                            id="numero"
                            name="numero"
                            value={formData.numero}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-8 mb-3">
                        <label htmlFor="complemento" className="form-label">Complemento</label>
                        <input
                            type="text"
                            className="form-control"
                            id="complemento"
                            name="complemento"
                            value={formData.complemento}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-4 mb-3">
                        <label htmlFor="bairro" className="form-label">Bairro</label>
                        <input
                            type="text"
                            className="form-control"
                            id="bairro"
                            name="bairro"
                            value={formData.bairro}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-12 mb-3">
                        <label htmlFor="pontoReferencia" className="form-label">Ponto de Referência</label>
                        <input
                            type="text"
                            className="form-control"
                            id="pontoReferencia"
                            name="pontoReferencia"
                            value={formData.pontoReferencia}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    {cepStatus && cepStatus.loading && <p>Carregando dados do CEP...</p>}
                    {cepStatus && cepStatus.error && <p>Erro ao buscar dados do CEP: {cepStatus.error}</p>}
                  </div>
                </div>
            </form>
        </div>
    );
}

export default Pacientes;
