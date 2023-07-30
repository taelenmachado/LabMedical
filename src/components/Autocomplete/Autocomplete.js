import React, { useState, useEffect } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";

const Autocomplete = ({ id, placeholder, onChange }) => {
    const [options, setOptions] = useState([]);
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {

        const fetchPacientes = async () => {
            try {
                const response = await fetch(`http://localhost:4000/pacientes?q=${inputValue}`);
                if (!response.ok) {
                    throw new Error("Erro ao buscar os pacientes");
                }
                const data = await response.json();
                const options = data.map((value) => ({
                    id: value.id,
                    label: value.nomeCompleto,
                }));
                setOptions(options);
            } catch (error) {
                console.error(error);
            }
        };

        fetchPacientes();
    }, [inputValue]);

    const handleInputChange = (value) => {
        setInputValue(value);
    };

    const handleOnChange = (values) => {
        if(values && values.length > 0){
            onChange(values[0]);
        }
    }

    return (
        <Typeahead
            id={id}
            options={options}
            labelKey="label"
            placeholder={placeholder}
            aria-label={placeholder}
            onChange={handleOnChange}
            onInputChange={handleInputChange}
        />
    );
};

export default Autocomplete;
