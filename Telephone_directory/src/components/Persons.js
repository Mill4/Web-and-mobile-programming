import React from 'react';

const Persons = ({ persons, onRemovePerson }) => {
    return (
        <table>
            <tbody>
                {persons.map(person => (
                    <Person key={person.name} person={person} onRemovePerson={onRemovePerson} />
                ))}
            </tbody>
        </table>
    );
};

const Person = ({ person, onRemovePerson }) => {
    return (
        <tr>
            <td>{person.name}</td>
            <td>{person.number}</td>
            <td>
                <button onClick={event => onRemovePerson(person.id, event)}>remove</button>
            </td>
        </tr>
    );
};

export default Persons;
