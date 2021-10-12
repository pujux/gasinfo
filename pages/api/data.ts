import { fetch } from "cross-fetch";
import supabase from "../../lib/supabase";

let lastTimeStamp = 0,
  isUpdating = false,
  lastBlock = 0,
  isRefetching = false;

const MIN_INTERVAL = 10e3,
  BLOCKS_COLLECTION =
    process.env.NODE_ENV === "production" ? "blocks" : "blocks_dev";

interface GasData {
  fastGasPrice?: number;
  lastBlock?: number;
  proposeGasPrice?: number;
  safeGasPrice?: number;
  gasUsedRatio?: string;
  suggestBaseFee?: number;
  timeEstimates?: any[];
  receivedAt?: string;
}

export default async function getData(req, res) {
  if (lastTimeStamp + MIN_INTERVAL < Date.now() && !isUpdating) {
    lastTimeStamp = Date.now();
    isUpdating = true;
    info("refetching data");
    const data = await fetchData();
    if (data) {
      lastBlock = data.lastBlock;
      const { error } = await supabase.from(BLOCKS_COLLECTION).insert([data]);
      if (error) console.error(error);
    }
    isUpdating = false;
    info("done refetching");
  }
  const { data: blocks, error } = await supabase
    .from(BLOCKS_COLLECTION)
    .select("*")
    .order("lastBlock", { ascending: true })
    .limit(50);
  if (error) res.status(error.code).json({ ...error });
  else
    res.status(200).json({
      data: blocks[blocks.length - 1],
      history: blocks,
    });
}

const info = (message?: any) => console.info(`[${Date.now()}] ${message}`);

async function fetchData(): Promise<GasData> {
  const data = await fetch(
    `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${process.env.ETHERSCAN_API_KEY}`
  ).then((res) => res.json());
  if (!data.result) return undefined;
  const { result } = data;
  if (result?.LastBlock <= lastBlock) return undefined;
  const gasData: GasData = {
    fastGasPrice: parseFloat(result.FastGasPrice),
    lastBlock: parseFloat(result.LastBlock),
    proposeGasPrice: parseFloat(result.ProposeGasPrice),
    safeGasPrice: parseFloat(result.SafeGasPrice),
    gasUsedRatio: result.gasUsedRatio,
    suggestBaseFee: parseFloat(result.suggestBaseFee),
    receivedAt: Date.now().toString(),
  };
  const timeData = Object.fromEntries(
    await Promise.all(
      [
        { label: "fast", gwei: gasData.fastGasPrice },
        { label: "standard", gwei: gasData.proposeGasPrice },
        { label: "slow", gwei: gasData.safeGasPrice },
      ].map(({ label, gwei }) =>
        fetch(
          `https://api.etherscan.io/api?module=gastracker&action=gasestimate&gasprice=${
            gwei * 1e9
          }&apikey=${process.env.ETHERSCAN_API_KEY}`
        ).then(async (res) => [label, parseInt((await res.json()).result)])
      )
    )
  );
  gasData.timeEstimates = timeData;
  return gasData;
}
