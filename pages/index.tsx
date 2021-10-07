import { useEffect, useRef, useState } from "react";
import { setInterval, setTimeout } from "timers";
import Layout from "../components/layout";
import { Line } from "react-chartjs-2";
import Timespan from "readable-timespan";

const { parse } = new Timespan();

const Home = () => {
  let gasInterval,
    priceInterval,
    blocks = [];
  const [gasData, setGasData] = useState({
    fastGasPrice: NaN,
    lastBlock: NaN,
    proposeGasPrice: NaN,
    safeGasPrice: NaN,
    gasUsedRatio: "",
    suggestBaseFee: NaN,
  });
  const [price, setPrice] = useState(NaN);
  const [lastBlocks, setLastBlocks] = useState([]);
  const backgroundAnimateXRef = useRef<HTMLDivElement>();
  const backgroundAnimateYRef = useRef<HTMLDivElement>();

  useEffect(() => {
    if (priceInterval || gasInterval)
      return console.log("already defined intervals");
    fetchGasstation();
    fetchEthereumPrice();

    gasInterval = setInterval(fetchGasstation, 5e2);
    backgroundAnimateXRef.current.classList.add("refreshingX");
    backgroundAnimateYRef.current.classList.add("refreshingY");
    priceInterval = setInterval(fetchEthereumPrice, 12e4);
    return () => {
      clearInterval(gasInterval);
      clearInterval(priceInterval);
    };
  }, []);

  const fetchGasstation = async () => {
    const { result } = await fetch(
      "https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=B38IETTAG8C6WMXV6AYWA8QWHCYKVNGB5U"
    )
      .then((res) => res.json())
      .catch((err) => console.error("(╯°□°)╯︵ ┻━┻", err));
    if (result && !blocks.find((b) => b.lastBlock == result.LastBlock)) {
      const data = {
        fastGasPrice: parseFloat(result.FastGasPrice),
        lastBlock: parseFloat(result.LastBlock),
        proposeGasPrice: parseFloat(result.ProposeGasPrice),
        safeGasPrice: parseFloat(result.SafeGasPrice),
        gasUsedRatio: result.gasUsedRatio,
        suggestBaseFee: parseFloat(result.suggestBaseFee),
      };
      const timeData = (
        await Promise.all(
          [data.fastGasPrice, data.proposeGasPrice, data.safeGasPrice].map(
            (gwei) =>
              fetch(
                `https://api.etherscan.io/api?module=gastracker&action=gasestimate&gasprice=${
                  gwei * 1e9
                }&apikey=B38IETTAG8C6WMXV6AYWA8QWHCYKVNGB5U`
              )
                .then((res) => res.json())
                .catch((err) => console.error("(╯°□°)╯︵ ┻━┻", err))
          )
        )
      ).map(({ result }) => (typeof result === "number" ? result : null));
      data.timeEstimates = timeData;
      blocks = [...blocks.slice(-24), { ...data, receivedAt: new Date() }];
      setLastBlocks(blocks);
      setGasData(data);
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
          !gasData.fastGasPrice ||
          !gasData.proposeGasPrice ||
          isNaN(gasData.fastGasPrice) ||
          isNaN(gasData.proposeGasPrice)
            ? undefined
            : gasData.fastGasPrice.toFixed(0) ===
              gasData.proposeGasPrice.toFixed(0)
            ? `${gasData.proposeGasPrice.toFixed(0)} Gwei`
            : `${gasData.fastGasPrice.toFixed(
                0
              )}-${gasData.proposeGasPrice.toFixed(0)} Gwei`
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
                  Rapid
                </h2>
                <h2 className="text-2xl font-bold text-green-500 md:text-5xl md:my-4">
                  {gasData.fastGasPrice?.toFixed(0)}
                </h2>
                <h2 className="text-sm font-bold md:text-md text-secondaryTextLight dark:text-secondaryTextDark">
                  ${((gasData.fastGasPrice * price) / 1e9).toFixed(10)}
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
                  Fast
                </h2>
                <h2 className="z-10 text-2xl font-bold md:text-5xl text-accentText md:my-4">
                  {gasData.proposeGasPrice?.toFixed(0)}
                </h2>
                <h2 className="z-10 text-sm font-bold md:text-md text-secondaryTextLight dark:text-secondaryTextDark">
                  ${((gasData.proposeGasPrice * price) / 1e9).toFixed(10)}
                </h2>
              </div>
              <div className="flex items-center justify-between p-4 overflow-hidden border border-solid md:flex-col rounded-xl border-secondaryTextLight dark:border-secondaryTextDark bg-secondaryTextDark dark:bg-secondaryTextLight">
                <h2 className="w-10 text-lg font-bold md:text-xl md:w-auto text-primaryTextLight dark:text-primaryTextDark">
                  Standard
                </h2>
                <h2 className="text-2xl font-bold text-blue-600 md:text-5xl md:my-4">
                  {gasData.safeGasPrice?.toFixed(0)}
                </h2>
                <h2 className="text-sm font-bold md:text-md text-secondaryTextLight dark:text-secondaryTextDark">
                  ${((gasData.safeGasPrice * price) / 1e9).toFixed(10)}
                </h2>
              </div>
            </div>
            <h1 className="text-md text-secondaryTextLight dark:text-secondaryTextDark">
              Ethereum: ${price}
            </h1>
            <h1 className="text-md text-secondaryTextLight dark:text-secondaryTextDark">
              Block: #{gasData.lastBlock}
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
            Last 25 Blocks received
          </h1>
          <div className="max-w-4xl mx-auto">
            <Line
              type="line"
              data={{
                labels: lastBlocks.map(({ receivedAt }) =>
                  receivedAt.toLocaleTimeString()
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
