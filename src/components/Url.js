import React, { Component } from 'react';
import { Button, InputGroup, FormControl } from 'react-bootstrap';

export class Url extends Component {
  render() {
    return (
      <InputGroup className="mb-3">
        <FormControl
          placeholder="SignalR hub URL"
          value={this.props.url}
          onChange={this.props.handleChangeUrl}
        />
        {!this.props.isConnecting &&
          <Button variant="primary" type="button" onClick={this.props.handleConnect}>
            Connect
          </Button>
        }
        {this.props.isConnecting &&
          <Button variant="outline-danger" type="button" onClick={this.props.handleDisconnect}>
            Disconnect
          </Button>
        }
      </InputGroup>
    )
  }
}