import Image from "next/image";
import { Coin } from "../enums/coin";
import USDCIcon from "../images/usdc.png";
import BitcoinIcon from "../images/bitcoin.png";
import ATLPIcon from "../images/atlp.png";

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
    case Coin.ATLP:
      icon = ATLPIcon;
      alt = "ATLP icon";
      break;
  }

  return (
    <Image
      className={coin === Coin.ATLP ? "border border-black rounded-full" : ""}
      width={24}
      height={24}
      src={icon}
      alt={alt}
    />
  );
};
