import React, { Component } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { Plus } from 'react-bootstrap-icons';
import { ObjectInModal } from './ObjectInModal';

export class ArrayInModal extends Component {
  render() {
    return (
      <>
        <Row>
          <Col xs="auto">
          <>
          &nbsp;
          </>
          </Col>
          <Col xs="auto">
            <Row className="mb-3">
              <Col xs="auto">
                <Form.Select defaultValue={this.props.array.type} onChange={(e) => this.props.handleChangeArrayType(e, this.props.array)}>
                  <option value="string">string</option>
                  <option value="int">int</option>
                  <option value="bool">bool</option>
                  <option value="DateTime">DateTime</option>
                  <option value="object">object</option>
                  <option value="array">array</option>
                </Form.Select>
              </Col>
              <Col xs="auto">
                {this.props.array.type === "object" &&
                  <Button variant="info" type="button" onClick={() => this.props.handleAddProperty(this.props.array.properties)}>
                    <Plus/>
                  </Button>
                }
              </Col>
            </Row>
            {this.props.array.type === "object" &&
              <ObjectInModal
                properties={this.props.array.properties}
                handleChangePropertyName={(event, property) => this.props.handleChangePropertyName(event, property)}
                handleChangePropertyType={(event, property) => this.props.handleChangePropertyType(event, property)}
                handleAddProperty={(properties) => this.props.handleAddProperty(properties)}
                handleDeleteProperty={(properties, index) => this.props.handleDeleteProperty(properties, index)}
                handleChangeArrayType={(event, array) => this.props.handleChangeArrayType(event, array)}
              />
            }
            {this.props.array.type === "array" &&
              <ArrayInModal
                array={this.props.array.array}
                handleChangePropertyName={(event, property) => this.props.handleChangePropertyName(event, property)}
                handleChangePropertyType={(event, property) => this.props.handleChangePropertyType(event, property)}
                handleAddProperty={(properties) => this.props.handleAddProperty(properties)}
                handleDeleteProperty={(properties, index) => this.props.handleDeleteProperty(properties, index)}
                handleChangeArrayType={(event, array) => this.props.handleChangeArrayType(event, array)}
              />
            }
          </Col>
        </Row>
      </>
    )
  }
}