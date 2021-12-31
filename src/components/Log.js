import React, { Component } from 'react';
import { Button, ListGroup } from 'react-bootstrap';

export class Log extends Component {
  handleClearLogs = () => {
    let logs = [];
    localStorage.setItem("Logs", JSON.stringify(logs));

    this.props.setStateFromLocalStorage();
  }

  render() {
    return (
      <>
        <h4>
          Logs
          <Button className="stick-button" variant="outline-warning" size="sm" onClick={this.handleClearLogs}>
              Clear
          </Button>
        </h4>
        <div>
        <ListGroup>
            {this.props.logs.map((log ,index) => 
            <ListGroup.Item key={index}>{log.datetime} : {log.message}</ListGroup.Item>
            )}
        </ListGroup>
        </div>
      </>
    )
  }
}