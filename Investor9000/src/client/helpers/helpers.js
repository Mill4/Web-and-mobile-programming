const parseResponseError = (err, fallbackMessage) =>
    err.response
        ? err.response.json().then(responseBody => {
              return responseBody;
          })
        : Promise.resolve({ message: fallbackMessage });

const numberFormat = value => {
    return Number.parseFloat(value).toFixed(2);
};

module.exports = { parseResponseError, numberFormat };
