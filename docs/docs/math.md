---
id: math
title: Math
sidebar_position: 5
---

This section will help you better understand the math behind the protocol. By exploring the calculations and concepts involved, you'll gain valuable insights into how the system operates and how to make informed trading/liquidity providing decisions.

## Calculating Position Value

Formula:

$
positionValue_{long} = collateral + \left(\frac{closePrice}{entryPrice} - 1\right) * positionSize - hoursPassed * borrowRate * positionSize\\
positionValue_{short} = collateral + \left(1 - \frac{closePrice}{entryPrice}\right) * positionSize - hoursPassed * borrowRate * positionSize\\
$

Example:

$
collateral = 10\\
leverage = 5\\
positionSize = 10 * 5 = 50\\
entryPrice = 100\\
closePrice = 110\\
hoursPassed = 20\\
borrowRate = 0.00005\\
$

$
positionValue_{long} = 10 + \left(\frac{110}{100} - 1\right) * 50 - 20 * 0.00005 * 50\\
positionValue_{long} = 10 + (1.1 - 1) * 50 - 20 * 0.0025\\
positionValue_{long} = 10 + 0.1 * 50 - 0.05\\
positionValue_{long} = 10 + 5 - 0.05\\
positionValue_{long} = 14.95\\
$

$
positionValue_{short} = 10 + \left(1 - \frac{110}{100}\right) * 50 - 20 * 0.00005 * 50\\
positionValue_{short} = 10 + (1 - 1.1) * 50 - 20 * 0.0025\\
positionValue_{short} = 10 + (-0.1) * 50 - 0.05\\
positionValue_{short} = 10 - 0.5 * 50 - 0.05\\
positionValue_{short} = 4.95\\
$

## Calculating Entry/Close Price

Formula:

$
entryPrice_{long} = marketPrice * (1 + openFee)\\
entryPrice_{short} = marketPrice * (1 - openFee)\\
closePrice_{long} = marketPrice * (1 - closeFee)\\
closePrice_{short} = marketPrice * (1 + closeFee)\\
$

Example:

$
marketPrice = 100\\
openFee = 0.005\\
$

$
entryPrice_{long} = 100 * (1 + 0.005)\\
entryPrice_{long} = 100 * 1.005\\
entryPrice_{long} = 100.5\\
closePrice_{long} = 100 * (1 - 0.005)\\
closePrice_{long} = 100 * (0.995)\\
closePrice_{long} = 99.5\\
$

## Calculating Position Size

Formula:

$
positionSize = collateral * leverage\\
$

Example:

$
collateral = 10\\
leverage = 5\\
$

$
positionSize = 10 * 5\\
positionSize = 50\\
$

## Calculating Liquidation Price

Formula:

$
liquidationPrice_{long} = entryPrice - \frac{entryPrice}{leverage} * \frac{value}{collateral}\\
liquidationPrice_{short} = entryPrice + \frac{entryPrice}{leverage} * \frac{value}{collateral}\\
$

Example:

$
entryPrice = 100\\
leverage = 5\\
value = 5\\
collateral = 10\\
$

$
liquidationPrice_{long} = 100 - \frac{100}{5} * \frac{5}{10}\\
liquidationPrice_{long} = 100 - 20 * 0.5\\
liquidationPrice_{long} = 90\\
liquidationPrice_{short} = 100 + \frac{100}{5} * \frac{5}{10}\\
liquidationPrice_{short} = 100 + 20 * 0.5\\
liquidationPrice_{short} = 110\\
$

## Calculating Profit and Loss

Formula:

$
pnl = value - collateral\\
$

Example:

$
value = 15\\
collateral = 10\\
$

$
pnl = 15 - 10\\
pnl = 5\\
$

$
value = 5\\
collateral = 10\\
$

$
pnl = 5 - 10\\
pnl = -5\\
$

## Calculating Available Liquidity

Formula:

$
availableLiquidity_{short} = \frac{openInterest_{total}}{2} - openInterest_{short}\\
availableLiquidity_{long} = \frac{openInterest_{total}}{2} - openInterest_{long}\\
$

Example:

$
openInterest_{total} = 1000\\
openInterest_{long} = 300\\
$

$
availableLiquidity_{long} = \frac{1000}{2} - 300\\
availableLiquidity_{long} = 500 - 300\\
availableLiquidity_{long} = 200\\
$

## Calculating Hourly Borrow Cost

Formula:

$
hourlyBorrowCost = borrowRate * positionSize\\
$

Example:

$
collateral = 10\\
leverage = 5\\
positionSize = 10 * 5 = 50\\
borrowRate = 0.00005\\
$

$
hourlyBorrowCost = 0.00005 * 50 = 0.0025\\
$

## Calculating LP Token Price

Formula:

$
LPTokenPrice = \frac{liquidity}{LPTokenAmount}\\
$

Example:

$
liquidity = 1000\\
LPTokenAmount = 100\\
$

$
LPTokenPrice = \frac{1000}{100}\\
LPTokenPrice = 10\\
$
