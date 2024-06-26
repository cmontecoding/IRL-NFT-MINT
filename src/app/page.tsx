"use client";
import { ConnectButton, TransactionButton, useReadContract } from "thirdweb/react";
import { client } from "./client";
import { createWallet } from "thirdweb/wallets";
import { defineChain, getContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { getNFT, balanceOf, claimTo } from "thirdweb/extensions/erc1155"
import { MediaRenderer, useActiveAccount } from "thirdweb/react";

export default function Home() {
  const account = useActiveAccount();
  const wallets = [
    createWallet("com.coinbase.wallet")
  ]; 
  const contract = getContract({ 
    client: client,
    chain: defineChain( baseSepolia ),
    address: "0xa6FFd2FCF3967dA69e758e95FF019A547EF42607"
  });

  const { data:nft, isLoading: nftIsLoading } = useReadContract(
    getNFT,
    {
      contract: contract,
      tokenId: 0n
    }
  )

  const { data: ownedNFTs } = useReadContract(
    balanceOf,
    {
      contract: contract,
      owner: account?.address || "0x0000000000000000000000000000000000000000",
      tokenId: 0n
    }
  )

  return (
    <main className="p-4 pb-10 min-h-[100vh] flex items-center justify-center container max-w-screen-lg mx-auto">
      <div className="flex flex-col items-center py-20">
        <ConnectButton
          client={client}
          wallets={wallets} 
          chain={defineChain( baseSepolia )}
          connectButton = {{
            label: "Connect with Coinbase Smart Wallet"
          }}
        ></ConnectButton>
        <div className="flex flex-col my-8">
          {nftIsLoading ? (
            <p>Loading...</p>
          ) : (
            <>
            {nft && (
              <MediaRenderer
              client={client}
              src={nft.metadata.image}
              />
            )}
            {account ? (
              <>
              <p className="text-center mt-8">
                You own {ownedNFTs?.toString()} NFTs
              </p>
              <TransactionButton
                transaction={() =>
                  claimTo({
                    contract: contract,
                    to: account.address,
                    tokenId: 0n,
                    quantity: 1n
                  })
                }
                onTransactionConfirmed={async () => {
                  alert("NFT claimed!");
                }}
              >Claim</TransactionButton>
              </>
            ) : (
              <p>Connect Coinbase Smart Wallet to claim NFT</p>
            )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
