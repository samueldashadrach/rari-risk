# rari-risk

Run using nodejs

`node risk2.js`

In some historical period for a given pair, trying to get:

a) min(liquidity)

b) max(price - twap(price)) and min(price - twap(price))

a matters for liquidation slippage and b matters for price shock

Model: https://hackmd.io/@rari/SkHFrVVUd
