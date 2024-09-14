import { useEffect, useRef, memo, useState } from "react";
import { CoinIcon } from "./CoinIcon";
import { Coin } from "../enums/coin";
import { useStore } from "../store/store";
import { formatNumber } from "../utils/ui";
import { Color } from "../enums/color";
import { PRICE_DECIMAL } from "../utils/consts";

export const Chart: React.FC = () => {
  const [lastPrice, setLastPrice] = useState(0n);
  const [priceClass, setPriceClass] = useState(Color.BLACK);
  const { currentPrice } = useStore();
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentPrice > lastPrice) {
      setPriceClass(Color.GREEN);
    } else if (currentPrice < lastPrice) {
      setPriceClass(Color.RED);
    }
    setLastPrice(currentPrice);

    setTimeout(() => {
      setPriceClass(Color.BLACK);
    }, 1000);
  }, [lastPrice, currentPrice]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
        {
          "autosize": true,
          "symbol": "BINANCE:BTCUSDC",
          "interval": "1",
          "timezone": "Etc/UTC",
          "theme": "dark",
          "style": "1",
          "locale": "en",
          "allow_symbol_change": true,
          "calendar": false,
          "support_host": "https://www.tradingview.com"
        }`;

    if (container.current) {
      container.current.innerHTML = "";
      container.current.appendChild(script);

      script.addEventListener("load", () => {
        if (container.current) {
          container.current.style.height = "532px";
        }
      });
    }
  }, []);

  return (
    <div className="flex flex-col gap-2 w-full ml-4">
      <div className="flex items-center gap-2">
        <CoinIcon coin={Coin.BTC} />
        <p className="text-xl">
          BTC/USDC:{" "}
          <span className={`text-${priceClass}`}>
            $
            {formatNumber(Number(currentPrice), Number(PRICE_DECIMAL)).toFixed(
              2
            )}
          </span>
        </p>
      </div>
      <div className="tradingview-widget-container" ref={container}>
        <div className="tradingview-widget-container__widget"></div>
      </div>
    </div>
  );
};

export default memo(Chart);
