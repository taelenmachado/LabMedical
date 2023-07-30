const Card = ({ icon, label, value, className }) => {
    return (
        <div className={className}>
            <div className="card">
                <div className="card-body">
                    <h4 className="card-title"><i className={`fs-1 bi ${icon}`}></i> {value}</h4>
                    <p className="card-text">{label}</p>
                </div>
            </div>
        </div >
    );
};

export default Card;
