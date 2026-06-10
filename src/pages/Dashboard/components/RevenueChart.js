import React from "react";
import Chart from "react-apexcharts";
import { Card, CardContent, Typography } from "@mui/material";

const RevenueChart = ({ revenue_graph }) => {
  let currency = "Rs";
  const chartData = {
    series: [
      {
        name: "Revenue",
        // Fix: Remove commas and convert string to float
        data: revenue_graph?.map(
          (item) =>
            parseFloat(item?.total_revenue?.toString().replace(/,/g, "")) || 0,
        ),
      },
    ],
    options: {
      chart: {
        type: "line",
        height: 350,
        toolbar: { show: false },
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        title: {
          text: "Month",
        },
      },
      yaxis: {
        title: {
          text: "Revenue",
        },
        labels: {
          formatter: function (val) {
            if (val >= 1_000_000_000)
              return currency + " " + (val / 1_000_000_000).toFixed(1) + "B";
            if (val >= 1_000_000)
              return currency + " " + (val / 1_000_000).toFixed(1) + "M";
            return currency + " " + val.toFixed(1);
          },
        },
      },
      tooltip: {
        y: {
          formatter: function (val) {
            if (val >= 1_000_000_000)
              return (
                currency + " " + (val / 1_000_000_000).toFixed(2) + " Billion"
              );
            if (val >= 1_000_000)
              return currency + " " + (val / 1_000_000).toFixed(2) + " Million";
            return currency + " " + val.toFixed(2);
          },
        },
      },
      colors: ["#5792c9"],
      stroke: {
        curve: "smooth",
      },
      title: {
        text: "Monthly Revenue Overview",
        align: "left",
      },
    },
  };

  return (
    <Card className="h-100">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Revenue Chart
        </Typography>
        <Chart
          options={chartData.options}
          series={chartData.series}
          type="line"
          height={480}
        />
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
