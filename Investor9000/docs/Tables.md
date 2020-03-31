users

```JS
{
    id: 33,
    username: 'Sampooo',
    password: 'dasdas',
    first_name: 'Sampo',
    last_name: 'Sijoittaja',
    balance: '680',
}
```

SQL query:

```SQL
CREATE TABLE `users` (
	`username` VARCHAR(56) NOT NULL DEFAULT '',
	`password` TEXT NOT NULL DEFAULT '',
	`first_name` TEXT NOT NULL,
	`last_name` TEXT NOT NULL,
	`balance` FLOAT NOT NULL DEFAULT 10000,
	PRIMARY KEY (`username`)
)
COLLATE='latin1_swedish_ci'
ENGINE=InnoDB
;
```

bought_stocks

```JS
{
    username: 'Sampooo',
    company_symbol: 'TIK1V.HE',
    company_name: 'Tikkurila',
    stock_count: 4,
    price: 43,
}
```

SQL query:

```SQL
CREATE TABLE bought_stocks (
	username VARCHAR(56) NOT NULL,
	company_symbol VARCHAR(50) NOT NULL,
	company_name VARCHAR(50) NOT NULL,
	stock_count INT(11) NOT NULL DEFAULT 0,
	price FLOAT NOT NULL DEFAULT 0,
	INDEX FK_bought_stocks_users (username) USING BTREE,
	CONSTRAINT FK_bought_stocks_users FOREIGN KEY (username) REFERENCES investor.users (username) ON UPDATE RESTRICT ON DELETE RESTRICT
)
COLLATE='latin1_swedish_ci'
ENGINE=InnoDB
;

```

stock_prices (used as companies for now)

```JS
{
symbol: 'TIK1V.HE',
company_name: 'Tikkurila',
current_price: 6.24,
timestamp: 1585047271,
}
```

SQL query:

```SQL
CREATE TABLE `stock_prices` (
	`symbol` VARCHAR(50) NOT NULL,
	`company_name` VARCHAR(50) NOT NULL,
	`current_price` FLOAT NULL DEFAULT NULL,
	`timestamp` TIMESTAMP NULL DEFAULT NULL,
	PRIMARY KEY (`symbol`)
)
COLLATE='latin1_swedish_ci'
ENGINE=InnoDB
;

```

companies (work in progress) (in future)

```JS
{
address: 'PL 499, Mikonkatu 13 A, 7 krs',
city: 'Helsinki',
country: 'FI',
currency: 'EUR',
cusip: 'X3470Q101',
description:
"Aspo Plc is a Finland-based conglomerate engaged in the ownership and development of a number of business-to-business corporate brands. Its brands include ESL Shipping, Leipurin, Telko and Kaukomarkkinat. ESL Shipping is engaged in the provision of marine raw material transportation and related services to the energy and heavy industry sectors. Leipurin supplies raw materials and machinery to the food industry and provides services for all stages of customers’ production processes. Telko is engaged in the import and marketing of industrial chemicals and plastic raw materials. Telko's customer service also covers technical support and the development of production processes. Kaukomarkkinat provides machinery, solutions and electronics that improve efficiency in the process industry. Aspo Plc's customer base includes companies in the energy and process industry sectors. The Company operates in the Nordic countries, Baltic countries, Russia, Ukraine, Poland and Far East, among others.",
employeeTotal: '942',
exchange: 'NASDAQ OMX HELSINKI LTD.',
ggroup: 'Capital Goods',
gind: 'Industrial Conglomerates',
gsector: 'Industrials',
gsubind: 'Industrial Conglomerates',
ipo: '1999-10-01',
isin: 'FI0009008072',
marketCapitalization: 224.9656,
naics: 'Chemical and Allied Products Merchant Wholesalers',
naicsNationalIndustry: 'Other Chemical and Allied Products Merchant Wholesalers',
naicsSector: 'Wholesale Trade',
naicsSubsector: 'Merchant Wholesalers, Nondurable Goods',
name: 'Aspo Plc',
phone: '35895211',
sedol: '5785498',
shareOutstanding: 31.123129,
state: 'ETELA-SUOMEN',
symbol: 'ASPO.HE',
weburl: 'https://www.aspo.com/',
executives: [
{
age: 63,
name: 'Gustav Nyberg',
since: 2009,
title: 'Chairman of the Board',
},
{
age: 55,
name: 'Aki Ojanen',
since: 2009,
title: 'Chief Executive Officer; Member of the Group Executive Committee',
},
{
age: 55,
name: 'Marja-Liisa Kaario',
since: 2018,
title: 'Independent Vice Chairman of the Board',
},
],
peers: ['KNEBV.HE', 'WRT1V.HE', 'METSO.HE', 'VALMT.HE', 'KCR.HE', 'CGCBV.HE', 'GLA1V.HE', 'RAUTE.HE', 'EXL1V.HE', 'CTH1V.HE'],
}
```
