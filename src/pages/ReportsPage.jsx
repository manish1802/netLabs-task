import React, { useState, useEffect, useMemo } from "react";
import { Container, Row } from "react-bootstrap";
import SummaryCards from "../component/cards/SummaryCards";
import Graphs from "../component/Graphs";
import DataTable from "../component/DataTable";
import ExportButtons from "../component/ExportButtons";
import Select from "react-select"; // Import react-select

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  BarElement,
  LinearScale,
} from "chart.js";
import inventoryDatas from "../datas/inventory_data.json";
import DoughnutChart from "../component/DoughnutChart";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  BarElement,
  LinearScale
);

function ReportsPage() {
  const { inventory_datas } = inventoryDatas;
  const [orderDate, setOrderDate] = useState();
  const [filteredData, setFilteredData] = useState(inventory_datas);

  useEffect(() => {
    const uniqueDates = [
      ...new Set(
        inventory_datas.map(
          (item) => new Date(item.OrderDate).toISOString().split("T")[0]
        )
      ),
    ];
    const formattedDates = uniqueDates.map((date) => ({
      value: date,
      label: date,
    })); // Transforming into required format
    setOrderDate(formattedDates);
  }, [inventory_datas]);

  // Extract and format the unique dates

  const handleDateChange = (selectedOption) => {
    // Filter inventory data by matching OrderDate
    const filtered = inventory_datas.filter(
      (item) =>
        new Date(item.OrderDate).toISOString().split("T")[0] ===
        selectedOption.value
    );
    setFilteredData(filtered);
  };

  const summaryData = useMemo(
    () => calculateSummaryData(inventory_datas),
    [inventory_datas]
  );
  const deliveryData = useMemo(
    () => calculateSummaryData(filteredData),
    [filteredData]
  );
  const vendorData = useMemo(
    () => calculateVendorData(filteredData),
    [filteredData]
  );
  const categoryData = useMemo(
    () => calculateCategoryData(inventory_datas),
    [inventory_datas]
  );
  const categoryTableData = useMemo(
    () => calculateCategoryTableData(inventory_datas),
    [inventory_datas]
  );
  const wareHouseWiseData = useMemo(
    () => calculateWareHouseWiseData(inventory_datas),
    [inventory_datas]
  );

  function calculateSummaryData(data) {
    if (!Array.isArray(data)) {
      console.error("inventory_datas is not an array");
      return {};
    }
    const uniqueCounts = (key) => new Set(data.map((item) => item[key])).size;
    const shippedCount = data.filter(
      (item) => item.Status === "Shipped"
    ).length;
    const receivedCount = data.filter(
      (item) => item.Status === "Received"
    ).length;
    const totalOrderQuantity = data.reduce(
      (acc, item) => acc + item.OrderItemQuantity,
      0
    );
    const totalAvailableQuantity = data.reduce(
      (acc, item) => acc + item.AvaliableQuantity,
      0
    );

    return {
      totalWarehouse: uniqueCounts("WarehouseName"),
      categories: uniqueCounts("CategoryName"),
      products: uniqueCounts("ProductName"),
      vendors: uniqueCounts("VendorName"),
      shipped: shippedCount,
      received: receivedCount,
      orderQty: totalOrderQuantity,
      availableQty: totalAvailableQuantity,
    };
  }

  function calculateVendorData(data) {
    return Object.values(
      data.reduce((acc, item) => {
        const { VendorName, OrderItemQuantity, AvaliableQuantity } = item;
        if (!acc[VendorName]) {
          acc[VendorName] = {
            VendorName,
            TotalOrderQty: 0,
            TotalAvailableQty: 0,
          };
        }
        acc[VendorName].TotalOrderQty += OrderItemQuantity;
        acc[VendorName].TotalAvailableQty += AvaliableQuantity;
        return acc;
      }, {})
    );
  }

  function calculateCategoryData(data) {
    const categoryData = data.reduce((acc, item) => {
      const { CategoryName, OrderItemQuantity, AvaliableQuantity, Status } =
        item;
      if (!acc[CategoryName]) {
        acc[CategoryName] = {
          TotalOrderQty: 0,
          TotalAvailableQty: 0,
          Shipped: 0,
          Received: 0,
        };
      }
      acc[CategoryName].TotalOrderQty += OrderItemQuantity;
      acc[CategoryName].TotalAvailableQty += AvaliableQuantity;
      if (Status === "Shipped") acc[CategoryName].Shipped += 1;
      if (Status === "Received") acc[CategoryName].Received += 1;

      return acc;
    }, {});
    return Object.entries(categoryData).map(([CategoryName, data]) => ({
      CategoryName,
      ...data,
    }));
  }
  function calculateCategoryTableData(data) {
    const categoryData = data.reduce((acc, item) => {
      const { CategoryName, OrderItemQuantity, AvaliableQuantity } = item;

      if (!acc[CategoryName]) {
        acc[CategoryName] = {
          TotalOrderQty: 0,
          TotalAvailableQty: 0,
        };
      }

      // Update quantities and status counts
      acc[CategoryName].TotalOrderQty += OrderItemQuantity;
      acc[CategoryName].TotalAvailableQty += AvaliableQuantity;

      return acc;
    }, {});

    // Convert the result to an array format if needed
    return Object.entries(categoryData).map(([CategoryName, data]) => ({
      CategoryName,
      ...data,
    }));
  }

  function calculateWareHouseWiseData(data) {
    const wareHouseData = data.reduce((acc, item) => {
      const { WarehouseName, OrderItemQuantity, AvaliableQuantity, Status } =
        item;

      // Initialize category entry if it doesn't exist
      if (!acc[WarehouseName]) {
        acc[WarehouseName] = {
          TotalOrderQty: 0,
          TotalAvailableQty: 0,
          Shipped: 0,
          Received: 0,
        };
      }

      // Update quantities and status counts
      acc[WarehouseName].TotalOrderQty += OrderItemQuantity;
      acc[WarehouseName].TotalAvailableQty += AvaliableQuantity;
      if (Status === "Shipped") acc[WarehouseName].Shipped += 1;
      if (Status === "Received") acc[WarehouseName].Received += 1;

      return acc;
    }, {});

    // Convert the result to an array format if needed
    return Object.entries(wareHouseData).map(([WarehouseName, data]) => ({
      WarehouseName,
      ...data,
    }));
  }

  return (
    <Container id="report">
      <SummaryCards data={summaryData} />
      <div className="mb-4">
        <label className="mb-2 fw-bold" htmlFor="category-select">
          Select Order Date:
        </label>
        {orderDate && (
          <Select
            id="order-date-select"
            value={orderDate.find((option) => option.value === orderDate.value)} // Setting the selected value
            options={orderDate} // Passing the options
            // onChange={(selectedOption) => console.log(selectedOption)} // Handle date selection
            onChange={handleDateChange} // Handle date selection
          />
        )}
      </div>
      <Graphs data={deliveryData} data2={vendorData} />
      <DoughnutChart categoryData={categoryData} />
      <Row className="table-container my-4 mx-0">
        <DataTable
          title="Category-wise Table"
          data={categoryTableData}
          tableId="categoryTable"
          columns={[
            "Category",
            "Total Order Quantity",
            "Total Available Quantity",
          ]}
        />
        <DataTable
          title="Warehouse-wise Table"
          data={wareHouseWiseData}
          tableId="warehouseTable"
          columns={[
            "Warehouse",
            "Total Order Quantity",
            "Total Available Quantity",
            "Shipped",
            "Received",
          ]}
        />
      </Row>
      <ExportButtons />
    </Container>
  );
}

export default ReportsPage;
