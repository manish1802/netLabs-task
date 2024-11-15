import React from "react";
import { Row, Col } from "react-bootstrap";
import { Bar, Doughnut } from "react-chartjs-2";

function Graphs({ data, data2 }) {
  const shippedReceivedData = {
    labels: ["Shipped", "Received"],
    datasets: [
      {
        data: [data.shipped, data.received],
        backgroundColor: ["#4caf50", "#2196f3"],
      },
    ],
  };

  const labels = data2.map((item) => item.VendorName);
  const orderQuantities = data2.map((item) => item.TotalOrderQty);
  const availableQuantities = data2.map((item) => item.TotalAvailableQty);

  const vendorOrderData = {
    labels: labels,
    datasets: [
      {
        label: "Total Order Quantity",
        data: orderQuantities,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Total Available Quantity",
        data: availableQuantities,
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: ${context.raw}`;
          },
        },
      },
    },
  };

  return (
    <Row>
      <Col md={4}>
        <h5>Shipped vs Received</h5>
        <Doughnut className="Chart_container" data={shippedReceivedData} />
      </Col>
      <Col md={8}>
        <h5>Vendor Wise: Total order qty and Total available qty</h5>
        {/* {data2 && data2.map((item)=><Bar data={vendorOrderData} />) } */}
        {/* <Bar data={vendorOrderData} /> */}
        <Bar
          className="Chart_container"
          data={vendorOrderData}
          options={options}
        />
      </Col>
    </Row>
  );
}

export default Graphs;
