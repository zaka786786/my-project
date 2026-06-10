import React from "react";
import Chart from "react-apexcharts";
import { Card, CardContent, Typography } from "@mui/material";

const SalesVolumeChart = () => {
  const chartData = {
    series: [
      {
        name: "Sales Volume",
        data: [120, 200, 150, 180, 220, 300, 250],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
        toolbar: { show: false },
      },
      plotOptions: {
        bar: {
          borderRadius: 5,
          columnWidth: "45%",
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        title: {
          text: "Day of the Week",
        },
      },
      yaxis: {
        title: {
          text: "Number of Sales",
        },
      },
      colors: ["#4e8ad9"],
      title: {
        text: "Daily / Weekly Sales Volume",
        align: "left",
      },
    },
  };

  return (
    <Card sx={{ marginTop: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Daily / Weekly Sales
        </Typography>
        <Chart
          options={chartData.options}
          series={chartData.series}
          type="bar"
          height={450}
        />
      </CardContent>
    </Card>
  );
};

export default SalesVolumeChart;
