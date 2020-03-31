import React from 'react';

const NewPersonForm = ({ onAddPerson, onNameChange, onNumberChange, newName, newNumber }) => {
    return (
        <form onSubmit={onAddPerson}>
            <div>
                Nimi: <input value={newName} onChange={onNameChange} />
            </div>
            <div>
                Numero: <input value={newNumber} onChange={onNumberChange} />
            </div>
            <div>
                <button type="submit">Lisää</button>
            </div>
        </form>
    );
};

export default NewPersonForm;
