import React, { Component } from 'react';
import { Col, Form } from 'react-bootstrap';
import { ObjectInModal } from './ObjectInModal';

export class ArrayInModal extends Component {
  render() {
    return (
      <>
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
        {this.props.array.type === "array" &&
          <ArrayInModal
            argIndex={this.props.argIndex}
            array={this.props.array.array}
            depth={this.props.depth + 1}
            handleChangeArrayType={(event, array) => this.props.handleChangeArrayType(event, array)}
          />
        }
        {this.props.array.type === "object" &&
          <ObjectInModal
            properties={this.props.array.properties}
            handleChangePropertyName={(event, property) => this.handleChangePropertyName(event, property)}
            handleChangePropertyType={(event, property) => this.handleChangePropertyType(event, property)}
            handleAddProperty={(properties) => this.handleAddProperty(properties)}
            handleDeleteProperty={(properties, index) => this.handleDeleteProperty(properties, index)}
          />
        }
      </>
    )
  }
}