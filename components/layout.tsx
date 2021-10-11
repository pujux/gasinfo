import Head from "next/head";
import { useEffect, useState } from "react";
import { LayoutProps } from "../@types";
import MoonIcon from "../public/moon.svg";
import SunIcon from "../public/sun.svg";
import GithubIcon from "../public/github.svg";

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
      (window as any).ethereum.hasOwnProperty("isMetaMask")
    ) {
      const addresses = await (window as any).ethereum.request({
        method: "eth_requestAccounts",
      });
      const address = addresses[0];
      console.info("Connected to", address);
      (window as any).ethereum
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
          {title} {title ? " | " : ""} GasInfo - Gas Price Recommender
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
          content="GasInfo - Gas Price Recommender"
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
        <meta name="og:title" content="GasInfo - Gas Price Recommender"></meta>
        <meta
          name="og:description"
          content="Ethereum gas price recommendations based on etherscan.io"
        ></meta>
        <meta name="og:image" content="https://gasinfo.io/logo.png"></meta>
        <meta name="og:url" content="https://gasinfo.io"></meta>
        <meta
          name="og:site_name"
          content="GasInfo - Gas Price Recommender"
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
              GasInfo
            </h1>
            <h2 className="mt-1 ml-4 text-sm font-bold md:text-xl text-secondaryTextLight dark:text-secondaryTextDark">
              Ethereum Gas Price Recommender
            </h2>
          </div>
          <div className="flex items-center">
            <GithubIcon
              className="transition-none cursor-pointer fill-current text-primaryTextLight dark:text-primaryTextDark"
              onClick={() => window.open("https://github.com/puf17640/gasinfo")}
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
          <div className="flex flex-col items-center justify-center p-4 md:flex-row">
            <p className="pb-2 underline md:p-0">Tip me:</p>
            <div
              className="pb-2 border-gray-500 cursor-pointer md:px-2 md:pb-0 md:border-r-2"
              onClick={() => sendTip(0.005)}
            >
              Ξ0.005
            </div>
            <div
              className="pb-2 border-gray-500 cursor-pointer md:px-2 md:pb-0 md:border-r-2"
              onClick={() => sendTip(0.01)}
            >
              Ξ0.01
            </div>
            <div
              className="pb-2 border-gray-500 cursor-pointer md:px-2 md:pb-0 md:border-r-2"
              onClick={() => sendTip(0.05)}
            >
              Ξ0.05
            </div>
            <div
              className="pb-2 cursor-pointer md:pb-0 md:pl-2"
              onClick={() => sendTip(0.1)}
            >
              Ξ0.1
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
