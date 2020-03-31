import React, { useState } from 'react';
import { TextField, Button } from '@material-ui/core';
import { useHistory, useLocation, Link } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { post } from '../api/apiHelper';
import { parseResponseError } from '../helpers/helpers';
import './index.css';
import Header from './Header';

function Register() {
    const history = useHistory();
    const location = useLocation();
    const { enqueueSnackbar } = useSnackbar();

    const [inputs, setInputs] = useState({
        firstname: '',
        lastname: '',
        username: '',
        password: '',
        confirmPassword: '',
    });
    const { username, password, firstname, lastname, confirmPassword } = inputs;

    const handleRegister = e => {
        // disabloidaan default event, eli sivun täysi refresh
        e.preventDefault();

        if ((username === '', password === '', firstname === '', lastname === '', confirmPassword === '')) {
            enqueueSnackbar('Täytä kaikki kentät', { variant: 'warning' });
            return;
        }

        if (password === confirmPassword) {
            post('/api/auth/reqister', { body: JSON.stringify({ username, password, firstname, lastname }) }, false)
                .then(() => {
                    const { from } = location.state || { from: { pathname: '/' } };
                    history.replace(from);
                })
                .catch(err => {
                    parseResponseError(err, 'Virhe rekisteröinnissä').then(error => enqueueSnackbar(error.message, { variant: 'error' }));
                });
        } else {
            enqueueSnackbar('Salasanat eivät ole samat!', { variant: 'error' });
        }
    };

    function handleChange(e) {
        const { name, value } = e.target;
        setInputs(input => ({ ...input, [name]: value }));
    }

    return (
        <div>
            <Header header="Investor9000" />
            <div className="center">
                <p>Syötä tiedot. Tähdellä merkatut kentät ovat pakollisia.</p>
            </div>
            <form noValidate autoComplete="off">
                <TextField id="firstname" name="firstname" label="Etunimi" onChange={handleChange} required />
                <br />
                <TextField id="lastname" name="lastname" label="Sukunimi" onChange={handleChange} required />
                <br />
                <TextField id="username" name="username" label="Käyttäjänimi" value={username} onChange={handleChange} required />
                <br />
                <TextField id="password" name="password" label="Salasana" type="password" value={password} onChange={handleChange} minLength="8" required />
                <br />
                <TextField
                    id="confirmPassword"
                    name="confirmPassword"
                    label="Vahvista salasana"
                    type="password"
                    minLength="8"
                    onChange={handleChange}
                    required
                />
                <br />
                <Button type="submit" variant="contained" onClick={handleRegister}>
                    Luo tunnukset
                </Button>
                <Link to="/login">Kirjaudu täältä, jos sinulla on jo tunnukset</Link>
            </form>
        </div>
    );
}

export default Register;
