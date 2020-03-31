import React from 'react';
import './index.css';
import Button from '@material-ui/core/Button';
import { get } from '../api/apiHelper';
import history from './history';

// Käyttäjän nimi, pääoma ja kehitys
const User = ({ firstname, lastname, capital, date, percent, balance }) => {
    return (
        <section>
            <p>
                {firstname} {lastname} <br />
                {date}
            </p>
            <div className="mydiv">
                <h1>
                    Pääoma <br />
                    {capital} €
                </h1>
            </div>
            <div className="mydiv">
                <h1>
                    Kehitys <br />
                    {percent} %
                </h1>
            </div>
            <div className="mydiv">
                <h1>
                    Saldo <br />
                    {balance} €
                </h1>
            </div>
            <Button
                variant="contained"
                onClick={e => {
                    e.preventDefault();
                    get(`/api/auth/logout`, null, true).then(history.push('/login'));
                }}
            >
                Logout
            </Button>
        </section>
    );
};

export default User;
