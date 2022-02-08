import React, { Component } from 'react';
import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap';

export class Header extends Component {
  handleApplingTutorialSettings = () => {
    let url = "https://signalrserver20211231135855.azurewebsites.net/tutorialHub";

    let sendMethods = [];
    sendMethods.push({
      name: "Ping",
      args: []
    });
    sendMethods.push({
      name: "SendMessage",
      args: [
        {
          name: "message",
          type: "string",
          value: "Hello, SignalR."
        }
      ]
    });
    sendMethods.push({
      name: "SendMessageToGroup",
      args: [
        {
          name: "group",
          type: "string",
          value: "tutorial group"
        },
        {
          name: "user",
          type: "string",
          value: "guest"
        },
        {
          name: "message",
          type: "string",
          value: "Hello everyone, this is guest."
        }
      ]
    });
    sendMethods.push({
      name: "JoinToGroup",
      args: [
        {
          name: "group",
          type: "string",
          value: "tutorial group"
        }
      ]
    });
    sendMethods.push({
      name: "LeaveFromGroup",
      args: [
        {
          name: "group",
          type: "string",
          value: "tutorial group"
        }
      ]
    });
    sendMethods.push({
      name: "SendObject",
      args: [
        {
          name: "object1",
          type: "object",
          properties: [
            {
              name: "value1",
              type: "string"
            },
            {
              name: "value2",
              type: "int"
            }
          ],
          value: "{\n  \"value1\": \"string\",\n  \"value2\": 0\n}"       }
      ]
    });
    sendMethods.push({
      name: "CalcTotal",
      args: [
        {
          name: "numbers",
          type: "array",
          array : {
            type: "int"
          },
          value: "[\n  1,\n  2\n]"
        }
      ]
    });

    let receiveMethods = [];
    receiveMethods.push({
      name: "Pong",
      args: []
    });
    receiveMethods.push({
      name: "ReceiveMessage",
      args: [
        {
          name: "message",
          type: "string"
        }
      ]
    });
    receiveMethods.push({
      name: "ReceiveMessageFromGroup",
      args: [
        {
          name: "group",
          type: "string"
        },
        {
          name: "user",
          type: "string"
        },
        {
          name: "message",
          type: "string"
        }
      ]
    });
    receiveMethods.push({
      name: "ReceiveObject",
      args: [
        {
          name: "object1",
          type: "object",
          properties: [
            {
              name: "value1",
              type: "string"
            },
            {
              name: "value2",
              type: "int"
            }
          ]
        }
      ]
    });
    receiveMethods.push({
      name: "CalcTotal",
      args: [
        {
          name: "total",
          type: "int"
        }
      ]
    });

    localStorage.setItem("Url", url);

    let sendJson = JSON.stringify(sendMethods);
    localStorage.setItem("SendMethods", sendJson);

    let receiveJson = JSON.stringify(receiveMethods);
    localStorage.setItem("ReceiveMethods", receiveJson);

    this.props.setStateFromLocalStorage();
  }

  handleClearAll = () => {
    localStorage.setItem("Url", "");

    let sendJson = JSON.stringify([]);
    localStorage.setItem("SendMethods", sendJson);

    let receiveJson = JSON.stringify([]);
    localStorage.setItem("ReceiveMethods", receiveJson);

    let logJson = JSON.stringify([]);
    localStorage.setItem("Logs", logJson);

    this.props.setStateFromLocalStorage();
  }

  render() {
    return (
    <Navbar  bg="primary" variant="dark">
      <Container>
      <Navbar.Brand href="/">SignalR Guy <i>α</i></Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <NavDropdown title="Actions" id="basic-nav-dropdown">
            <NavDropdown.Item onClick={this.handleApplingTutorialSettings}>Apply tutorial values</NavDropdown.Item>
            <NavDropdown.Item onClick={this.handleClearAll}>Clear all</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
      </Container>
    </Navbar>
    )
  }
}