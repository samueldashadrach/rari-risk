# rari-risk

Run using nodejs

`node risk4.js`

Does full simulation. For each period, assume liquidation needs to happen there. Iterate and check if price drops more than LI - slippage in every subsequent period. When price does not drop by more than LI - slippage, assume liquidation happens. Check total price drop from when liquidation was supposed to happen to when it happens.

TOKEN(x)DOWN = max % drop in token(x) observed from simulation, from when liquidation should happen to when it happens

Recommended CF < 1 - LI - TOKEN(x)DOWN

[Improved model](https://hackmd.io/@rari/rJjp3KNw_

[data_simulation](data_simulation.txt)

--------------------------------------------------------------------

`node risk3.js`

gets max price movement in 15 min in both directions 

also gets min liquidity

[Model](https://hackmd.io/@rari/SkHFrVVUd)

[data_simple](data_simple.txt)