import { useState, useEffect } from 'react';

export default function useCep() {
    const [cepStatus, setCepStatus] = useState({ loading: false, data: null, error: null });

    const fetchCepData = async (cep) => {
        try {
            setCepStatus({ loading: true, data: null, error: null });

            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            if (!response.ok) {
                throw new Error('Erro ao buscar dados do CEP');
            }

            const data = await response.json();
            setCepStatus({ loading: false, data, error: null });
        } catch (error) {
            setCepStatus({ loading: false, data: null, error: error.message });
        }
    };

    return { cepStatus, fetchCepData };
}
