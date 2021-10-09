import { useEffect, useRef, useState } from "react";
import { setInterval, setTimeout } from "timers";
import Layout from "../components/layout";
import { Line } from "react-chartjs-2";
import Timespan from "readable-timespan";

const timespan = new Timespan();

interface GasData {
  fastGasPrice: number;
  lastBlock: number;
  proposeGasPrice: number;
  safeGasPrice: number;
  gasUsedRatio: string;
  suggestBaseFee: number;
  timeEstimates?: { fast: number; standard: number; slow: number };
}

const Home = () => {
  let priceInterval,
    blocks = [];
  const [gasData, setGasData] = useState<GasData>();
  const [price, setPrice] = useState(NaN);
  const [lastBlocks, setLastBlocks] = useState([]);
  const backgroundAnimateXRef = useRef<HTMLDivElement>();
  const backgroundAnimateYRef = useRef<HTMLDivElement>();

  useEffect(() => {
    if (priceInterval) return console.log("already defined intervals");
    fetchGasstation();
    fetchEthereumPrice();

    backgroundAnimateXRef.current.classList.add("refreshingX");
    backgroundAnimateYRef.current.classList.add("refreshingY");
    backgroundAnimateXRef.current.onanimationiteration = fetchGasstation;
    backgroundAnimateYRef.current.onanimationiteration = fetchGasstation;
    priceInterval = setInterval(fetchEthereumPrice, 12e4);
    return () => {
      clearInterval(priceInterval);
    };
  }, []);

  const fetchGasstation = async () => {
    const res = await fetch("/api/data").then((res) => res.json());
    console.log(res);
    if (res.history && res.data) {
      setGasData(res.data);
      setLastBlocks(res.history);
    }
  };

  const fetchEthereumPrice = async () => {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
    )
      .then((res) => res.json())
      .catch((err) => console.error("(╯°□°)╯︵ ┻━┻", err));
    if (response["ethereum"]?.usd) setPrice(response["ethereum"].usd);
  };

  return (
    <div className="bg-primaryBackgroundLight dark:bg-primaryBackgroundDark">
      <Layout
        title={
          !gasData?.fastGasPrice ||
          !gasData?.proposeGasPrice ||
          isNaN(gasData?.fastGasPrice) ||
          isNaN(gasData?.proposeGasPrice)
            ? undefined
            : gasData?.fastGasPrice.toFixed(0) ===
              gasData?.proposeGasPrice.toFixed(0)
            ? `${gasData?.proposeGasPrice.toFixed(0)} Gwei`
            : `${gasData?.fastGasPrice.toFixed(
                0
              )}-${gasData?.proposeGasPrice.toFixed(0)} Gwei`
        }
      >
        <div className="mx-4 mb-16 md:mx-0">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12">
              <h1 className="mb-4 text-3xl md:text-center text-primaryTextLight dark:text-primaryTextDark">
                Gas Price (Gwei)
              </h1>
              <h2 className="md:text-center text-md text-secondaryTextLight dark:text-secondaryTextDark">
                Recommended Gas Price and Info
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-6 mb-4 md:gap-12 md:grid-cols-3">
              <div className="flex items-center justify-between p-4 overflow-hidden border border-solid md:flex-col rounded-xl border-tertiaryBackgroundLight dark:border-tertiaryBackgroundDark bg-secondaryTextDark dark:bg-secondaryTextLight">
                <h2 className="w-10 text-lg font-bold md:text-xl md:w-auto text-primaryTextLight dark:text-primaryTextDark">
                  Fast
                </h2>
                <h2 className="text-2xl font-bold text-green-500 md:text-5xl md:my-4">
                  {gasData?.fastGasPrice?.toFixed(0)}
                </h2>
                <h2 className="text-sm font-bold md:text-md text-secondaryTextLight dark:text-secondaryTextDark">
                  Base Fee: {gasData?.suggestBaseFee.toFixed(0)}
                </h2>
                <h2 className="text-sm font-bold md:text-md text-secondaryTextLight dark:text-secondaryTextDark">
                  Time:{" "}
                  {gasData?.timeEstimates?.fast
                    ? timespan.parse(gasData?.timeEstimates?.fast * 1e3)
                    : "-"}
                </h2>
                <h2 className="text-sm font-bold md:text-md text-secondaryTextLight dark:text-secondaryTextDark">
                  Price: ~$
                  {(((gasData?.fastGasPrice * price) / 1e9) * 2e4).toFixed(2)}
                </h2>
              </div>
              <div className="relative flex items-center justify-between p-4 overflow-hidden border border-solid md:flex-col rounded-xl border-accentText bg-secondaryTextDark dark:bg-secondaryTextLight">
                <div
                  ref={backgroundAnimateXRef}
                  className="absolute bottom-0 left-0 z-0 h-full md:hidden opacity-20 bg-accentText"
                ></div>
                <div
                  ref={backgroundAnimateYRef}
                  className="absolute bottom-0 left-0 z-0 hidden w-full md:block opacity-20 bg-accentText"
                ></div>
                <h2 className="z-10 w-10 text-lg font-bold md:text-xl md:w-auto text-primaryTextLight dark:text-primaryTextDark">
                  Standard
                </h2>
                <h2 className="z-10 text-2xl font-bold md:text-5xl text-accentText md:my-4">
                  {gasData?.proposeGasPrice?.toFixed(0)}
                </h2>
                <h2 className="text-sm font-bold md:text-md text-secondaryTextLight dark:text-secondaryTextDark">
                  Base Fee: {gasData?.suggestBaseFee.toFixed(0)}
                </h2>
                <h2 className="text-sm font-bold md:text-md text-secondaryTextLight dark:text-secondaryTextDark">
                  Time:{" "}
                  {gasData?.timeEstimates?.standard
                    ? timespan.parse(gasData?.timeEstimates?.standard * 1e3)
                    : "-"}
                </h2>
                <h2 className="z-10 text-sm font-bold md:text-md text-secondaryTextLight dark:text-secondaryTextDark">
                  Price: ~$
                  {(((gasData?.proposeGasPrice * price) / 1e9) * 2e4).toFixed(
                    2
                  )}
                </h2>
              </div>
              <div className="flex items-center justify-between p-4 overflow-hidden border border-solid md:flex-col rounded-xl border-secondaryTextLight dark:border-secondaryTextDark bg-secondaryTextDark dark:bg-secondaryTextLight">
                <h2 className="w-10 text-lg font-bold md:text-xl md:w-auto text-primaryTextLight dark:text-primaryTextDark">
                  Slow
                </h2>
                <h2 className="text-2xl font-bold text-blue-600 md:text-5xl md:my-4">
                  {gasData?.safeGasPrice?.toFixed(0)}
                </h2>
                <h2 className="text-sm font-bold md:text-md text-secondaryTextLight dark:text-secondaryTextDark">
                  Base Fee: {gasData?.suggestBaseFee.toFixed(0)}
                </h2>
                <h2 className="text-sm font-bold md:text-md text-secondaryTextLight dark:text-secondaryTextDark">
                  Time:{" "}
                  {gasData?.timeEstimates?.slow
                    ? timespan.parse(gasData?.timeEstimates?.slow * 1e3)
                    : ""}
                </h2>
                <h2 className="text-sm font-bold md:text-md text-secondaryTextLight dark:text-secondaryTextDark">
                  Price: ~$
                  {(((gasData?.safeGasPrice * price) / 1e9) * 2e4).toFixed(2)}
                </h2>
              </div>
            </div>
            <h1 className="text-md text-secondaryTextLight dark:text-secondaryTextDark">
              Ethereum: ${price}
            </h1>
            <h1 className="text-md text-secondaryTextLight dark:text-secondaryTextDark">
              Block: #{gasData?.lastBlock}
            </h1>
          </div>
        </div>
        <div className="hidden max-w-4xl mx-auto mb-16">
          <a href="https://gravityfinance.io">
            <img
              className="m-auto sm:block"
              src="/banner.gif"
              alt="Gravity Finance Banner"
            />
            <img
              className="block px-4 m-auto sm:hidden"
              src="/banner-small.gif"
              alt="Gravity Finance Banner"
            />
          </a>
        </div>
        <div className="mx-4 mb-16 md:mx-0">
          <h1 className="mb-4 text-3xl md:text-center text-primaryTextLight dark:text-primaryTextDark">
            Gas Price History
          </h1>
          <div className="max-w-4xl mx-auto">
            <Line
              type="line"
              data={{
                labels: lastBlocks.map(({ receivedAt }) =>
                  new Date(receivedAt).toLocaleTimeString()
                ),
                datasets: [
                  {
                    label: "Rapid",
                    data: lastBlocks.map(({ fastGasPrice }) =>
                      fastGasPrice?.toFixed(0)
                    ),
                    fill: false,
                    backgroundColor: "#10b981",
                    borderColor: "#10b981",
                    pointRadius: 1,
                    cubicInterpolationMode: "monotone",
                  },
                  {
                    label: "Fast",
                    data: lastBlocks.map(({ proposeGasPrice }) =>
                      proposeGasPrice?.toFixed(0)
                    ),
                    fill: false,
                    backgroundColor: "#ffa600",
                    borderColor: "#ffa600",
                    pointRadius: 1,
                    cubicInterpolationMode: "monotone",
                  },
                  {
                    label: "Standard",
                    data: lastBlocks.map(({ safeGasPrice }) =>
                      safeGasPrice?.toFixed(0)
                    ),
                    fill: false,
                    backgroundColor: "#2563eb",
                    borderColor: "#2563eb",
                    pointRadius: 1,
                    cubicInterpolationMode: "monotone",
                  },
                ],
              }}
              options={{
                plugins: {
                  tooltip: {},
                },
                animation: {
                  duration: 0,
                },
                yAxes: [
                  {
                    scaleLabel: {
                      labelString: "Gwei",
                    },
                  },
                ],
              }}
            />
          </div>
        </div>
      </Layout>
    </div>
  );
};
export default Home;
