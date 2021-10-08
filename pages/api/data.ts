import { fetch } from "cross-fetch";
import firestore from "../../lib/firebase";

let lastTimeStamp = 0,
  lastBlock = 0,
  isRefetching = false;

const MIN_INTERVAL = 5e3;

interface GasData {
  fastGasPrice?: number;
  lastBlock?: number;
  proposeGasPrice?: number;
  safeGasPrice?: number;
  gasUsedRatio?: string;
  suggestBaseFee?: number;
  timeEstimates?: any[];
  receivedAt?: number;
}

export default async function getData(req, res) {
  if (lastTimeStamp + MIN_INTERVAL < Date.now()) {
    const { isUpdating } = await (
      await firestore.collection("meta").doc("meta").get()
    ).data();
    if (!isUpdating) {
      lastTimeStamp = Date.now();
      await firestore
        .collection("meta")
        .doc("meta")
        .update({ isUpdating: true });
      info("refetching data");
      const data = await fetchData();
      if (data) {
        lastBlock = data.lastBlock;
        await firestore.collection("blocks").add(data);
      }
      await firestore
        .collection("meta")
        .doc("meta")
        .update({ isUpdating: false });
      info("done refetching");
    }
  }
  await firestore
    .collection("blocks")
    .orderBy("receivedAt")
    .get()
    .then((snap) =>
      res.status(200).json({
        data: snap.docs[snap.size - 1].data(),
        history: snap.docs.map((doc) => doc.data()),
      })
    )
    .catch((error) => res.json({ error }));
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
    receivedAt: Date.now(),
  };
  const timeData = (
    await Promise.all(
      [gasData.fastGasPrice, gasData.proposeGasPrice, gasData.safeGasPrice].map(
        (gwei) =>
          fetch(
            `https://api.etherscan.io/api?module=gastracker&action=gasestimate&gasprice=${
              gwei * 1e9
            }&apikey=${process.env.ETHERSCAN_API_KEY}`
          ).then((res) => res.json())
      )
    )
  ).map(({ result }) => (typeof result === "number" ? result : null));
  gasData.timeEstimates = timeData;
  return gasData;
}
