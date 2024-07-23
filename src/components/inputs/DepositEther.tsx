import React, { useState } from "react";
import { BaseError, useWriteContract } from "wagmi";
import { EtherPortalABI } from "../../utils/abi";
import { EtherPortalAddress } from "../../utils/addresses";
import { parseEther, stringToHex } from "viem";

const DepositEther = () => {
  const dAppAddress = `0xab7528bb862fb57e8a2bcd567a2e929a0be56a5e`;
  const [etherValue, setEtherValue] = useState("");

  const { isPending, isSuccess, error, writeContract } = useWriteContract();

  async function submit(event: React.FormEvent<HTMLFormElement>) {

    event.preventDefault();

    const data = stringToHex(`Deposited (${etherValue}) ether.`);

    writeContract({
      address: EtherPortalAddress,
      abi: EtherPortalABI,
      functionName: "depositEther",
      args: [dAppAddress, data],
      value: parseEther(etherValue),
    });
  }

  return (
    <form className="flex flex-col justify-center space-y-4" onSubmit={submit}>
      <h1 className="text-xl text-left font-semibold text-gray-500">
        B. Deposit Ether
      </h1>
      <input
        type="text"
        className="border rounded p-2 w-full"
        placeholder="Send ether to your backend app"
        value={etherValue}
        onChange={(e) => setEtherValue(e.target.value)}
      />
      <button
        type="submit"
        className="bg-blue-500 w-full text-white rounded p-2  hover:bg-blue-700"
      >
        {isPending ? <span>Sending...</span> : <span>Send</span>}
      </button>

      {isSuccess && (
        <p className="text-green-500 font-bold">{etherValue} ETH sent! </p>
      )}

      {error && (
        <div>Error: {(error as BaseError).shortMessage || error.message}</div>
      )}
    </form>
  );
};

export default DepositEther;
