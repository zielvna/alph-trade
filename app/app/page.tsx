import { AlephiumWalletProvider } from "@alephium/web3-react";
import { Header } from "./components/Header";
import { web3 } from "@alephium/web3";

web3.setCurrentNodeProvider("http://127.0.0.1:22973");

export default function Home() {
  return (
    <AlephiumWalletProvider network="devnet">
      <Header />
    </AlephiumWalletProvider>
  );
}
