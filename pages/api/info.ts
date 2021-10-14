export default function getInfo(req, res) {
  res.status(200).send({
    info: [
      {
        name: "ETH",
        type: "Transfer",
        gasUsed: 21000,
      },
      {
        name: "USDT",
        type: "Transfer",
        gasUsed: 46109,
        gasLink:
          "https://etherscan.io/tx/0x060babb87d37e81a2d97244f2866709e4ee19b27b93a5b7356be048cd193eaed",
      },
      {
        name: "USDC",
        type: "Transfer",
        gasUsed: 48481,
        gasLink:
          "https://etherscan.io/tx/0x8f771b091c96d1ccb852c5df1ed4aff93755a4f4a5e922f000770c9646528ef6",
      },
      {
        name: "DAI",
        type: "Transfer",
        gasUsed: 34718,
        gasLink:
          "https://etherscan.io/tx/0x8f58ccac094237196f8fe2c0fb980faa80dd41d0c051ab692251e96a53cd19ef",
      },
      {
        name: "UniswapV3",
        type: "Swap",
        gasUsed: 129830,
        gasLink:
          "https://etherscan.io/tx/0x5e1b0897800e005d02e9051aec269cedea73b2f59f7b208ae460b4027ebac575",
      },
      {
        name: "UniswapV3",
        shortType: "+ LP",
        type: "Add Liquidity",
        gasUsed: 445784,
        gasLink:
          "https://etherscan.io/tx/0xc4d202633c8e27e41216b348f64f1f2c7f21cd6a79c2a457f0f920aefb616bbf",
      },
      {
        name: "UniswapV3",
        shortType: "- LP",
        type: "Remove Liquidity",
        gasUsed: 221722,
        gasLink:
          "https://etherscan.io/tx/0xaa83ff4c83ad5ef62213b54c8774992661fb3864657edd85ed6991011af3cdbe",
      },
      {
        name: "UniswapV2",
        type: "Swap",
        gasUsed: 105657,
        gasLink:
          "https://etherscan.io/tx/0xdf5a48258d3b43899dcaa3e05754f0a70279fcfaf98746fad81fbb5bef8ce6c5",
      },
      {
        name: "UniswapV2",
        shortType: "+ LP",
        type: "Add Liquidity",
        gasUsed: 131820,
        gasLink:
          "https://etherscan.io/tx/0x814104644915370c9bcf23dd834a61839f3c4b6a225086b54fa3a3b0621bf249",
      },
      {
        name: "UniswapV2",
        shortType: "- LP",
        type: "Remove Liquidity",
        gasUsed: 180244,
        gasLink:
          "https://etherscan.io/tx/0xce0110cc934d1ed69efd7fabe4ba38ba557f57c614ed6137bc11d28b72f4bf39",
      },
      {
        name: "1inch",
        type: "Swap",
        gasUsed: 104108,
        gasLink:
          "https://etherscan.io/tx/0x3b5c243f02e8eded9b25a258b381429de83e1854d4eaafce456f79a04ffd4890",
      },
      {
        name: "SushiSwap",
        type: "Swap",
        gasUsed: 109253,
        gasLink:
          "https://etherscan.io/tx/0xcf8ba925887ca185f8cd98fa986f728012b1f7b47f82d6a258ea9ac2aed8c811",
      },
      {
        name: "0x",
        type: "Swap",
        gasUsed: 114931,
        gasLink:
          "https://etherscan.io/tx/0x0860f56786601da581dfe5f431583827136356b967b42482d37593fa00adfdc6",
      },
    ],
  });
}
