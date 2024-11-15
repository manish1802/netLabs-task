import React, { useState } from "react";
import moment from "moment";
import Select from "react-select";
import { Bar } from "react-chartjs-2";
import { Col, Row } from "react-bootstrap";

const categorizeAgingData = (data, selectedCategory, selectedProduct) => {
  const today = moment();
  const categories = {
    "0-30": 0,
    "31-60": 0,
    "61-90": 0,
    "91-120": 0,
    Others: 0,
  };

  data.forEach((item) => {
    const orderDate = moment(item.OrderDate);
    const daysInStock = today.diff(orderDate, "days");

    if (selectedCategory && item.CategoryName !== selectedCategory) return;
    if (selectedProduct && item.ProductName !== selectedProduct) return;

    let categoryKey;
    if (daysInStock <= 30) categoryKey = "0-30";
    else if (daysInStock <= 60) categoryKey = "31-60";
    else if (daysInStock <= 90) categoryKey = "61-90";
    else if (daysInStock <= 120) categoryKey = "91-120";
    else categoryKey = "Others";

    categories[categoryKey] += item.AvaliableQuantity;
  });

  return categories;
};

const InventoryAgingReport = ({ inventoryData }) => {
  const [categoryChartData, setCategoryChartData] = useState({
    "0-30": 0,
    "31-60": 0,
    "61-90": 0,
    "91-120": 1839,
    Others: 0,
  });
  const [productChartData, setProductChartData] = useState({
    "0-30": 0,
    "31-60": 0,
    "61-90": 0,
    "91-120": 1839,
    Others: 0,
  });

  console.log("categoryChartData", categoryChartData);

  const handleCategoryChange = (option) => {
    setCategoryChartData(
      categorizeAgingData(inventoryData, option ? option.value : null, null)
    );
  };

  const handleProductChange = (option) => {
    setProductChartData(
      categorizeAgingData(inventoryData, null, option ? option.value : null)
    );
  };

  const categories = Array.from(
    new Set(inventoryData.map((item) => item.CategoryName))
  );
  const products = Array.from(
    new Set(inventoryData.map((item) => item.ProductName))
  );

  return (
    <Row className="p-2">
      {/* Category-based Aging Graph */}

      <Col md={12} className="mb-4">
        <div className="table_header mb-3">
          <h5 className="fs-4 fw-bold">Inventory Aging by Category</h5>
          <Select
            options={categories.map((category) => ({
              value: category,
              label: category,
            }))}
            onChange={handleCategoryChange}
            placeholder="Select Category"
            defaultValue={{
              value: categories[0],
              label: categories[0],
            }}
          />
        </div>
        <Bar
          className="Chart_container"
          data={{
            labels: Object.keys(categoryChartData),
            datasets: [
              {
                label: "Stock Quantity",
                data: Object.values(categoryChartData),
                backgroundColor: "rgba(75,192,192,0.4)",
                borderColor: "rgba(75,192,192,1)",
                borderWidth: 1,
              },
            ],
          }}
          options={{
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          }}
        />
      </Col>
      <Col md={12}>
        {/* Product-based Aging Graph */}
        <div className="table_header mb-3">
          <h5 className="fs-4 fw-bold">Inventory Aging by Product</h5>
          <Select
            options={products.map((product) => ({
              value: product,
              label: product,
            }))}
            onChange={handleProductChange}
            placeholder="Select Product"
            defaultValue={{
              value: products[0],
              label: products[0],
            }}
          />
        </div>
        <Bar
          className="Chart_container"
          data={{
            labels: Object.keys(productChartData),
            datasets: [
              {
                label: "Stock Quantity",
                data: Object.values(productChartData),
                backgroundColor: "rgba(153,102,255,0.4)",
                borderColor: "rgba(153,102,255,1)",
                borderWidth: 1,
              },
            ],
          }}
          options={{
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          }}
        />
      </Col>
    </Row>
  );
};

export default InventoryAgingReport;
