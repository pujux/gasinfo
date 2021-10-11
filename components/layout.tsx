import Head from "next/head";
import { useEffect, useState } from "react";
import { LayoutProps } from "../@types";
import MoonIcon from "../public/moon.svg";
import SunIcon from "../public/sun.svg";
import DiscordIcon from "../public/discord.svg";

function Layout({ title, children }: LayoutProps) {
  const [isDarkmode, setIsDarkmode] = useState(false);

  const toggleDarkmode = (darkmode) => {
    if (darkmode) {
      document.documentElement.classList.add("dark");
      document.querySelector("html").style.backgroundColor =
        "rgba(31, 32, 33, 1)";
    } else {
      document.documentElement.classList.remove("dark");
      document.querySelector("html").style.backgroundColor =
        "rgba(255, 255, 255, 1)";
    }
    localStorage.setItem("theme", darkmode ? "dark" : "light");
    setIsDarkmode(darkmode);
  };

  const sendTip = async (amount) => {
    if (
      window.hasOwnProperty("ethereum") &&
      window.ethereum.hasOwnProperty("isMetaMask")
    ) {
      const addresses = await ethereum.request({
        method: "eth_requestAccounts",
      });
      const address = addresses[0];
      console.info("Connected to", address);
      ethereum
        .request({
          method: "eth_sendTransaction",
          params: [
            {
              from: address,
              to: "0x60CDac3cd0Ba3445D776B31B46E34623723C6482",
              value: (amount * 1e18).toString(16),
            },
          ],
        })
        .then((txHash) => {
          console.log(txHash);
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      return alert(
        "Install MetaMask to use this cool feature. https://metamask.io"
      );
    }
  };

  useEffect(() => {
    toggleDarkmode(
      typeof localStorage.getItem("theme") === "string"
        ? localStorage.getItem("theme") === "dark"
        : window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  }, []);

  return (
    <div>
      <Head>
        <title>
          {title} {title ? " | " : ""} EthGas - Gas Price Recommender
        </title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Ethereum gas price recommendations based on etherscan.io"
        ></meta>
        <meta name="image" content="https://gasinfo.io/logo.png"></meta>
        <meta name="twitter:card" content="summary"></meta>
        <meta
          name="twitter:title"
          content="EthGas - Gas Price Recommender"
        ></meta>
        <meta
          name="twitter:description"
          content="Ethereum gas price recommendations based on etherscan.io"
        ></meta>
        <meta
          name="twitter:image:src"
          content="https://gasinfo.io/logo.png"
        ></meta>
        <meta name="twitter:creator" content="@0xPUF17640"></meta>
        <meta name="og:title" content="EthGas - Gas Price Recommender"></meta>
        <meta
          name="og:description"
          content="Ethereum gas price recommendations based on etherscan.io"
        ></meta>
        <meta name="og:image" content="https://gasinfo.io/logo.png"></meta>
        <meta name="og:url" content="https://gasinfo.io"></meta>
        <meta
          name="og:site_name"
          content="EthGas - Gas Price Recommender"
        ></meta>
        <meta name="og:type" content="website"></meta>
        <meta
          name="keywords"
          content="gas,gasprice,eth,ethereum,price,gasnow,gasnow.org"
        ></meta>
        <meta name="robots" content="index, follow"></meta>
        <meta
          http-equiv="Content-Type"
          content="text/html; charset=utf-8"
        ></meta>
        <meta name="language" content="English"></meta>
        <meta name="revisit-after" content="14 days"></meta>
        <meta name="author" content="https://pufler.dev"></meta>
      </Head>
      <header className="p-4 mb-6 shadow-md bg-secondaryBackgroundLight dark:bg-secondaryBackgroundDark">
        <div className="flex justify-between max-w-4xl mx-auto">
          <div className="flex items-center">
            <img className="w-8" alt="logo" src="/logo.png"></img>
            <h1 className="ml-2 text-2xl font-bold md:text-3xl text-accentText">
              EthGas
            </h1>
            <h2 className="mt-1 ml-4 text-sm font-bold md:text-xl text-secondaryTextLight dark:text-secondaryTextDark">
              Ethereum Gas Price Recommender
            </h2>
          </div>
          <div className="flex items-center">
            <DiscordIcon
              className="hidden transition-none fill-current ctursor-pointer text-primaryTextLight dark:text-primaryTextDark"
              onClick={() => window.open("https://discord.gg/VEa8xXw6CK")}
            />
            <div className="w-5"></div>
            {isDarkmode ? (
              <SunIcon
                className="cursor-pointer fill-current text-primaryTextDark"
                onClick={() => toggleDarkmode(!isDarkmode)}
              />
            ) : (
              <MoonIcon
                className="cursor-pointer fill-current text-primaryTextLight"
                onClick={() => toggleDarkmode(!isDarkmode)}
              />
            )}
          </div>
        </div>
      </header>
      <div className="container flex flex-col mx-auto overflow-hidden">
        <main className="flex flex-col flex-1">{children}</main>
      </div>
      <footer className="px-16 py-4 shadow-md bg-secondaryBackgroundLight dark:bg-secondaryBackgroundDark text-secondaryTextLight dark:text-secondaryTextDark">
        <div className="mx-auto text-center md:container">
          <div className="flex items-center justify-center p-4">
            <p className="underline">Tip me:</p>
            <div
              className="px-2 border-r-2 cursor-pointer"
              onClick={() => sendTip(0.005)}
            >
              0.005 Ξ
            </div>
            <div
              className="px-2 border-r-2 cursor-pointer"
              onClick={() => sendTip(0.01)}
            >
              0.01 Ξ
            </div>
            <div
              className="px-2 border-r-2 cursor-pointer"
              onClick={() => sendTip(0.05)}
            >
              0.05 Ξ
            </div>
            <div className="pl-2 cursor-pointer" onClick={() => sendTip(0.1)}>
              0.1 Ξ
            </div>
          </div>
          <p>
            © {new Date().getFullYear()}{" "}
            <a className="underline text-accentText" href="https://pufler.dev">
              Julian Pufler
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
export default Layout;
