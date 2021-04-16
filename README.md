# rari-risk

Run using nodejs

`node risk2.js`

In some historical period for a given pair, trying to get:

a) min(liquidity)

b) max(price - twap(price)) and min(price - twap(price))

a matters for liquidation slippage and b matters for margin of safety for liquidations

Model: https://hackmd.io/@rari/SkHFrVVUd
