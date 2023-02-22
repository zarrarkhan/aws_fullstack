/* src/App.js */
import React, { useEffect, useState } from "react";
import { Amplify, API, graphqlOperation } from "aws-amplify";
import { listData } from "./graphql/queries";
import awsExports from "./aws-exports";
import crossfilter from "crossfilter";
import {
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Legend,
  CartesianGrid,
} from "recharts";
Amplify.configure(awsExports);

const filter = {};

function FilteredItemsList({ filter }) {
  const data1 = [
    { name: "A", value: 10 },
    { name: "B", value: 20 },
    { name: "C", value: 30 },
    { name: "D", value: 40 },
  ];

  const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const [barData, setBarData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [barData1, setBarData1] = useState([]);
  const [pieData1, setPieData1] = useState([]);

  useEffect(() => {
    const cf = crossfilter(data1);

    const barDimension = cf.dimension((d) => d.name);
    const barGroup = barDimension.group().reduceSum((d) => d.value);

    const pieDimension = cf.dimension((d) => d.name);
    const pieGroup = pieDimension.group().reduceSum((d) => d.value);

    const barChartData = barGroup.all().map((d) => ({
      name: d.key,
      value: d.value,
    }));
    setBarData(barChartData);

    const pieChartData = pieGroup.all().map((d, i) => ({
      name: d.key,
      value: d.value,
      color: colors[i],
    }));
    setPieData(pieChartData);
  }, []);

  useEffect(() => {
    const cf = crossfilter(data);

    const barDimension = cf.dimension((d) => d.name);
    const barGroup = barDimension.group().reduceSum((d) => d.value);

    const pieDimension = cf.dimension((d) => d.name);
    const pieGroup = pieDimension.group().reduceSum((d) => d.value);

    const barChartData = barGroup.all().map((d) => ({
      name: d.key,
      value: d.value,
    }));
    setBarData1(barChartData);

    const pieChartData = pieGroup.all().map((d, i) => ({
      name: d.key,
      value: d.value,
      color: colors[i],
    }));
    setPieData1(pieChartData);
  }, []);


  const BarChartComponent2 = () => (
    <BarChart width={600} height={300} data={barData}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <CartesianGrid strokeDasharray="3 3" />
      <Bar dataKey="value" fill="#8884d8" />
    </BarChart>
  );

  const PieChartComponent2 = () => (
    <PieChart width={600} height={300}>
      <Pie
        data={pieData}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={100}
        fill="#8884d8"
        label
      >
        {pieData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await API.graphql(
          graphqlOperation(listData, { filter })
        );
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

  const data = items.map((item) => ({ name: item.id, value: item.value }));

  const BarChartComponent = () => (
    <BarChart width={600} height={400} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="value" fill="#8884d8" />
    </BarChart>
  );

  const BarChartComponent1 = () => (
    <BarChart width={600} height={300} data={barData1}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <CartesianGrid strokeDasharray="3 3" />
      <Bar dataKey="value" fill="#8884d8" />
    </BarChart>
  );

  const PieChartComponent = () => (
    <PieChart width={600} height={300}>
      <Pie
        data={pieData1}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={100}
        fill="#8884d8"
        label
      >
        {pieData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );

  return (
    <div>
      <div height="30px" width="30px">
        <h1>My Bar Chart</h1>
        <BarChartComponent />
        <BarChartComponent1 />
        <PieChartComponent />
        <BarChartComponent2 />
        <PieChartComponent2 />
      </div>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <h3>ID = {item.id}</h3>
            <p>Value ={item.value}</p>
          </li>
        ))}
      </ul>
    </div>
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
