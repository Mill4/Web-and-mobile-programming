# This document contains all used api calls for the app

## Table of contents:

-   [Finnhub free plan limits](#finnhub-free-plan-limits)
-   [All finnish companies](#all-finnish-companies)
-   [Company profile](#company-profile)
-   [Company Executive](#company-executive)
-   [Company peers (other similar companies)](<#company-peers-(other-similar-companies)>)
-   [Quote (Prices)](<#quote-(prices)>)
-   [Stock Candles (Chart data)](<#stock-candles-(chart-data)>)
-   [Dividends (Suom. Osingot)](<#dividends-(suom.-osingot)>)
-   [Metrics](#metrics)

## Finnhub free plan limits

-   60 free API calls/minute
-   Websocket: 50 symbols
-   Personal use only
-   Access most data

## All finnish companies

https://finnhub.io/docs/api#stock-symbols

List supported stocks. Just cache it.

URL: https://finnhub.io/api/v1/stock/symbol?exchange=HE&token={TOKEN}

Weight: 1

## Company profile

https://finnhub.io/docs/api#company-profile

Get general information of a company. Should be requested every now and then (maybe once a week). Preferably cached.

URL: https://finnhub.io/api/v1/stock/profile?symbol={SYMBOL}&token={TOKEN}

Weight: 12

```JSON
{
  "address": "PL 499, Mikonkatu 13 A, 7 krs",
  "city": "Helsinki",
  "country": "FI",
  "currency": "EUR",
  "cusip": "X3470Q101",
  "description": "Aspo Plc is a Finland-based conglomerate engaged in the ownership and development of a number of business-to-business corporate brands. Its brands include ESL Shipping, Leipurin, Telko and Kaukomarkkinat. ESL Shipping is engaged in the provision of marine raw material transportation and related services to the energy and heavy industry sectors. Leipurin supplies raw materials and machinery to the food industry and provides services for all stages of customers’ production processes. Telko is engaged in the import and marketing of industrial chemicals and plastic raw materials. Telko's customer service also covers technical support and the development of production processes. Kaukomarkkinat provides machinery, solutions and electronics that improve efficiency in the process industry. Aspo Plc's customer base includes companies in the energy and process industry sectors. The Company operates in the Nordic countries, Baltic countries, Russia, Ukraine, Poland and Far East, among others.",
  "employeeTotal": "942",
  "exchange": "NASDAQ OMX HELSINKI LTD.",
  "ggroup": "Capital Goods",
  "gind": "Industrial Conglomerates",
  "gsector": "Industrials",
  "gsubind": "Industrial Conglomerates",
  "ipo": "1999-10-01",
  "isin": "FI0009008072",
  "marketCapitalization": 224.9656,
  "naics": "Chemical and Allied Products Merchant Wholesalers",
  "naicsNationalIndustry": "Other Chemical and Allied Products Merchant Wholesalers",
  "naicsSector": "Wholesale Trade",
  "naicsSubsector": "Merchant Wholesalers, Nondurable Goods",
  "name": "Aspo Plc",
  "phone": "35895211",
  "sedol": "5785498",
  "shareOutstanding": 31.123129,
  "state": "ETELA-SUOMEN",
  "ticker": "ASPO.HE",
  "weburl": "https://www.aspo.com/"
}
```

## Company Executive

https://finnhub.io/docs/api#company-executive

Get a list of company's executives and members of the Board. Could be cached.

URL: https://finnhub.io/api/v1/quote?symbol={SYMBOL}&token={TOKEN}

Weight: 1

```JSON
{
  "executive": [
    {
      "age": 63,
      "name": "Gustav Nyberg",
      "since": 2009,
      "title": "Chairman of the Board"
    },
    {
      "age": 55,
      "name": "Aki Ojanen",
      "since": 2009,
      "title": "Chief Executive Officer; Member of the Group Executive Committee"
    },
    {
      "age": 55,
      "name": "Marja-Liisa Kaario",
      "since": 2018,
      "title": "Independent Vice Chairman of the Board"
    }...
```

## Company peers (other similar companies)

https://finnhub.io/docs/api#company-peers

Get company peers. Return a list of peers in the same country and GICS sub-industry. Could be cached.

URL: https://finnhub.io/api/v1/stock/peers?symbol={SYMBOL}&token={TOKEN}

Weight: 1

```JSON
[
  "KNEBV.HE",
  "WRT1V.HE",
  "METSO.HE",
  "VALMT.HE",
  "KCR.HE",
  "CGCBV.HE",
  "GLA1V.HE",
  "RAUTE.HE",
  "EXL1V.HE",
  "CTH1V.HE"
]
```

## Quote (Prices)

https://finnhub.io/docs/api#quote

Get latest prices. "Constant polling is not recommended. Use websocket if you need real-time update". We could use websocket?

URL: https://finnhub.io/api/v1/quote?symbol{SYMBOL}&token={TOKEN}

Weight: 1

```JSON
{
  "c": 6.26,
  "h": 6.34,
  "l": 5.92,
  "o": 6,
  "pc": 5.94,
  "t": 1584086400
}
```

Response attributes:

-   c - current price
-   h - high price of the day
-   l - low price of the day
-   o - opening price of the day
-   pc - previous close price
-   t - timestamp of current daily bar in UNIX

## Stock Candles (Chart data)

https://finnhub.io/docs/api#stock-candles

Get on detailed company wiev. Pretty useless if cached, yet costs a request.

Check usage from finnhub.

Weight: 1

## Dividends (Suom. Osingot)

https://finnhub.io/docs/api#stock-dividends

Get dividends data for stocks. Could be cached or not used at all.

Check usage from finnhub.

Weight: 1

## Metrics

https://finnhub.io/docs/api#company-metrics

Get company key metrics such as growth, price, valuation. Full list of supported fields can be downloaded: https://static.finnhub.io/csv/metrics.csv

Contains tons of good data. Could be looked into if we have time.

Check usage from finnhub.

Weight: 5
