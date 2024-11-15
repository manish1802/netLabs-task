import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';

function SummaryCards({ data }) {
  const summaryItems = [
    { title: 'Total Warehouses', value: data.totalWarehouse },
    { title: 'Categories', value: data.categories },
    { title: 'Products', value: data.products },
    { title: 'Vendors', value: data.vendors },
    { title: 'Shipped', value: data.shipped },
    { title: 'Received', value: data.received },
    { title: 'Order Quantity', value: data.orderQty },
    { title: 'Available Quantity', value: data.availableQty }
  ];

  return (
    <Row className="mb-4">
      {summaryItems.map((item, index) => (
        <Col md={3} className="mb-3" key={index}>
          <Card>
            <Card.Body>
              <Card.Title>{item.title}</Card.Title>
              <Card.Text>{item.value}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default SummaryCards;
