import React, { PureComponent } from 'react';
import { withSnackbar } from 'notistack';
import { post } from '../api/apiHelper';
import { parseResponseError, numberFormat } from '../helpers/helpers';
import './index.css';

// Käyttäjän omat sijoitukset
class Table extends PureComponent {
    sellStock(symbol, company) {
        const { enqueueSnackbar, onSellStock } = this.props;
        post('/api/stocks/sell', { body: JSON.stringify({ symbol }) }, true)
            .then(() => {
                enqueueSnackbar(`Yrityksen ${company} osakkeet myyty onnistuneesti`, { variant: 'success' });
                onSellStock();
            })
            .catch(err => {
                parseResponseError(err, 'Virhe osakkeen myynnissä').then(error => enqueueSnackbar(error.message, { variant: 'error' }));
            });
    }

    render() {
        const { shares } = this.props;

        return (
            <div>
                <h1 id="title">Oma sijoitukset</h1>
                <table id="shares">
                    <tbody>
                        <tr>
                            <th>NIMI</th>
                            <th>MÄÄRÄ</th>
                            <th>ARVO</th>
                            <th>TUOTTO</th>
                        </tr>
                        {shares.map(row => (
                            <tr key={row.symbol}>
                                <td>{row.name}</td>
                                <td>{row.count}</td>
                                <td>{numberFormat(row.totalMarketValue)} €</td>
                                <td>{numberFormat(row.profitPrecentage)} %</td>
                                <td>
                                    <button id="sell" type="submit" onClick={() => this.sellStock(row.symbol, row.name)}>
                                        Myy
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default withSnackbar(Table);
