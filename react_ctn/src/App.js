import logo from "./logo.svg";
import "./App.css";
import {
  useConnect,
  useAccount,
  useNetwork,
  chain,
  useDisconnect,
  useContractRead,
  useContractWrite,
} from "wagmi";
import { useState, useEffect } from "react";
import { contractAddress, contractABI } from "./configs/contract";

function App() {
  const { connect, connectors, error, isConnecting, pendingConnector } =
    useConnect();
  const { data: account } = useAccount();
  const { activeChain, switchNetwork } = useNetwork({
    chainId: chain.localhost.id,
  });
  const { disconnect } = useDisconnect();

  // 無法抓新地址的值, 只會抓建立合約地址的值
  const {
    data: balanceOfMine,
    isbalanceError,
    isbalanceLoading,
  } = useContractRead(
    {
      addressOrName: contractAddress,
      contractInterface: contractABI,
    },
    "balanceOfMine",
    { watch: true }
  );

  // 可以抓新地址的balance
  const { data: balanceOf } = useContractRead(
    {
      addressOrName: contractAddress,
      contractInterface: contractABI,
    },
    "balanceOf",
    {
      args: [account?.address],
      watch: true,
    }
  );

  const {
    data: totalSupply,
    issupplyError,
    issupplyLoading,
  } = useContractRead(
    {
      addressOrName: contractAddress,
      contractInterface: contractABI,
    },
    "totalSupply",
    { watch: true }
  );

  const { write: Mint } = useContractWrite(
    {
      addressOrName: contractAddress,
      contractInterface: contractABI,
    },
    "Mint"
  );

  useEffect(() => {
    if (activeChain && activeChain.id !== chain.localhost.id) {
      switchNetwork();
    }
  }, [activeChain]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {account ? (
          <div>
            <div>Wallet Address: {account.address}</div>
            <div>
              <button onClick={Mint}>Mint Your NFT</button>
              {balanceOfMine && (
                <div>Your token count: {balanceOfMine.toString()}</div>
              )}
              {balanceOf && (
                <div>Exact token count: {balanceOf.toString()}</div>
              )}
              {totalSupply && (
                <div>Total token supply: {totalSupply.toString()}</div>
              )}
            </div>
            <button onClick={disconnect}>Disconnect</button>
          </div>
        ) : (
          <div>
            {connectors.map((connector) => (
              <button
                disabled={!connector.ready}
                key={connector.id}
                onClick={() => connect(connector)} //連結功能
              >
                {connector.name}
                {!connector.ready && "No Support"}
                {isConnecting &&
                  connector.id === pendingConnector?.id &&
                  "Connecting"}
              </button>
            ))}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
