import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

const ReactApexChartDashboard = () => {
  // New categories - you can change these as per your requirement
  const labels = [
    { name: "Total Sale", color: "#0095ff" },
    { name: "Total Pending", color: "#fdb855" },
    { name: "Total Paid", color: "#00e096" },
    { name: "Revenue", color: "#f45885" },
  ];

  const [chartData, setChartData] = useState({
    series: [
      {
        name: "Total Sale",
        data: [4300, 4500, 4600, 4400, 4500, 4700], // Data for Category D
      },
      {
        name: "Total Pending",
        data: [3200, 3500, 3300, 3400, 3300, 3100], // Data for Category B
      },
      {
        name: "Total Paid",
        data: [2100, 2200, 2150, 2300, 2250, 2400], // Data for Category C
      },
      {
        name: "Revenue",

        data: [5000, 5400, 5200, 5800, 5700, 5900], // Data for Category A
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 500,
      },
      colors: ["#0095ff", "#fdb855", "#00e096", "#f45885"], // Color codes for each category
      grid: {
        show: true,
        borderColor: "#e2e7e7",
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: false,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          borderRadius: 10, // Set the borderRadius to round the bars
          borderRadiusApplication: "end", // Round the bars at the top
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 5,
        colors: ["transparent"],
      },
      xaxis: {
        categories: [
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
        ], // Monthly categories for x-axis
        labels: {
          style: {
            colors: "black",
          },
        },
        axisBorder: {
          show: true,
          color: "black",
        },
      },
      fill: {
        opacity: 1,
      },
    },
  });

  return (
    <div className="col-lg-12 ">
      <div className="col-lg-12 apex-chart">
        <div className="d-flex align-items-center w-100 ">
          <div className="position-relative search_input w-100 ">
            <h3 className="header-title">Sales Overview</h3>
          </div>
        </div>

        <div>
          <div id="chart">
            <ReactApexChart
              options={chartData.options}
              series={chartData.series}
              type="bar"
              height={350}
            />
          </div>
          <div id="html-dist"></div>
        </div>
      </div>

      <div className="d-flex justify-content-center mt-4">
        {/* Displaying category labels dynamically */}
        {labels.map((label, index) => (
          <div key={index} className="d-flex align-items-center mx-2">
            <span
              className="dot"
              style={{
                backgroundColor: label.color,
                height: "10px",
                width: "10px",
                borderRadius: "50%",
                display: "inline-block",
                marginRight: "5px",
              }}
            ></span>
            {label.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReactApexChartDashboard;
