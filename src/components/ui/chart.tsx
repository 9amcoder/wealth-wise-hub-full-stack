"use client";
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip
);

const options = {
  plugins: {
    legend: {
      display: true,
    },
    title: {
      display: true,
      text: " Statistics",
    },
  },
  responsive: true,
  scales: {
    y: {
      type: "linear" as const, // specify the type as a constant
    },
  },
};

const LineChartComponent = ({ data }: any) => {
  return (
    <div>
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChartComponent;
