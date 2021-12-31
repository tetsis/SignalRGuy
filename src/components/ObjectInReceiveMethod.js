import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';

export class ObjectInReceiveMethod extends Component {
  render() {
    return (
      <Row>
        <Col xs="auto">
        <>
        &nbsp;
        </>
        </Col>
        <Col xs="auto">
          {this.props.properties.map((property, propertyIndex) => 
            <div key={propertyIndex}>
              <Row key={propertyIndex} className="mb-3">
                <Col xs="auto">
                  {property.name} ( {property.type} )
                </Col>
              </Row>
              {property.type === "object" &&
                <ObjectInReceiveMethod
                  properties={property.properties}
                />
              }
            </div>
          )}
        </Col>
      </Row>
    )
  }
}

