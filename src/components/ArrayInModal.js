import React, { Component } from 'react';
import { Col, Form } from 'react-bootstrap';

export class ArrayInModal extends Component {
  render() {
    return (
      <>
        <Col xs="auto">
          <Form.Select defaultValue={this.props.array.type} onChange={(e) => this.props.handleChangeArrayType(e, this.props.argIndex, this.props.depth)}>
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
            handleChangeArrayType={(event, argIndex, depth) => this.props.handleChangeArrayType(event, argIndex, depth)}
          />
        }
      </>
    )
  }
}