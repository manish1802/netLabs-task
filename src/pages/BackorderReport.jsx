import React, { useState, useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Row, Col } from "react-bootstrap";
import Select from "react-select";

ChartJS.register(ArcElement, Tooltip, Legend);

const BackorderReport = ({ inventoryData }) => {
  const [selectedCategory, setSelectedCategory] = useState({
    value: "Medicaments",
    label: "Medicaments",
  });
  const backorderData = useMemo(() => {
    const data = inventoryData
      .filter((item) => item.OrderItemQuantity > item.AvaliableQuantity)
      .map((item) => ({
        city: item.City,
        category: item.CategoryName,
        backorderQty: item.OrderItemQuantity - item.AvaliableQuantity,
      }));
    return data;
  }, [inventoryData]);
  const cityWiseBackorder = useMemo(() => {
    const result = {};
    backorderData
      .filter(
        (item) => !selectedCategory || item.category === selectedCategory.value
      )
      .forEach((item) => {
        if (result[item.city]) {
          result[item.city] += item.backorderQty;
        } else {
          result[item.city] = item.backorderQty;
        }
      });
    return result;
  }, [backorderData, selectedCategory]);

  // Prepare data for the Doughnut chart
  const chartData = {
    labels: Object.keys(cityWiseBackorder),
    datasets: [
      {
        label: "Backorder Quantity",
        data: Object.values(cityWiseBackorder),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  };

  const uniqueCategories = [
    ...new Set(inventoryData.map((item) => item.CategoryName)),
  ];
  const categoryOptions = uniqueCategories.map((category) => ({
    value: category,
    label: category,
  }));

  const hasData =
    backorderData.length > 0 && Object.keys(cityWiseBackorder).length > 0;

  return (
    <Row className="p-2">
      <div className="table_header mb-3">
        <h5 className="fs-4 fw-bold">Backorder Report</h5>
        <Select
          value={selectedCategory}
          onChange={(selectedOption) => setSelectedCategory(selectedOption)}
          options={[{ value: "", label: "All Categories" }, ...categoryOptions]}
        />
      </div>
      <Row>
        <Col md={4}>
          {hasData ? (
            <Doughnut className="Chart_container" data={chartData} />
          ) : (
            <p>No data available</p>
          )}
        </Col>
      </Row>
    </Row>
  );
};

export default BackorderReport;
