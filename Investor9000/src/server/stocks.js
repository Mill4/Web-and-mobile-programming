const { logger } = require('./logger');
const pool = require('./database');

const getStocksFromDatabase = async () => {
    let conn;
    try {
        conn = await pool.getConnection();
        const companies = await conn.query('SELECT * FROM stock_prices;');

        const filtered = companies.filter(company => typeof company.current_price === 'number');

        return filtered;
    } catch (err) {
        logger.error(`Error in getting stocks: ${err}`);
        throw new Error(`Error in getting stocks: ${err}`);
    } finally {
        if (conn) {
            conn.end();
        }
    }
};

const buyStock = async (username, symbol, amount) => {
    const conn = await pool.getConnection();
    const stock = await conn.query('SELECT * FROM stock_prices WHERE symbol = ?;', [symbol]);
    const userBalance = await conn.query('SELECT balance FROM users WHERE username = ?;', [username]);

    const { current_price: price, company_name: name } = stock[0];
    const totalPrice = price * amount;

    const { balance } = userBalance[0];
    const newUserBalance = balance - totalPrice;

    if (newUserBalance < 0) {
        throw new Error('Käytössä olevat varat eivät riitä');
    }
    await conn.query('UPDATE users SET balance = ? WHERE username = ?', [newUserBalance, username]);

    await conn.query('INSERT INTO bought_stocks(username, company_symbol, company_name, stock_count, price) VALUES (?,?,?,?,?)', [
        username,
        symbol,
        name,
        amount,
        price,
    ]);

    conn.end();
};

const sellStock = async (username, symbol) => {
    let conn;
    let queryResults = [];
    try {
        conn = await pool.getConnection();
        queryResults = await conn.query(
            'SELECT stock_count, current_price FROM bought_stocks, stock_prices WHERE symbol = company_symbol AND username = ? AND symbol = ?;',
            [username, symbol],
        );

        let totalValue = 0;
        queryResults.forEach(queryResult => {
            const { stock_count: count, current_price: currentPrice } = queryResult;
            totalValue += count * currentPrice;
        });

        await conn.query('UPDATE users SET balance = balance + ? WHERE username = ?', [totalValue, username]);

        await conn.query('DELETE FROM bought_stocks WHERE username = ? AND company_symbol = ?', [username, symbol]);
    } catch (err) {
        logger.error(`Error in getting user assets for company ${symbol}: ${err}`);
        throw new Error(`Error in getting user assets for company ${symbol}`);
    } finally {
        if (conn) {
            conn.end();
        }
    }
};

const getUserAssets = async username => {
    let conn;
    let queryResults = [];
    try {
        conn = await pool.getConnection();
        queryResults = await conn.query(
            'SELECT company_symbol, bought_stocks.company_name, stock_count, price, current_price FROM bought_stocks, stock_prices WHERE symbol = company_symbol AND username = ?;',
            [username],
        );
    } catch (err) {
        logger.error(`Error in getting user assets`);
        throw new Error(`Error in getting user assets ${err}`);
    } finally {
        if (conn) {
            conn.end();
        }
    }

    const assets = [];
    queryResults.forEach(queryResult => {
        const { company_symbol: symbol, company_name: name, stock_count: count, current_price: currentPrice, price } = queryResult;

        const totalBuyPrice = count * price;
        const totalMarketValue = count * currentPrice;
        const profitPrecentage = (totalMarketValue / totalBuyPrice) * 100 - 100;

        const foundIndex = assets.findIndex(asset => asset.symbol === symbol);

        if (foundIndex >= 0) {
            const { totalBuyPrice: foundBuyPrice, totalMarketValue: foundMarketValue } = assets[foundIndex];

            const newBuyPrice = foundBuyPrice + totalBuyPrice;
            const newMarketValue = foundMarketValue + totalMarketValue;

            assets[foundIndex].count += count;
            assets[foundIndex].totalBuyPrice = newBuyPrice;
            assets[foundIndex].totalMarketValue = newMarketValue;
            assets[foundIndex].profitPrecentage = (newMarketValue / newBuyPrice) * 100 - 100;
        } else {
            assets.push({ symbol, name, count, totalMarketValue, totalBuyPrice, profitPrecentage });
        }
    });

    return assets;
};

module.exports = { getStocksFromDatabase, buyStock, sellStock, getUserAssets };
