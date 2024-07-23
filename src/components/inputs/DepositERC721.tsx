import React, { useState } from "react";
import { BaseError, useWriteContract } from "wagmi";
import { ERC721PortalABI } from "../../utils/abi";
import { Erc721PortalAddress } from "../../utils/addresses";
import { stringToHex, erc721Abi, Address } from "viem";

const DepositErc721 = () => {
  const dAppAddress = `0xab7528bb862fb57e8a2bcd567a2e929a0be56a5e`;
  const [tokenId, setTokenId] = useState<string>("");
  const [tokenAddress, setTokenAddress] = useState("");

  const { isPending, isSuccess, error, writeContract, writeContractAsync } =
    useWriteContract();

  const approveERC721 = async (tokenAddress: Address, tokenId: bigint) => {
    try {
      await writeContractAsync({
        address: tokenAddress,
        abi: erc721Abi,
        functionName: "approve",
        args: [Erc721PortalAddress, tokenId],
      });

      console.log("Approval successful");
    } catch (error) {
      console.error("Error in approving ERC721:", error);
      throw error; // Re-throw the error to be handled by the caller
    }
  };

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const bigIntTokenId = BigInt(tokenId);
    const data = stringToHex(`Deposited NFT of token id:(${bigIntTokenId}).`);

    await approveERC721(tokenAddress as Address, bigIntTokenId);

    writeContract({
      address: Erc721PortalAddress,
      abi: ERC721PortalABI,
      functionName: "depositERC721Token",
      args: [tokenAddress, dAppAddress, bigIntTokenId, "0x", data],
    });
  }

  return (
    <form className="flex flex-col justify-center space-y-4" onSubmit={submit}>
      <h1 className="text-xl text-left font-semibold text-gray-500">
        D. Deposit ERC721
      </h1>
      <input
        type="text"
        className="border rounded p-2 w-full"
        placeholder="ERC721 Token Address"
        value={tokenAddress}
        onChange={(e) => setTokenAddress(e.target.value)}
      />
      <input
        type="text"
        className="border rounded p-2 w-full"
        placeholder="Token id"
        value={tokenId}
        onChange={(e) => setTokenId(e.target.value)}
      />
      <button
        type="submit"
        className="bg-blue-500 w-full text-white rounded p-2 hover:bg-blue-700"
      >
        {isPending ? <span>Sending...</span> : <span>Send</span>}
      </button>

      {isSuccess && (
        <p className="text-green-500 font-bold">
          NFT of Token number: {tokenId} sent!
        </p>
      )}

      {error && (
        <div>Error: {(error as BaseError).shortMessage || error.message}</div>
      )}
    </form>
  );
};

export default DepositErc721;
