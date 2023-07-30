import React, {useEffect} from 'react';
import { useToast } from '../../context/ToastContext';
import useToastMessage from '../../hooks/useToast';


const Message = () => {
    const { toastMessage, id } = useToast();
    const { showToast, ToastMessage } = useToastMessage();

    useEffect(() => {
        if (toastMessage) {
            showToast(toastMessage);
        }
    }, [id]);
    
    return (
        <div>
            {toastMessage && ToastMessage}
        </div>
    );
};

export default Message;