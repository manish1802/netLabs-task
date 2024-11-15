import React, { useState, useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Col, Row } from "react-bootstrap";
import Select from "react-select"; // Import react-select

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({ categoryData }) => {
  const [selectedCategory, setSelectedCategory] = useState(
    "Glands and Organs for Organo-Therapeutic Uses"
  );

  // Get unique categories for react-select options
  const categories = useMemo(
    () => [...new Set(categoryData.map((item) => item.CategoryName))],
    [categoryData]
  );

  // Format categories for react-select
  const categoryOptions = categories.map((category) => ({
    value: category,
    label: category,
  }));

  // Filter data by selected category
  const filteredData = categoryData.filter(
    (item) => item.CategoryName === selectedCategory
  );

  // Calculate total order quantity, available quantity, and count by status
  const totalOrderQty = filteredData.reduce(
    (acc, item) => acc + item.TotalOrderQty,
    0
  );
  const totalAvailableQty = filteredData.reduce(
    (acc, item) => acc + item.TotalAvailableQty,
    0
  );
  const shippedCount = filteredData.reduce(
    (acc, item) => acc + item.Shipped,
    0
  );
  const receivedCount = filteredData.reduce(
    (acc, item) => acc + item.Received,
    0
  );

  // Set up chart data for Pie chart
  const quantityData = {
    labels: ["Total Order Qty", "Total Available Qty"],
    datasets: [
      {
        label: selectedCategory,
        data: [totalOrderQty, totalAvailableQty],
        backgroundColor: ["#4CAF50", "#FFC107"],
        hoverOffset: 4,
      },
    ],
  };
  // Set up chart data for Pie chart
  const deliveryData = {
    labels: ["Shipped", "Received"],
    datasets: [
      {
        label: selectedCategory,
        data: [shippedCount, receivedCount],
        backgroundColor: ["#2196F3", "#FF5722"],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <Row className="mt-5">
      {/* React-Select for category selection */}
      <div>
        <label className="mb-2 fw-bold" htmlFor="category-select">
          Select Category:
        </label>
        <Select
          id="category-select"
          value={{ value: selectedCategory, label: selectedCategory }} // Setting the selected value
          options={categoryOptions} // Passing the options
          onChange={(selectedOption) =>
            setSelectedCategory(selectedOption.value)
          } // Handle category selection
        />
      </div>
      {/* Pie Chart */}
      <Col md={4}>
        <Doughnut
          className="Chart_container mt-4"
          data={quantityData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: "top",
              },
              title: {
                display: true,
                text: `Inventory Data for ${selectedCategory}`,
              },
            },
          }}
        />
      </Col>
      <Col md={4}>
        <Doughnut
          className="Chart_container mt-4"
          data={deliveryData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: "top",
              },
              title: {
                display: true,
                text: `Inventory Data for ${selectedCategory}`,
              },
            },
          }}
        />
      </Col>
    </Row>
  );
};

export default DoughnutChart;
