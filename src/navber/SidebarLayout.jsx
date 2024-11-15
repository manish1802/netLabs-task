import React, { useState } from "react";
import {
  Navbar,
  Nav,
  Button,
  Offcanvas,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { Link, Routes, Route, NavLink } from "react-router-dom";
import InventoryAgingReport from "../pages/InventoryAgingReport";
import BackorderReport from "../pages/BackorderReport";
import inventoryDatas from "../datas/inventory_data.json";
import ReportsPage from "../pages/ReportsPage";

const ResponsiveLayout = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const handleSidebarToggle = () => setShowSidebar(!showSidebar);
  const { inventory_datas } = inventoryDatas;

  // Sidebar menu links component
  const SidebarLinks = () => (
    <Nav className="flex-column px-0 py-3">
      <Nav.Link as={NavLink} to="/" activeClassName="active" end>
        Report Summary
      </Nav.Link>
      <Nav.Link as={NavLink} to="/inventory" activeClassName="active">
        Inventory Report
      </Nav.Link>
      <Nav.Link as={NavLink} to="/backorder" activeClassName="active">
        Backorder Report
      </Nav.Link>
    </Nav>
  );

  return (
    <div className="vh-100 d-flex flex-column">
      {/* Sidebar - Offcanvas for mobile screens */}
      <Offcanvas
        show={showSidebar}
        onHide={handleSidebarToggle}
        responsive="lg"
        className="bg-light d-lg-none"
        placement="start"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Report Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <SidebarLinks />
        </Offcanvas.Body>
      </Offcanvas>

      {/* Main Content Area */}
      <Container fluid className="flex-grow-1">
        <Row>
          {/* Static Sidebar for large screens */}
          <Col lg={2} className="d-none d-lg-block bg-light sidebar">
            <SidebarLinks />
          </Col>

          {/* Content Area with Routing */}
          <Col lg={10} className="p-0">
            {/* Header */}
            <Navbar bg="primary" variant="dark" expand="lg" className="px-3">
              <Container fluid>
                <Button
                  variant="outline-light"
                  onClick={handleSidebarToggle}
                  className="d-lg-none me-2 navbar-brand"
                >
                  ☰
                </Button>
                <Navbar.Brand href="#">Report</Navbar.Brand>
              </Container>
            </Navbar>

            {/* Route Content */}
            <div className="p-3">
              <Routes>
                <Route path="/" element={<ReportsPage />} />
                <Route
                  path="/inventory"
                  element={
                    <InventoryAgingReport inventoryData={inventory_datas} />
                  }
                />
                <Route
                  path="/backorder"
                  element={<BackorderReport inventoryData={inventory_datas} />}
                />
              </Routes>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ResponsiveLayout;
