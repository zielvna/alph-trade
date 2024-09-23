import { useEffect, useRef, memo, useState } from "react";
import { CoinIcon } from "./CoinIcon";
import { Coin } from "../enums/coin";
import { useStore } from "../store/store";
import { formatNumber } from "../utils/ui";
import { Color } from "../enums/color";
import {
  MARKETS,
  ORACLE_API_URL,
  PRICE_DECIMAL,
  TRADING_VIEW_TICKER,
} from "../utils/consts";
import { marketToCoin } from "../utils/functions";

const Chart: React.FC = () => {
  const [lastPrice, setLastPrice] = useState(0n);
  const [priceClass, setPriceClass] = useState(Color.BLACK);
  const [change, setChange] = useState(0);
  const { currentPrice, market, setMarket } = useStore();
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentPrice[market] > lastPrice) {
      setPriceClass(Color.GREEN);
    } else if (currentPrice[market] < lastPrice) {
      setPriceClass(Color.RED);
    }
    setLastPrice(currentPrice[market]);

    setTimeout(() => {
      setPriceClass(Color.BLACK);
    }, 1000);
  }, [lastPrice, currentPrice, market]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
        {
          "autosize": true,
          "symbol": "${TRADING_VIEW_TICKER[market]}",
          "interval": "1",
          "timezone": "Etc/UTC",
          "theme": "light",
          "style": "1",
          "locale": "en",
          "allow_symbol_change": false,
          "calendar": false,
          "support_host": "https://www.tradingview.com"
        }`;

    if (container.current) {
      container.current.innerHTML = "";
      container.current.appendChild(script);

      script.addEventListener("load", () => {
        if (container.current) {
          container.current.style.height = "556px";
        }
      });
    }
  }, [market]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(ORACLE_API_URL[market]);
      const data = await response.json();
      setChange(data.Price / data.PriceYesterday);
    };

    fetchData();
  }, [market]);

  const parsedChange = change * 100 - 100;

  return (
    <div className="flex flex-col gap-2 grow ml-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-2">
          {MARKETS.map((currentMarket, index) => (
            <div
              key={index}
              className={`h-[32px] flex items-center gap-1 text-xl py-1 px-2 cursor-pointer border ${
                currentMarket === market ? "border-black" : "border-white"
              }`}
              onClick={() => setMarket(currentMarket)}
            >
              <CoinIcon coin={marketToCoin(currentMarket) ?? Coin.USDC} />
              {marketToCoin(currentMarket)}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <p className={`text-xl text-${priceClass}`}>
            $
            {formatNumber(
              Number(currentPrice[market]),
              Number(PRICE_DECIMAL)
            ).toFixed(2)}
          </p>
          <div className="flex flex-col items-center text-sm leading-4">
            <p>24h change</p>
            <p className={`${parsedChange >= 0 ? "text-green" : "text-red"}`}>
              {parsedChange >= 0 ? "+" : ""}
              {parsedChange.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>
      <div className="tradingview-widget-container" ref={container}>
        <div className="tradingview-widget-container__widget"></div>
      </div>
    </div>
  );
};

export default memo(Chart);
