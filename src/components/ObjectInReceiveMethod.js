import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import toStringArrayType from '../functions/toStringArrayType';
import getArrayContentType from '../functions/getArrayContentType';
import getArrayContent from '../functions/getArrayContent';

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
                {property.name} (
                  {property.type !== "array" &&
                    <>
                      {property.type}
                    </>
                  }
                  {property.type === "array" &&
                    <>
                      {toStringArrayType(property.array)}
                    </>
                  }
                )
              </Row>
              {property.type === "object" &&
                <ObjectInReceiveMethod
                  properties={property.properties}
                />
              }
              {property.type === "array" &&
                <>
                  {getArrayContentType(property.array) === "object" &&
                    <ObjectInReceiveMethod
                      properties={getArrayContent(property.array).properties}
                    />
                  }
                </>
              }
            </div>
          )}
        </Col>
      </Row>
    )
  }
}

