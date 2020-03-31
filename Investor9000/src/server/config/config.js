require('dotenv').config();

module.exports = {
    finnhubKey: process.env.FINNHUB_KEY,
    jwtTokenSecret: process.env.JWT_TOKEN_SECRET,
    database: {
        host: process.env.DB_HOST,
        name: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    },
    hashSaltRounds: 15,
    defaultBalance: 10000,
};
