import { useEffect, useState } from "react";
import { Color } from "../enums/color";
import { Button, ButtonSize } from "./Button";
import { Input } from "./Input";
import {
  calculateAmount,
  calculateAvailableLiquidity,
  calculateLpTokens,
} from "../utils/math";
import { useWallet } from "@alephium/web3-react";
import {
  ALPH_TRADE_CONTRACT_ID,
  TOKEN_DECIMAL,
  TOKEN_DENOMINATOR,
  USDC_CONTRACT_ID,
} from "../utils/consts";
import { waitForTxConfirmation } from "@alephium/web3";
import { useStore } from "../store/store";
import {
  balanceOf,
  deposit,
  getLiquidity,
  getLpTokenSupply,
  withdraw,
} from "../utils/web3";
import { formatNumber } from "../utils/ui";
import { CoinIcon } from "./CoinIcon";
import { Coin } from "../enums/coin";
import { LiquidityType } from "../enums/liquidity-type";

export const LiquiditySidePanel: React.FC = () => {
  const { signer, account } = useWallet();
  const {
    lpBalance,
    balance,
    liquidity,
    lpTokenSupply,
    openInterest,
    setBalance,
    setLpBalance,
    setLpTokenSupply,
    setLiquidity,
  } = useStore();
  const [liquidityType, setLiquidityType] = useState(LiquidityType.DEPOSIT);
  const [amount, setAmount] = useState("0");

  const loadData = async () => {
    const lpTokenSupply = await getLpTokenSupply();
    const liquidity = await getLiquidity();
    setLpTokenSupply(lpTokenSupply);
    setLiquidity(liquidity);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (value: string) => {
    const regex = /^\d*\.?\d{0,6}$/;

    if (regex.test(value) || value === "") {
      setAmount(value);
    }
  };

  const handleDeposit = async () => {
    if (signer && account) {
      const result = await deposit(
        BigInt(Number(amount) * Number(TOKEN_DENOMINATOR)),
        signer
      );
      await waitForTxConfirmation(result.txId, 1, 1000);

      const balance = await balanceOf(USDC_CONTRACT_ID, account.address);
      setBalance(balance);
      const lpBalance = await balanceOf(
        ALPH_TRADE_CONTRACT_ID,
        account.address
      );
      setLpBalance(lpBalance);

      loadData();
    }
  };

  const handleWithdraw = async () => {
    if (signer && account) {
      const result = await withdraw(
        BigInt(Number(amount) * Number(TOKEN_DENOMINATOR)),
        signer
      );
      await waitForTxConfirmation(result.txId, 1, 1000);

      const balance = await balanceOf(USDC_CONTRACT_ID, account.address);
      setBalance(balance);
      const lpBalance = await balanceOf(
        ALPH_TRADE_CONTRACT_ID,
        account.address
      );
      setLpBalance(lpBalance);

      loadData();
    }
  };

  const lpTokensReceive = (
    liquidityType === LiquidityType.DEPOSIT
      ? calculateLpTokens
      : calculateAmount
  )(
    Number(amount),
    formatNumber(Number(liquidity), Number(TOKEN_DECIMAL)),
    formatNumber(Number(lpTokenSupply), Number(TOKEN_DECIMAL))
  );
  const parsedBalance =
    liquidityType === LiquidityType.DEPOSIT
      ? (Number(balance) / Number(TOKEN_DENOMINATOR)).toFixed(
          Number(TOKEN_DECIMAL)
        )
      : (Number(lpBalance) / Number(TOKEN_DENOMINATOR)).toFixed(
          Number(TOKEN_DECIMAL)
        );
  const availableLiquidity = calculateAvailableLiquidity(
    formatNumber(Number(liquidity * 2n), Number(TOKEN_DECIMAL)),
    formatNumber(Number(openInterest.total), Number(TOKEN_DECIMAL))
  );
  const isAmountCorrect =
    Number(amount) > 0 &&
    BigInt(Number(amount) * Number(TOKEN_DENOMINATOR)) <=
      (liquidityType === LiquidityType.DEPOSIT ? balance : lpBalance) &&
    Number(amount) < availableLiquidity;

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex gap-4">
        <Button
          scheme={
            liquidityType === LiquidityType.DEPOSIT ? Color.GREEN : Color.GRAY
          }
          size={ButtonSize.BIG}
          onClick={() => setLiquidityType(LiquidityType.DEPOSIT)}
        >
          deposit
        </Button>
        <Button
          scheme={
            liquidityType === LiquidityType.WITHDRAW ? Color.RED : Color.GRAY
          }
          size={ButtonSize.BIG}
          onClick={() => setLiquidityType(LiquidityType.WITHDRAW)}
        >
          withdraw
        </Button>
      </div>
      <div className="flex flex-col gap-1">
        pay
        <div className="flex gap-2 items-center">
          <Input
            value={amount}
            onChange={(e) => handleChange(e.target.value)}
          />
          <CoinIcon
            coin={
              liquidityType === LiquidityType.WITHDRAW ? Coin.ATLP : Coin.USDC
            }
          />
        </div>
        balance: {parsedBalance}
      </div>
      <div className="flex flex-col gap-1">
        receive
        <div className="flex gap-2 items-center">
          <Input value={lpTokensReceive.toFixed(2)} disabled={true} />
          <CoinIcon
            coin={
              liquidityType === LiquidityType.DEPOSIT ? Coin.ATLP : Coin.USDC
            }
          />
        </div>
        {liquidityType === LiquidityType.WITHDRAW && (
          <>available liquidity: ${availableLiquidity.toFixed(2)}</>
        )}
      </div>
      <Button
        scheme={isAmountCorrect ? Color.BLUE : Color.GRAY}
        size={ButtonSize.BIG}
        onClick={
          isAmountCorrect
            ? liquidityType === LiquidityType.DEPOSIT
              ? handleDeposit
              : handleWithdraw
            : () => {}
        }
      >
        {liquidityType === LiquidityType.DEPOSIT ? "deposit" : "withdraw"}
      </Button>
    </div>
  );
};
