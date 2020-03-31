import React from 'react';
import moment from 'moment';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withSnackbar } from 'notistack';
import Increment from './Increment';

import { post } from '../api/apiHelper';
import { parseResponseError, numberFormat } from '../helpers/helpers';

const PlusIcon = () => {
    return (
        <span className="panel__header-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16">
                <path fill="currentColor" d="M14,7H9V2A1,1,0,0,0,7,2V7H2A1,1,0,0,0,2,9H7v5a1,1,0,0,0,2,0V9h5a1,1,0,0,0,0-2Z" />
            </svg>
        </span>
    );
};

const MinusIcon = () => {
    return (
        <span className="panel__header-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16">
                <path fill="currentColor" d="M14,9H2A1,1,0,0,1,2,7H14a1,1,0,0,1,0,2Z" />
            </svg>
        </span>
    );
};

const PanelHeader = props => {
    const { handleToggle, isExpanded, children } = props;
    return (
        <button type="button" className="panel__header" onClick={handleToggle} aria-expanded={isExpanded}>
            {children}
            {isExpanded ? <MinusIcon /> : <PlusIcon />}
        </button>
    );
};

const PanelBody = props => {
    const { children, isExpanded } = props;
    return (
        <div className="panel__body" aria-hidden={isExpanded}>
            {children}
        </div>
    );
};

class Panel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isExpanded: props.openDefault,
            stockCount: 1,
        };

        this.handleToggle = this.handleToggle.bind(this);
        this.buyStock = this.buyStock.bind(this);
    }

    updateStockCount = value => {
        this.setState({ stockCount: value });
    };

    handleToggle() {
        const { isExpanded } = this.state;
        this.setState({
            isExpanded: !isExpanded,
        });
    }

    buyStock() {
        const { symbol, company, enqueueSnackbar, onBuyStock } = this.props;
        const { stockCount } = this.state;
        post('/api/stocks/buy', { body: JSON.stringify({ symbol, stockCount }) }, true)
            .then(() => {
                enqueueSnackbar(`${stockCount} osaketta yritykseltä ${company} ostettu onnistuneesti`, { variant: 'success' });
                onBuyStock();
            })
            .catch(err => {
                parseResponseError(err, 'Virhe ostaessa osaketta').then(error => enqueueSnackbar(error.message, { variant: 'error' }));
            });
    }

    render() {
        const { isExpanded, stockCount } = this.state;
        const { company, price, lastUpdated } = this.props;
        const date = moment(lastUpdated);
        const formprice = numberFormat(price);
        return (
            <div className="panel">
                <PanelHeader handleToggle={this.handleToggle} isExpanded={isExpanded}>
                    {company}
                </PanelHeader>
                <PanelBody isExpanded={!isExpanded}>
                    <Typography component="h5">
                        Hinta: {formprice} € <br /> Viimeksi päivitetty: {date.format('DD-MM-YYYY HH:mm')}
                    </Typography>
                    <Increment min={1} max={100} onChangeStockCount={this.updateStockCount} />
                    <Typography component="h5">
                        {stockCount} x {formprice} € = {numberFormat(stockCount * formprice)} €
                    </Typography>
                    <Button id="verify" type="submit" onClick={this.buyStock}>
                        Vahvista osto
                    </Button>
                </PanelBody>
            </div>
        );
    }
}

export default withSnackbar(Panel);
