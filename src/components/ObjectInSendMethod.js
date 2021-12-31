import React, { Component } from 'react';
import { Row, Col, Form } from 'react-bootstrap';

export class ObjectInSendMethod extends Component {
  render() {
    return (
      <Row>
        <Col xs="auto">
        <>
        &nbsp;
        </>
        </Col>
        <Col>
          {this.props.properties.map((property, propertyIndex) => {
            let propertyIndexes = [ ...this.props.propertyIndexes ];
            propertyIndexes.push(propertyIndex);

            return (
              <div key={propertyIndex}>
                <Row key={propertyIndex} className="mb-3">
                  <Col xs="auto">
                    {property.name} ( {property.type} )
                  </Col>
                  <Col>
                    {property.type !== "object" &&
                      <Form.Control type="text" placeholder="Input value" value={property.value} onChange={(e) => this.props.handleChangeArgPropertyValue(e, this.props.methodIndex, this.props.argIndex, propertyIndexes)} />
                    }
                  </Col>
                </Row>
                {property.type === "object" &&
                  <ObjectInSendMethod
                    methodIndex={this.props.methodIndex}
                    argIndex={this.props.argIndex}
                    properties={property.properties}
                    propertyIndexes={propertyIndexes}
                    handleChangeArgPropertyValue={(event, methodIndex, argIndex, propertyIndexes) => this.props.handleChangeArgPropertyValue(event, methodIndex, argIndex, propertyIndexes)}
                  />
                }
              </div>
            );
          })}
        </Col>
      </Row>
    )
  }
}
