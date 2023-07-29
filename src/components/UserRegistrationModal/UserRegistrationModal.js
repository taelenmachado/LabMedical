import React, { useState } from 'react';

const UserRegistrationModal = ({ showModal, setShowModal, onRegister }) => {
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [registrationError, setRegistrationError] = useState('');

    const handleRegistration = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setRegistrationError('As senhas não coincidem.');
            return;
        }

        await onRegister(newEmail, newPassword);

        setShowModal(false);
    };

    return (
        showModal && (
            <>
                <div className="modal" style={{ display: showModal ? 'block' : 'none' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Cadastro de Usuário</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                {registrationError && <div className="alert alert-danger">{registrationError}</div>}
                                <form onSubmit={handleRegistration}>
                                    <div className="mb-3">
                                        <label htmlFor="newEmail" className="form-label">E-mail</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="newEmail"
                                            name="newEmail"
                                            required
                                            value={newEmail}
                                            onChange={(e) => setNewEmail(e.target.value)}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="newPassword" className="form-label">Senha</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="newPassword"
                                            name="newPassword"
                                            minLength="8"
                                            required
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="confirmPassword" className="form-label">Confirmar Senha</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            minLength="8"
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                    </div>

                                    <div className="modal-footer">
                                        <button type="submit" className="btn btn-primary">Cadastrar</button>
                                        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`${showModal ? 'modal-backdrop fade show' : ''}`}></div>
            </>
        )
    );
};

export default UserRegistrationModal;
