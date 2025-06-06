import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
);

const MonthlyExpenseChart = ({ expenses }) => {
  if (!expenses || !Array.isArray(expenses)) return <p>Loading chart...</p>;

  // Group total expense by month
  const monthlyTotals = {};

  expenses.forEach((e) => {
    const date = e.date.toDate ? e.date.toDate() : new Date(e.date);
    const key = `${date.getFullYear()}-${date.getMonth()}`; // e.g. "2025-4"
    monthlyTotals[key] = (monthlyTotals[key] || 0) + parseFloat(e.amount);
  });

  // Sort and format labels
  const sortedKeys = Object.keys(monthlyTotals).sort();
  const labels = sortedKeys.map((key) => {
    const [year, month] = key.split("-");
    return new Date(year, month).toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });
  });

  const data = {
    labels,
    datasets: [
      {
        label: "Total Expenses",
        data: sortedKeys.map((key) => monthlyTotals[key]),
        backgroundColor: "#4ade80", // green
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `$${value}`,
        },
        title: {
          display: true,
          text: "Total ($)",
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default MonthlyExpenseChart;
