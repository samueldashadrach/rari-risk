# rari-risk

Run using nodejs

`node risk4.js`

does full simulation. for each block, assuming liquidation needs to happen there. iterate and check if price drops more than LI - slippage. when price does not drop by more than LI - slippage, assume liquidation happens. check total price drop from when liquidation was supposed to happen.

[data_simulation](data_simulation.txt)

--------------------------------------------------------------------

`node risk3.js`

gets max price movement in 15 min in both directions 
also gets min liquidity

[Model](https://hackmd.io/@rari/SkHFrVVUd)

[data_simple](data_simple.txt)