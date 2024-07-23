


import{ useEffect, useState } from 'react';
import axios from 'axios';

type Notice = {
	index: number;
	input: {
	  index: number;
	};
	payload: string;
      };
      
      
      type GraphQLResponse<T> = {
	data: T;
      };


const Notices = () => {
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    const fetchNotices = async () => {
      const response = await axios.post<GraphQLResponse<{ notices: { edges: { node: Notice }[] } }>>('http://localhost:8080/graphql', {
        query: `
          query notices {
            notices {
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
        `
      });
      setNotices(response.data.data.notices.edges.map(edge => edge.node));
    };

    fetchNotices();

    console.log(notices);
    
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-extrabold text-gray-900 text-center">
        Notices
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
          {notices.map((notice, idx) => (
            <tr key={idx}>
              <td>{notice.index}</td>
              <td>{notice.input.index}</td>
              <td>{notice.payload}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};



export default Notices;
