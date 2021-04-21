# rari-risk

Run using nodejs

`node risk3.js`

In some historical period for a given pair, trying to get:

a) min(liquidity)

b) max(price - twap(price)) and min(price - twap(price))

a matters for liquidation slippage and b matters for price shock

instead of getting b, have just queried price every 15 minute and checking max movement of price in 15 min. no twap

Model: https://hackmd.io/@rari/SkHFrVVUd

Backtest results: #obtained-data.txt