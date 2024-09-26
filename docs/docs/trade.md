---
id: trade
title: Trade
sidebar_position: 3
---

## Token

Traders can open positions on three different tokens: Bitcoin (BTC), Ethereum (ETH), and Alephium (ALPH). More tokens will be available in the future as additional price feeds are integrated into the oracle.

## Position Type

### Long

A long position gains value when the underlying token's price rises.

For example, if you open a long position on BTC and its price increases, the value of your position will increase. Conversely, if the BTC price falls, the value of your position will decrease.

### Short

A short position gains value when the underlying token's price declines.

For instance, if you open a short position on BTC and its price decreases, the value of your position will rise. However, if the BTC price increases, the value of your position will drop.

## Collateral

Collateral is the amount traders deposit to open and maintain positions. It acts as a security deposit, ensuring that traders can cover potential losses and uphold the integrity of their positions. The minimum amount of collateral required is \$1.

When opening a position, the collateral is used as the initial value, which fluctuates based on the price of the underlying asset and any applicable fees. For instance, if you open a position with a collateral of \$10, the initial value of that position is also \$10 (excluding fees).

## Leverage

Leverage allows traders to control a larger position size with a relatively small amount of collateral. By using leverage, you can amplify your potential gains, but it also increases your risk, as losses can be magnified. You can use leverage of up to 20x on your positions.

For example, if you open a position with \$10 as collateral and apply 5x leverage, it effectively allows you to control a position worth \$50.

:::warning
Leverage increases the risk of liquidation as it amplifies price movements, and because fees are calculated based on position size, higher leverage can lead to significantly increased costs.
:::

## Size

Position size represents the total value of tokens controlled by a trader in a specific position. It is calculated by multiplying the amount of collateral by the leverage applied.

To view the position size formula and an example, visit: [Calculating Position Size](math#calculating-position-size).

## Entry/Close Price

The entry price is the price at which a trader opens a position, while the close price is the price at which the position is closed. These prices are crucial for determining the starting and ending values of the asset in the trade and are used to calculate profits or losses throughout the trade.

To view the entry/close price formula and an example, visit: [Calculating Entry/Close Price](math#calculating-entryclose-price).

:::warning
Oracles update when there is at least a 0.5% change in the asset's price (at least once per hour). To mitigate potential exploits, the entry price will be set at 0.5% higher than the current market price when opening a long position and 0.5% lower for a short position. Same but reversed with close price. This adjustment is included in the open and close fees.
:::

## Liquidation Price

The liquidation price is the price at which the value of your position drops to \$0, meaning you would no longer have any funds to maintain your position.

To view the liquidation price formula and an example, visit: [Calculating Liquidation Price](math#calculating-liquidation-price).

## Value

The value of a position represents its current worth and the amount you will receive when you decide to close it. This value fluctuates based on market conditions, entry and current prices, and the leverage applied to the position.

To view the position value formula and an example, visit: [Calculating Position Value](math#calculating-position-value).

:::danger
If the value of your position falls below 16.66% (1/6) of your collateral, other users have the ability to liquidate your position.

For instance, if you open a position with \$60 as collateral and its value decreases to \$10 or lower, it becomes subject to liquidation, and you would lose the remaining value of your position.
:::

## Profit and Loss

Profit and loss (P&L) represent the change in value of your trading position relative to the amount of collateral you initially deposited.

To view the profit and loss formula and an example, visit: [Calculating Profit and Loss](math#calculating-profit-and-loss).

## Fees

Fees will be deducted from the value of your position.

### Open/Close Fee

A fee of up to 0.5% of the position size is charged when opening and closing a position. The fee is charged as a decrease/increase in entry and close price. If you open a long position, your entry price will be 0.5% higher than the market price of an asset, and if you close a position, your entry price will be 0.5% lower than the market price of an asset. It's charged because oracle prices are updated if the underlying asset price changes by 0.5% (or once every hour), which means the maximum price difference is 0.5%. This is to prevent potential exploits.

### Borrow Fee

A fee of 0.005% of the position size will be charged every hour when your position is open. It's charged to compensate liquidity providers for the use of their assets.

To view the hourly borrow cost formula and an example, visit: [Calculating Hourly Borrow Cost](math#calculating-hourly-borrow-cost).
