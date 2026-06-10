import React from "react";
import Chart from "react-apexcharts";
import { Card, CardContent, Typography, Box } from "@mui/material";

const LeadsStatusChart = ({ leads_status_graph = [] }) => {
  const hasData = leads_status_graph && leads_status_graph.length > 0;

  // Find max value from graph
  const maxValue = Math.max(
    ...leads_status_graph.map((item) => item?.count || 0),
    1,
  );

  const chartData = {
    series: [
      {
        name: "Leads Status",
        data: leads_status_graph?.map((item) => item?.count || 0),
      },
    ],

    options: {
      chart: {
        type: "line",
        height: 350,
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
      },

      dataLabels: {
        enabled: true,
      },

      stroke: {
        curve: "smooth",
        width: 4,
      },

      markers: {
        size: 6,
        strokeWidth: 2,
        hover: {
          size: 8,
        },
      },

      legend: {
        show: false,
      },

      grid: {
        borderColor: "#e5e7eb",
        strokeDashArray: 4,
      },

      xaxis: {
        categories: leads_status_graph?.map((item) => item?.title || "Unknown"),

        title: {
          text: "Lead Status",
        },

        labels: {
          style: {
            fontSize: "12px",
            fontWeight: 500,
          },
        },
      },

      yaxis: {
        min: 0,
        max: maxValue,

        tickAmount: maxValue,

        forceNiceScale: false,

        title: {
          text: "Total Lead Status",
        },

        labels: {
          formatter: function (val) {
            // Sirf integer values show hongi
            return Number.isInteger(val) ? val : "";
          },

          style: {
            fontSize: "12px",
          },
        },
      },

      tooltip: {
        y: {
          formatter: function (val) {
            return `${val} Leads`;
          },
        },
      },

      colors: ["#5792c9"],

      title: {
        text: "Leads Status Overview",
        align: "left",

        style: {
          fontSize: "16px",
          fontWeight: 600,
        },
      },
    },
  };

  return (
    <Card className="h-100">
      <CardContent>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            fontWeight: 600,
            mb: 2,
          }}
        >
          Leads Status Chart
        </Typography>

        {!hasData ? (
          <Box
            sx={{
              height: 420,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              textAlign: "center",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: "#8a8a8a",
                fontWeight: 600,
              }}
            >
              No Leads Data Found
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "#b0b0b0",
                mt: 1,
              }}
            >
              There is currently no lead status data available.
            </Typography>
          </Box>
        ) : (
          <Chart
            options={chartData.options}
            series={chartData.series}
            type="line"
            height={480}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default LeadsStatusChart;
