import Image from "next/image";
import { Coin } from "../enums/coin";
import USDCIcon from "../images/usdc.png";
import BitcoinIcon from "../images/bitcoin.png";

interface Props {
  coin: Coin;
}

export const CoinIcon: React.FC<Props> = ({ coin }) => {
  let icon = null;
  let alt = "";

  switch (coin) {
    case Coin.BTC:
      icon = BitcoinIcon;
      alt = "Bitcoin icon";
      break;
    case Coin.USDC:
      icon = USDCIcon;
      alt = "USDC icon";
      break;
  }

  return <Image width={24} height={24} src={icon} alt={alt} />;
};
