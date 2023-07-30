import { Link } from 'react-router-dom';

const calcularIdade = (dataNascimento) => {
    const dataAtual = new Date();
    const partesDataNascimento = dataNascimento.split('-');
    const dataNascimentoObj = new Date(partesDataNascimento[0], partesDataNascimento[1] - 1, partesDataNascimento[2]);
    const diferencaMilissegundos = dataAtual - dataNascimentoObj;
    const anos = Math.floor(diferencaMilissegundos / (1000 * 60 * 60 * 24 * 365));
    return anos;
  }

const Card = ({ paciente, className }) => {
    return (
        <div className={className}>
            <div className="card">
                <div className="card-body">
                    <h4 className="card-title"><i className={`fs-1 bi bi-person-circle`}></i> {paciente.nomeCompleto}</h4>
                    <div className="mt-4 ">
                        <p><span className="fw-bold">Idade: </span> {calcularIdade(paciente.dataNascimento)}</p>
                        <p><span className="fw-bold">Convênio: </span> {paciente.convenio}</p>
                        <p><span className="fw-bold">Telefone: </span> {paciente.telefone}</p>
                        <div className="text-center">
                            <Link to={`/pacientes/${paciente.id}`} className="btn btn-sm btn-primary btn-warning"><i className="bi bi-file-earmark-person"></i> Ver mais </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Card;
