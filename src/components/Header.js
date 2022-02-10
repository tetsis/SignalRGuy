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
      name: "GetWeek",
      args: [
        {
          name: "date",
          type: "object",
          properties: [
            {
              name: "Year",
              type: "int"
            },
            {
              name: "Month",
              type: "int"
            },
            {
              name: "Day",
              type: "int"
            },
            {
              name: "Locale",
              type: "string"
            }
          ],
          value: "{\n  \"Year\": 2022,\n  \"Month\": 1,\n  \"Day\": 1,\n  \"Locale\": \"ja-jp\"\n}"
        }
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
      name: "GetWeek",
      args: [
        {
          name: "week",
          type: "string"
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

  handleExport = () => {
    let json = {};

    json.Url = localStorage.getItem("Url");
    json.SendMethods = JSON.parse(localStorage.getItem("SendMethods"));
    json.ReceiveMethods = JSON.parse(localStorage.getItem("ReceiveMethods"));
    json.Logs = JSON.parse(localStorage.getItem("Logs"));

    // objectとarrayのvalueをオブジェクト化する
    json.SendMethods.forEach(sendMethod => {
      sendMethod.args.forEach(arg => {
        if ((arg.type === "object" || arg.type === "array")) {
          arg.value = JSON.parse(arg.value);
        }
      });
    });

    let blob = new Blob([ JSON.stringify(json, null, 2) ], { "type" : "text/plain" });
    let url =  window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display:none";
    a.href = url;
    a.download = "signalrguy.json"
    a.click();
    window.URL.revokeObjectURL(url);
    a.parentNode.removeChild(a);
  }

  handleImport = () => {
    const input = document.createElement("input");
    document.body.appendChild(input);
    input.style = "display:none";
    input.type = "file";
    input.accept = ".json";
    input.click();
    input.addEventListener("change", () => {
      let reader = new FileReader();
      reader.readAsText(input.files[0], "utf-8");
      reader.onload = ()=> {
        let data = JSON.parse(reader.result);

        // objectとarrayのvalueを文字列化する
        data.SendMethods.forEach(sendMethod => {
          sendMethod.args.forEach(arg => {
            if ((arg.type === "object" || arg.type === "array")) {
              arg.value = JSON.stringify(arg.value, null, 2);
            }
          });
        });

        localStorage.setItem("Url", data.Url);

        let sendJson = JSON.stringify(data.SendMethods);
        localStorage.setItem("SendMethods", sendJson);

        let receiveJson = JSON.stringify(data.ReceiveMethods);
        localStorage.setItem("ReceiveMethods", receiveJson);

        let logJson = JSON.stringify(data.Logs);
        localStorage.setItem("Logs", logJson);

        this.props.setStateFromLocalStorage();
      };
    });

    input.parentNode.removeChild(input);
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
            <NavDropdown.Item onClick={this.handleExport}>Export to file</NavDropdown.Item>
            <NavDropdown.Item onClick={this.handleImport}>Import from file</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
      </Container>
    </Navbar>
    )
  }
}