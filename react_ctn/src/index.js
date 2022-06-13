import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { WagmiConfig, createClient, chain, configureChains } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";

const { chains, provider, webSocketProvider } = configureChains(
  [chain.localhost],
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: `http://localhost:8545`,
      }),
    }),
    publicProvider(),
  ]
);

const client = createClient({
  autoConnect: true,
  connectors: [new MetaMaskConnector({ chains })],
  provider,
  webSocketProvider,
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <WagmiConfig client={client}>
      <App />
    </WagmiConfig>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
