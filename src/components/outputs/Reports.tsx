import { useEffect, useState } from "react";
import axios from "axios";

type Report = {
  index: number;
  input: {
    index: number;
  };
  payload: string;
};

type GraphQLResponse<T> = {
  data: T;
};

const Reports = () => {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const fetchReports = async () => {
      const response = await axios.post<
        GraphQLResponse<{ reports: { edges: { node: Report }[] } }>
      >("http://localhost:8080/graphql", {
        query: `
          query reports {
            reports {
              edges {
                node {
                  index
                  input {
                    index
                  }
                  payload
                }
              }
            }
          }
        `,
      });
      setReports(response.data.data.reports.edges.map((edge) => edge.node));
    };

    fetchReports();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-extrabold text-gray-900 text-center">
        Reports
      </h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th>Index</th>
            <th>Input Index</th>
            <th>Payload</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report, idx) => (
            <tr key={idx}>
              <td>{report.index}</td>
              <td>{report.input.index}</td>
              <td>{report.payload}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Reports;
