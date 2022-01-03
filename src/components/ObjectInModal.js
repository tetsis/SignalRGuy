import React, { Component } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { TrashFill, Plus } from 'react-bootstrap-icons';

export class ObjectInModal extends Component {
  render() {
    return (
      <Row>
        <Col xs="auto">
        <>
        &nbsp;
        </>
        </Col>
        <Col xs="auto">
          {this.props.properties.map((property, propertyIndex) => {
            let propertyIndexes = [ ...this.props.propertyIndexes ];
            propertyIndexes.push(propertyIndex);
            return (
              <div key={propertyIndex}>
                <Row className="mb-3">
                  <Col xs="auto">
                    <Form.Select defaultValue={property.type} onChange={(e) => this.props.handleChangePropertyType(e, property)}>
                      <option value="string">string</option>
                      <option value="int">int</option>
                      <option value="bool">bool</option>
                      <option value="DateTime">DateTime</option>
                      <option value="object">object</option>
                    </Form.Select>
                  </Col>
                  <Col xs="auto">
                    <Form.Control type="text" placeholder="Input argument name" value={property.name} onChange={(e) => this.props.handleChangePropertyName(e, property)} />
                  </Col>
                  <Col xs="auto">
                    {property.type === "object" &&
                      <Button variant="info" type="button" onClick={() => this.props.handleAddProperty(property.properties)}>
                        <Plus/>
                      </Button>
                    }
                    <Button variant="danger" type="button" onClick={() => this.props.handleDeleteProperty(this.props.properties, propertyIndex)}>
                      <TrashFill/>
                    </Button>
                  </Col>
                </Row>
                {property.type === "object" &&
                  <ObjectInModal
                    argIndex={this.props.argIndex}
                    properties={property.properties}
                    propertyIndexes={propertyIndexes}
                    handleChangePropertyName={(event, property) => this.props.handleChangePropertyName(event, property)}
                    handleChangePropertyType={(event, property) => this.props.handleChangePropertyType(event, property)}
                    handleAddProperty={(properties) => this.props.handleAddProperty(properties)}
                    handleDeleteProperty={(properties, index) => this.props.handleDeleteProperty(properties, index)}
                  />
                }
              </div>
            )
          })}
        </Col>
      </Row>
    )
  }
}
