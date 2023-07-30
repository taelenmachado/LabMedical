import React, { useState } from 'react';

const useConfirmation = () => {
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState('');
    const [onConfirm, setOnConfirm] = useState(() => { });

    const showConfirm = (message, onConfirmCallback) => {
        console.log("")
        setMessage(message);
        setOnConfirm(() => onConfirmCallback);
        setShow(true);
    };

    const hideConfirm = () => {
        setShow(false);
    };

    const handleConfirm = () => {
        onConfirm();
        hideConfirm();
    };

    <div className="modal-backdrop fade show"></div>
    const ConfirmationModal = () => (
        <>
            <div className={`modal ${show ? 'show' : ''}`} id="exampleModalLive" tabIndex="-1" aria-labelledby="exampleModalLiveLabel" aria-modal="true" role="dialog" style={{ display: show ? 'block' : 'none' }}>
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Confirmação</h5>
                            <button type="button" className="btn btn-secondary" data-dismiss="modal" aria-label="Fechar" onClick={hideConfirm}>
                                <span aria-hidden="true">x</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>{message}</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={hideConfirm}>
                                Cancelar
                            </button>
                            <button type="button" className="btn btn-danger" onClick={handleConfirm}>
                                Excluir
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`${show ? 'modal-backdrop fade show' : ''}`}></div>
        </>
    );

    return {
        showConfirm,
        ConfirmationModal
    };
};

export default useConfirmation;
