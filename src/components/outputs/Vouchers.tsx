import { useEffect, useState } from "react";
import axios from "axios";
type Voucher = {
  index: number;
  input: {
    index: number;
  };
  destination: string;
  payload: string;
};

type GraphQLResponse<T> = {
  data: T;
};

const Vouchers = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);

  useEffect(() => {
    const fetchVouchers = async () => {
      const response = await axios.post<
        GraphQLResponse<{ vouchers: { edges: { node: Voucher }[] } }>
      >("http://localhost:8080/graphql", {
        query: `
          query vouchers {
            vouchers {
              edges {
                node {
                  index
                  input {
                    index
                  }
                  destination
                  payload
                }
              }
            }
          }
        `,
      });
      setVouchers(response.data.data.vouchers.edges.map((edge) => edge.node));
    };

    fetchVouchers();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-extrabold text-gray-900 text-center">
        Vouchers
      </h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th>Index</th>
            <th>Input Index</th>
            <th>Destination</th>
            <th>Payload</th>
          </tr>
        </thead>
        <tbody>
          {vouchers.map((voucher, idx) => (
            <tr key={idx}>
              <td>{voucher.index}</td>
              <td>{voucher.input.index}</td>
              <td>{voucher.destination}</td>
              <td>{voucher.payload}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Vouchers;
