import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { useState } from "react";
import SimpleInput from "./SimpleInput";

function App() {
  const account = useAccount();
  const { connectors, connect, status, error } = useConnect();
  const { disconnect } = useDisconnect();

  const { chains, switchChain } = useSwitchChain();
  const [isChainDropdownOpen, setIsChainDropdownOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full space-y-8">
        <div className="space-y-4">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center">
            Account
          </h2>

          <div className="bg-gray-50 rounded-md p-4 text-sm text-gray-700">
            <p>
              <span className="font-semibold">Status:</span>{" "}
              <span className="text-green-600 font-bold">
                {account.status.toLocaleUpperCase()}{" "}
              </span>
            </p>
            <p>
              <span className="font-semibold">Address:</span> {account.address}
            </p>
            <p>
              <span className="font-semibold">Chain:</span>{" "}
              {account.chain?.name}
            </p>
          </div>

          {account.status === "connected" && (
            <div className="space-y-4">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsChainDropdownOpen(!isChainDropdownOpen)}
                  className="w-full flex justify-between items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  Switch Chain
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                {isChainDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1">
                    {chains.map((chainOption) => (
                      <button
                        key={chainOption.id}
                        onClick={() => {
                          switchChain({ chainId: chainOption.id });
                          setIsChainDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {chainOption.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => disconnect()}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
              >
                Disconnect
              </button>
            </div>
          )}
        </div>

        {account.status !== "connected" && (
          <div className="space-y-4">
            <h2 className="text-3xl font-extrabold text-gray-900 text-center">
              Connect
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {connectors.map((connector) => (
                <button
                  key={connector.id}
                  onClick={() => connect({ connector })}
                  type="button"
                  className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  {connector.name}
                </button>
              ))}
            </div>
            <div className="text-center text-sm text-gray-600">{status}</div>
            {error && (
              <div className="text-center text-sm text-red-600">
                {error.message}
              </div>
            )}
          </div>
        )}

        {account.status === "connected" && <SimpleInput />}
      </div>
    </div>
  );
}

export default App;
