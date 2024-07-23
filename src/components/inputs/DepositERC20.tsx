import React, { useState } from "react";
import { BaseError, useWriteContract } from "wagmi";
import { ERC20PortalABI } from "../../utils/abi";
import { Erc20PortalAddress } from "../../utils/addresses";
import { Address, erc20Abi, parseEther, stringToHex } from "viem";

const DepositErc20 = () => {
  const dAppAddress = `0xab7528bb862fb57e8a2bcd567a2e929a0be56a5e`;
  const [erc20Value, setErc20Value] = useState("");
  const [tokenAddress, setTokenAddress] = useState<Address | null>();

  const { isPending, isSuccess, error, writeContract, writeContractAsync } =
    useWriteContract();

  const approveERC20 = async (tokenAddress: Address, amount: string) => {
    try {
      writeContractAsync({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: "approve",
        args: [Erc20PortalAddress, parseEther(amount)],
      });

      console.log("ERC20 Approval succesful");
    } catch (error) {
      console.error("Error in approving ERC20:", error);
      throw error; // Re-throw the error to be handled by the caller
    }
  };

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = stringToHex(`Deposited (${erc20Value}).`);

    await approveERC20(tokenAddress as Address, erc20Value);

    writeContract({
      address: Erc20PortalAddress,
      abi: ERC20PortalABI,
      functionName: "depositERC20Tokens",
      args: [tokenAddress, dAppAddress, parseEther(erc20Value), data],
    });
  }

  return (
    <form className="flex flex-col justify-center space-y-4" onSubmit={submit}>
      <h1 className="text-xl text-left font-semibold text-gray-500">
        C. Deposit ERC20
      </h1>
      <input
        type="text"
        className="border rounded p-2 w-full"
        placeholder="ERC20 Token Address"
        value={tokenAddress as Address}
        onChange={(e) => setTokenAddress(e.target.value as Address)}
      />
      <input
        type="text"
        className="border rounded p-2 w-full"
        placeholder="Send erc20 to your backend app"
        value={erc20Value}
        onChange={(e) => setErc20Value(e.target.value)}
      />
      <button
        type="submit"
        className="bg-blue-500 w-full text-white rounded p-2  hover:bg-blue-700"
      >
        {isPending ? <span>Sending...</span> : <span>Send</span>}
      </button>

      {isSuccess && (
        <p className="text-green-500 font-bold">{erc20Value} sent! </p>
      )}

      {error && (
        <div>Error: {(error as BaseError).shortMessage || error.message}</div>
      )}
    </form>
  );
};

export default DepositErc20;
