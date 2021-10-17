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

interface TransactionEstimationInfo {
  name: string;
  shortType?: string;
  type: string;
  gasUsed: number;
  gasLink?: string;
}

const Home = () => {
  let priceInterval: NodeJS.Timeout, gasInterval: NodeJS.Timeout;
  const [gasData, setGasData] = useState<GasData>();
  const [transactionInfo, setTransactionInfo] =
    useState<TransactionEstimationInfo[]>();
  const [price, setPrice] = useState(NaN);
  const [lastBlocks, setLastBlocks] = useState([]);
  const [historyXAxis, setHistoryXAxis] = useState("lastBlock");
  const backgroundAnimateXRef = useRef<HTMLDivElement>();
  const backgroundAnimateYRef = useRef<HTMLDivElement>();
  const [customGasUsed, setCustomGasUsed] = useState(21000);
  const [isDarkMode, setIsDarkMode] = useState();

  useEffect(() => {
    if (priceInterval || gasInterval)
      return console.log("already defined intervals");
    fetchGasstation();
    fetchEthereumPrice();
    fetchTransactionEstimationInfo();

    backgroundAnimateXRef.current.classList.add("refreshingX");
    backgroundAnimateYRef.current.classList.add("refreshingY");
    // backgroundAnimateXRef.current.onanimationiteration = fetchGasstation;
    // backgroundAnimateYRef.current.onanimationiteration = fetchGasstation;
    priceInterval = setInterval(fetchEthereumPrice, 12e4);
    gasInterval = setInterval(fetchGasstation, 1e4);
    return () => {
      clearInterval(priceInterval);
      clearInterval(gasInterval);
    };
  }, []);

  const fetchGasstation = async () => {
    const res = await fetch("/api/data").then((res) => res.json());
    if (res.history && res.data) {
      setGasData(res.data);
      setLastBlocks(res.history);
    }
  };

  const fetchTransactionEstimationInfo = async () => {
    const res = await fetch("/api/info").then((res) => res.json());
    setTransactionInfo(res.info);
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
        setDarkMode={setIsDarkMode}
      >
        <div className="mx-4 mb-16 md:mx-0" id="gasprice">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="mb-4 text-3xl md:text-center text-primaryTextLight dark:text-primaryTextDark">
                Gas Price (Gwei)
              </h1>
              <h2 className="md:text-center text-md text-secondaryTextLight dark:text-secondaryTextDark">
                Recommended gas price and information
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-6 mb-4 md:gap-12 md:grid-cols-3">
              <div className="flex-col items-center justify-between p-4 overflow-hidden text-center border border-solid rounded-xl border-tertiaryBackgroundLight dark:border-tertiaryBackgroundDark bg-secondaryTextDark dark:bg-secondaryTextLight">
                <h2 className="text-xl font-bold md:w-auto text-primaryTextLight dark:text-primaryTextDark">
                  Fast
                </h2>
                <h2 className="text-3xl font-bold text-green-500 md:text-5xl md:my-4">
                  {gasData?.fastGasPrice?.toFixed(0)}
                </h2>
                <h2 className="text-sm font-bold md:text-md text-secondaryTextLight dark:text-secondaryTextDark">
                  Base Fee: {gasData?.suggestBaseFee.toFixed(0)}
                </h2>
                <h2 className="text-sm font-bold md:text-md text-secondaryTextLight dark:text-secondaryTextDark">
                  Time:{" ~"}
                  {gasData?.timeEstimates?.fast
                    ? timespan.parse(gasData?.timeEstimates?.fast * 1e3)
                    : "???"}
                </h2>
                <h2 className="text-sm font-bold md:text-md text-secondaryTextLight dark:text-secondaryTextDark">
                  Price: ~$
                  {(((gasData?.fastGasPrice * price) / 1e9) * 21e3).toFixed(2)}
                </h2>
              </div>
              <div className="relative flex-col items-center justify-between p-4 overflow-hidden text-center border border-solid rounded-xl border-accentText bg-secondaryTextDark dark:bg-secondaryTextLight">
                <div
                  ref={backgroundAnimateXRef}
                  className="absolute bottom-0 left-0 z-0 h-full md:hidden opacity-20 bg-accentText"
                ></div>
                <div
                  ref={backgroundAnimateYRef}
                  className="absolute bottom-0 left-0 z-0 hidden w-full md:block opacity-20 bg-accentText"
                ></div>
                <h2 className="z-10 text-xl font-bold md:w-auto text-primaryTextLight dark:text-primaryTextDark">
                  Standard
                </h2>
                <h2 className="z-10 text-3xl font-bold md:text-5xl text-accentText md:my-4">
                  {gasData?.proposeGasPrice?.toFixed(0)}
                </h2>
                <h2 className="text-sm font-bold md:text-md text-secondaryTextLight dark:text-secondaryTextDark">
                  Base Fee: {gasData?.suggestBaseFee.toFixed(0)}
                </h2>
                <h2 className="text-sm font-bold md:text-md text-secondaryTextLight dark:text-secondaryTextDark">
                  Time:{" ~"}
                  {gasData?.timeEstimates?.standard
                    ? timespan.parse(gasData?.timeEstimates?.standard * 1e3)
                    : "???"}
                </h2>
                <h2 className="z-10 text-sm font-bold md:text-md text-secondaryTextLight dark:text-secondaryTextDark">
                  Price: ~$
                  {(((gasData?.proposeGasPrice * price) / 1e9) * 21e3).toFixed(
                    2
                  )}
                </h2>
              </div>
              <div className="flex-col items-center justify-between p-4 overflow-hidden text-center border border-solid rounded-xl border-secondaryTextLight dark:border-secondaryTextDark bg-secondaryTextDark dark:bg-secondaryTextLight">
                <h2 className="text-xl font-bold md:w-auto text-primaryTextLight dark:text-primaryTextDark">
                  Slow
                </h2>
                <h2 className="text-3xl font-bold text-blue-600 md:text-5xl md:my-4">
                  {gasData?.safeGasPrice?.toFixed(0)}
                </h2>
                <h2 className="text-sm font-bold md:text-md text-secondaryTextLight dark:text-secondaryTextDark">
                  Base Fee: {gasData?.suggestBaseFee.toFixed(0)}
                </h2>
                <h2 className="text-sm font-bold md:text-md text-secondaryTextLight dark:text-secondaryTextDark">
                  Time:{" ~"}
                  {gasData?.timeEstimates?.slow
                    ? timespan.parse(gasData?.timeEstimates?.slow * 1e3)
                    : "???"}
                </h2>
                <h2 className="text-sm font-bold md:text-md text-secondaryTextLight dark:text-secondaryTextDark">
                  Price: ~$
                  {(((gasData?.safeGasPrice * price) / 1e9) * 21e3).toFixed(2)}
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
              className="hidden m-auto sm:block"
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
        <div className="mx-4 mb-16 md:mx-0" id="history">
          <div className="flex flex-col justify-center mb-8 sm:items-center sm:flex-row">
            <h1 className="text-3xl sm:text-center text-primaryTextLight dark:text-primaryTextDark">
              Gas Price History
            </h1>
            <select
              className="px-4 py-2 mt-4 border border-black outline-none w-min sm:mt-0 sm:ml-8 rounded-xl dark:border-white text-primaryTextLight dark:text-primaryTextDark bg-primaryBackgroundLight dark:bg-primaryBackgroundDark"
              onChange={(e) => setHistoryXAxis(e.target.value)}
            >
              <option value="lastBlock">Block</option>
              <option value="receivedAt">Time</option>
            </select>
          </div>
          <div className="max-w-4xl mx-auto">
            <Line
              type="line"
              data={{
                labels: lastBlocks.map((block) =>
                  historyXAxis === "lastBlock"
                    ? block.lastBlock
                    : new Date(parseInt(block.receivedAt)).toLocaleTimeString()
                ),
                datasets: [
                  {
                    label: "Fast",
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
                    label: "Standard",
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
                    label: "Slow",
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
                aspectRatio: 1.5,
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        var label = context.dataset.label || "";

                        if (label) {
                          label += ": ";
                        }
                        if (context.parsed.y !== null) {
                          label += `${context.parsed.y} Gwei`;
                        }
                        return label;
                      },
                    },
                  },
                },
                animation: {
                  duration: 0,
                },
                interaction: {
                  mode: "nearest",
                  intersect: false,
                },
                scales: {
                  y: {
                    title: {
                      display: true,
                      text: "Gwei",
                    },
                    grid: {
                      color: isDarkMode ? "#35383f" : "#a0aabf",
                    },
                    ticks: {
                      stepSize: 1,
                    },
                  },
                  x: {
                    grid: {
                      color: isDarkMode ? "#35383f" : "#a0aabf",
                    },
                  },
                },
              }}
            />
          </div>
        </div>
        <div className="mx-4 mb-16 md:mx-0 text-primaryTextLight dark:text-primaryTextDark">
          <div className="mb-4">
            <h1 className="mb-4 text-3xl md:text-center text-primaryTextLight dark:text-primaryTextDark">
              Estimated Cost of Transaction
            </h1>
            <h2 className="md:text-center text-md text-secondaryTextLight dark:text-secondaryTextDark">
              For reference only, real transaction prices might differ
            </h2>
          </div>
          <table className="w-full max-w-4xl mx-auto table-auto">
            <thead>
              <tr>
                <th className="px-1 py-2 text-center border border-black md:px-2 md:p-4 dark:border-white">
                  Name
                </th>
                <th className="hidden p-2 text-center border border-black md:table-cell md:p-4 dark:border-white">
                  Action
                </th>
                <th className="p-2 text-center border border-black md:p-4 dark:border-white">
                  Gas Used (Gwei)
                </th>
                <th className="p-2 text-center border border-black md:p-4 dark:border-white">
                  Fast
                </th>
                <th className="p-2 text-center border border-black md:p-4 dark:border-white">
                  Standard
                </th>
              </tr>
            </thead>
            <tbody>
              {transactionInfo?.map((info) => (
                <tr id={info.name.replace(".", "-").toLowerCase()}>
                  <td className="px-1 py-2 text-center border border-black md:px-2 md:p-4 dark:border-white">
                    {info.name}
                    <br />
                    <span
                      style={{ fontSize: ".75rem" }}
                      className="px-2 py-1 bg-gray-500 text-primaryTextDark rounded-xl sm:hidden"
                    >
                      {info.shortType ?? info.type}
                    </span>
                  </td>
                  <td className="hidden p-2 text-center border border-black md:p-4 md:table-cell dark:border-white">
                    <span className="px-4 py-2 mx-auto bg-gray-500 rounded-xl w-min text-primaryTextDark">
                      {info.type}
                    </span>
                  </td>
                  <td className="p-2 text-center border border-black md:p-4 dark:border-white">
                    {info.gasLink ? (
                      <a
                        href={info.gasLink}
                        target="_blank"
                        className="text-accentText"
                      >
                        {info.gasUsed.toLocaleString()}
                      </a>
                    ) : (
                      info.gasUsed.toLocaleString()
                    )}
                  </td>
                  <td className="p-2 text-center border border-black md:p-4 dark:border-white">
                    ~$
                    {(
                      ((gasData?.fastGasPrice * price) / 1e9) *
                      info.gasUsed
                    ).toFixed(2)}
                  </td>
                  <td className="p-2 text-center border border-black md:p-4 dark:border-white">
                    ~$
                    {(
                      ((gasData?.proposeGasPrice * price) / 1e9) *
                      info.gasUsed
                    ).toFixed(2)}
                  </td>
                </tr>
              ))}
              <tr>
                <td className="px-1 py-2 text-center border border-black md:px-2 md:p-4 dark:border-white">
                  Custom
                </td>
                <td className="hidden p-2 text-center border border-black md:p-4 md:table-cell dark:border-white"></td>
                <td className="py-1 text-center border border-black md:p-4 dark:border-white">
                  <input
                    min="0"
                    step="10"
                    className="w-24 py-1 text-center border border-black outline-none md:w-auto rounded-xl dark:border-white text-primaryTextLight dark:text-primaryTextDark bg-primaryBackgroundLight dark:bg-primaryBackgroundDark"
                    type="number"
                    defaultValue={customGasUsed}
                    onChange={(e) => setCustomGasUsed(parseInt(e.target.value))}
                  ></input>
                </td>
                <td className="p-2 text-center border border-black md:p-4 dark:border-white">
                  ~$
                  {(
                    ((gasData?.fastGasPrice * price) / 1e9) * customGasUsed || 0
                  ).toFixed(2)}
                </td>
                <td className="p-2 text-center border border-black md:p-4 dark:border-white">
                  ~$
                  {(
                    ((gasData?.proposeGasPrice * price) / 1e9) *
                      customGasUsed || 0
                  ).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Layout>
    </div>
  );
};
export default Home;
