import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import { withSnackbar } from 'notistack';
import moment from 'moment';
import { get } from '../api/apiHelper';
import './index.css';
import Header from './Header';
import User from './User';
import Sharetable from './Sharetable';
import Market from './Market';
import { parseResponseError, numberFormat } from '../helpers/helpers';

class StockExhanges extends Component {
    constructor() {
        super();
        this.state = {
            firstname: '',
            lastname: '',
            balance: 0,
            capital: 0,
            development: 0,
            stocks: [],
            shares: [],
        };

        this.countCapitalAndDevelopment = this.countCapitalAndDevelopment.bind(this);
        this.fetchDataFromBackend = this.fetchDataFromBackend.bind(this);
        this.updateState = this.updateState.bind(this);
    }

    async componentDidMount() {
        await this.fetchDataFromBackend();
        this.countCapitalAndDevelopment();
    }

    fetchDataFromBackend = async () => {
        await Promise.all([
            get('/api/userData', null, true)
                .then(result =>
                    this.setState({
                        firstname: result.firstname,
                        lastname: result.lastname,
                        balance: result.balance,
                    }),
                )
                .catch(err => {
                    parseResponseError(err, 'Virhe hakiessa käyttäjän tietoja').then(error => console.log(error));
                }),
            get('/api/stocks', null, true)
                .then(result =>
                    this.setState({
                        stocks: result,
                    }),
                )
                .catch(err => {
                    parseResponseError(err, 'Virhe hakiessa tietoja osakkeista').then(error => console.log(error));
                }),
            get('/api/stocks/userAssets', null, true).then(result => {
                this.setState({ shares: result });
            }),
        ]);
    };

    countCapitalAndDevelopment = () => {
        const { shares, balance } = this.state;
        let buyPriceTotal = 0;
        let marketValueTotal = 0;
        shares.forEach(share => {
            buyPriceTotal += share.totalBuyPrice;
            marketValueTotal += share.totalMarketValue;
        });

        this.setState({ capital: marketValueTotal + balance, development: (marketValueTotal / buyPriceTotal) * 100 - 100 });
    };

    updateState = async () => {
        await this.fetchDataFromBackend();
        this.countCapitalAndDevelopment();
    };

    countCapitalAndDevelopment = () => {
        const { shares, balance } = this.state;
        let buyPriceTotal = 0;
        let marketValueTotal = 0;

        shares.forEach(share => {
            buyPriceTotal += share.totalBuyPrice;
            marketValueTotal += share.totalMarketValue;
        });

        console.log(shares);

        this.setState({ capital: marketValueTotal + balance, development: (marketValueTotal / buyPriceTotal) * 100 - 100 });
    };

    render() {
        const { firstname, lastname, balance, capital, development, stocks, shares } = this.state;
        const today = moment().format('DD-MM-YYYY');

        return (
            <div>
                <Header header="Investor9000" />

                <User
                    firstname={firstname}
                    lastname={lastname}
                    balance={numberFormat(balance)}
                    date={today}
                    capital={numberFormat(capital)}
                    percent={numberFormat(development)}
                />
                <Sharetable shares={shares} onSellStock={this.updateState} />
                <div className="wrapper">
                    {stocks ? (
                        stocks.map(row => (
                            <Market
                                key={row.symbol}
                                company={row.company_name}
                                symbol={row.symbol}
                                price={row.current_price}
                                lastUpdated={row.timestamp}
                                onBuyStock={this.updateState}
                            />
                        ))
                    ) : (
                        <Typography variant="h4">Loading...</Typography>
                    )}
                </div>
            </div>
        );
    }
}
export default withSnackbar(StockExhanges);
