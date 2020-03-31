/* eslint-disable no-await-in-loop */
const { CronJob } = require('cron');
const { logger } = require('./logger');
const pool = require('./database');
const FinnHub = require('./api/finnhub');

const getCompaniesFromDatabase = async () => {
    let conn;
    try {
        conn = await pool.getConnection();
        const companies = await conn.query('SELECT symbol FROM stock_prices;');
        const symbols = companies.map(entry => {
            return entry.symbol;
        });
        return symbols;
    } catch (err) {
        logger.error(`Error in getting symbols: ${err}`);
        throw new Error(`Error in getting symbols: ${err}`);
    } finally {
        if (conn) {
            conn.end();
        }
    }
};

const updatePrices = async () => {
    logger.info('Started to update prices');

    const symbols = await getCompaniesFromDatabase();

    const calls = [];
    for (let i = 0; i < symbols.length; i += 1) {
        const promiseCall = new Promise(resolve => {
            setTimeout(() => {
                FinnHub.getDataFromFinnhub('/quote', { symbol: symbols[i] })
                    .then(result => {
                        logger.trace(result);
                        if (!result.t) {
                            resolve(null);
                        } else {
                            const arr = [];
                            arr.push(result.c, symbols[i]);
                            resolve(arr);
                        }
                    })
                    .catch(err => {
                        logger.debug(`Request to finnhub failed for company ${symbols[i]}: ${err}`);
                        resolve(null);
                    });
            }, 2000 * i);
        });
        calls.push(promiseCall);
    }

    const results = await Promise.all(calls);

    const filteredResults = results.filter(el => {
        return el != null;
    });

    const conn = await pool.getConnection();
    conn.beginTransaction(); // Aloittaa batch transaction
    try {
        conn.batch(`UPDATE stock_prices SET current_price = ?, timestamp = NOW() WHERE symbol = ?;`, filteredResults);
        conn.commit();
    } catch (err) {
        logger.error(`Error in inserting stock prices to the database: ${err}`);
        conn.rollback(); // errortarkistus
    }
    logger.info('Done');
};

const updateCompanies = async () => {
    logger.info('Adding companies to database.');

    const companies = await FinnHub.getDataFromFinnhub('/stock/symbol', { exchange: 'HE' });

    const fetchedSymbols = companies.map(entry => {
        return entry.symbol;
    });

    const fetchedCompanies = companies.map(entry => {
        return [entry.symbol, entry.description];
    });

    const oldCompanies = await getCompaniesFromDatabase();
    const newCompanies = fetchedSymbols.filter(symbol => !oldCompanies.includes(symbol));
    const outdatedCompanies = oldCompanies.filter(symbol => !fetchedSymbols.includes(symbol));

    const conn = await pool.getConnection();
    conn.beginTransaction(); // Aloittaa batch transaction
    try {
        conn.batch(`INSERT IGNORE INTO stock_prices (symbol, company_name) VALUES (?,?);`, fetchedCompanies);
        if (outdatedCompanies.length >= 1) {
            conn.batch(`DELETE FROM stock_prices WHERE symbol = (?);`, outdatedCompanies);
        }
        await conn.commit();
    } catch (err) {
        logger.error(`Error in inserting companies to the database: ${err}`);
        conn.rollback(); // errortarkistus
    }
    logger.info(`${fetchedCompanies.length} companies in databse: ${newCompanies.length} New, ${oldCompanies.length} Old, ${outdatedCompanies.length} deleted`);
    updatePrices();
};

const initializeDatabase = async () => {
    const conn = await pool.getConnection();
    try {
        await conn.query(`CREATE TABLE IF NOT EXISTS users (
            username VARCHAR(56) NOT NULL DEFAULT '',
            password TEXT NOT NULL DEFAULT '',
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            balance FLOAT NOT NULL DEFAULT 10000,
            PRIMARY KEY (username)
        )`);
        await conn.query(`CREATE TABLE IF NOT EXISTS stock_prices (
            symbol VARCHAR(50) NOT NULL,
            company_name VARCHAR(50) NOT NULL,
            current_price FLOAT NULL DEFAULT NULL,
            timestamp TIMESTAMP NULL DEFAULT NULL,
            PRIMARY KEY (symbol)
        )`);
        conn.query(`CREATE TABLE IF NOT EXISTS bought_stocks (
            username VARCHAR(56) NOT NULL,
            company_symbol VARCHAR(50) NOT NULL,
            company_name VARCHAR(50) NOT NULL,
            stock_count INT(11) NOT NULL DEFAULT 0,
            price FLOAT NOT NULL DEFAULT 0,
            INDEX FK_bought_stocks_users (username) USING BTREE,
            CONSTRAINT FK_bought_stocks_users FOREIGN KEY (username) REFERENCES investor.users (username) ON UPDATE RESTRICT ON DELETE RESTRICT
        )`);
        conn.end();
    } catch (err) {
        logger.error(`Error in creating new tables: ${err}`);
        conn.rollback();
    }
    // FIXME: poista tämä kommentista tuotantoon mentäessä
    // await updateCompanies();
};

// Cron jobi joka pyörii joka 20 minuutti
const job = new CronJob(
    '0 */20 * * * *',
    async () => {
        await updateCompanies();
    },
    null,
    true,
    'Europe/Helsinki',
);

exports.job = job;
exports.updateCompanies = updateCompanies;
exports.initializeDatabase = initializeDatabase;
