import React, { useState } from "react";
import { BaseError, useWriteContract } from "wagmi";
import { InputBoxABI } from "./utils/abi";
import { InputBoxAddress } from "./utils/addresses";
import { stringToHex } from "viem";

const SimpleInput = () => {
  const dAppAddress = `0xab7528bb862fb57e8a2bcd567a2e929a0be56a5e`;
  const [inputValue, setInputValue] = useState("");

  const {
    data: hash,
    isPending,
    isSuccess,
    error,
    writeContract,
  } = useWriteContract();

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    console.log(JSON.stringify(inputValue));

    event.preventDefault();

    writeContract({
      address: InputBoxAddress,
      abi: InputBoxABI,
      functionName: "addInput",
      args: [dAppAddress, stringToHex(inputValue)],
    });
  }

  return (
    <form className="flex flex-col justify-center space-y-4" onSubmit={submit}>
      <h1 className="text-xl text-left font-semibold text-gray-500">
        A. Send a generic input
      </h1>
      <input
        type="text"
        className="border rounded p-2 w-full"
        placeholder="Enter something"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button
        type="submit"
        className="bg-blue-500 w-full text-white rounded p-2  hover:bg-blue-700"
      >
        {isPending ? <span>Sending...</span> : <span>Send</span>}
      </button>

      {hash && <p className="w-64 overflow-hidden">Transaction Hash: {hash}</p>}
      {isSuccess && (
        <p className="text-green-500 font-bold">Transaction Sent</p>
      )}

      {error && (
        <div>Error: {(error as BaseError).shortMessage || error.message}</div>
      )}
    </form>
  );
};

export default SimpleInput;
