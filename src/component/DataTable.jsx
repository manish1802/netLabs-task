import React from "react";
import { Table, Button, Col } from "react-bootstrap";
import * as XLSX from "xlsx";

function DataTable({ title, data, tableId, columns }) {
  const downloadExcel = () => {
    const table = document.getElementById(tableId);
    const workbook = XLSX.utils.table_to_book(table, { sheet: "Sheet 1" });
    XLSX.writeFile(workbook, `${title}.xlsx`);
  };

  return (
    <Col md={12} className="table_container mb-4">
      <div className="table_header mb-4">
        <h5>{title}</h5>

        <Button variant="success" onClick={downloadExcel}>
          Download as Excel
        </Button>
      </div>
      <div className="table_box">
      <Table striped bordered hover id={tableId}>
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              {Object.values(item).map((val, idx) => (
                <td key={idx}>{val}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
      </div>
    </Col>
  );
}

export default DataTable;
