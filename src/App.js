/* src/App.js */
import React, { useEffect, useState } from "react";
import { Amplify, API, graphqlOperation } from "aws-amplify";
import { listData } from "./graphql/queries";
import awsExports from "./aws-exports";
Amplify.configure(awsExports);

const filter = {
  id: {
    contains: 'id16'
  }
};

function FilteredItemsList({ filter }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await API.graphql(graphqlOperation(listData, { filter }));
        setItems(data.listData.items);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    }

    fetchData();
  }, [filter]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          <h3>{item.id}</h3>
          <p>{item.value}</p>
        </li>
      ))}
    </ul>
  );
}

const App = () => {

  return (
    <div>
      <div>Hi</div>
      <div>
      <FilteredItemsList filter={filter} />
      </div>
    </div>
  );
};

export default App;
