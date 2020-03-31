const querystring = require('querystring');
const axiosBase = require('axios');
const config = require('../config/config');

const axios = axiosBase.create({
    baseURL: 'https://finnhub.io',
    headers: { 'Content-Type': 'application/json' },
});

const makeAxiosRequest = async url => {
    const result = await axios.get(url);
    const { data } = result;

    return data;
};

/**
 * @param {string} url kyselyURL, esim /stock/exchange
 * @param {Object} params kyselyyn liitettävät parametrit
 */
const getDataFromFinnhub = (url, params) => {
    const urlWithParams = `/api/v1${url}?token=${config.finnhubKey}&${querystring.stringify(params) || ''}`;
    return makeAxiosRequest(urlWithParams);
};

module.exports = {
    getDataFromFinnhub,
};
