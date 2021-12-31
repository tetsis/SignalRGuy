import React, { Component } from 'react';
import './App.css';
import {
  HubConnectionBuilder,
} from '@microsoft/signalr';
import { Container, Row, Col, Form, Button, Modal, ListGroup, InputGroup, FormControl, Card, Toast, ToastContainer, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { TrashFill, Plus } from 'react-bootstrap-icons';
import 'bootstrap/dist/css/bootstrap.min.css';

function ObjectInModal(props) {
  return (
    <Row>
      <Col xs="auto">
      <>
      &nbsp;
      </>
      </Col>
      <Col xs="auto">
        {props.properties.map((property, propertyIndex) => {
          let propertyIndexes = [ ...props.propertyIndexes ];
          propertyIndexes.push(propertyIndex);

          return (
            <>
              <Row className="mb-3">
                <Col xs="auto">
                  <Form.Control type="text" placeholder="Input argument name" value={property.name} onChange={(e) => props.handleChangePropName(e, props.argIndex, propertyIndexes)} />
                </Col>
                <Col xs="auto">
                  <Form.Select defaultValue={property.type} onChange={(e) => props.handleChangePropType(e, props.argIndex, propertyIndexes)}>
                    <option value="string">string</option>
                    <option value="int">int</option>
                    <option value="bool">bool</option>
                    <option value="DateTime">DateTime</option>
                    <option value="object">object</option>
                  </Form.Select>
                </Col>
                <Col xs="auto">
                  {property.type === "object" &&
                    <Button variant="info" type="button" onClick={() => props.handleAddProperty(props.argIndex, propertyIndexes)}>
                      <Plus/>
                    </Button>
                  }
                  <Button variant="danger" type="button" onClick={() => props.handleDeleteProp(props.argIndex, propertyIndexes)}>
                    <TrashFill/>
                  </Button>
                </Col>
              </Row>
              {property.type === "object" &&
                <ObjectInModal
                  argIndex={props.argIndex}
                  properties={property.properties}
                  propertyIndexes={propertyIndexes}
                  handleChangePropName={(event, argIndex, propertyIndexes) => props.handleChangePropName(event, argIndex, propertyIndexes)}
                  handleChangePropType={(event, argIndex, propertyIndexes) => props.handleChangePropType(event, argIndex, propertyIndexes)}
                  handleAddProperty={(argIndex, propertyIndexes) => props.handleAddProperty(argIndex, propertyIndexes)}
                  handleDeleteProp={(argIndex, propertyIndexes) => props.handleDeleteProp(argIndex, propertyIndexes)}
                />
              }
            </>
          )
        })}
      </Col>
    </Row>
  );
}

function ObjectInSendMethod(props) {
  return (
    <Row>
      <Col xs="auto">
      <>
      &nbsp;
      </>
      </Col>
      <Col xs="auto">
        {props.properties.map((property, propertyIndex) => {
          let propertyIndexes = [ ...props.propertyIndexes ];
          propertyIndexes.push(propertyIndex);

          return (
            <div key={propertyIndex}>
              <Row key={propertyIndex} className="mb-3">
                <Col xs="auto">
                  {property.name} ( {property.type} )
                </Col>
                <Col xs="auto">
                  {property.type !== "object" &&
                    <Form.Control type="text" placeholder="Input value" value={property.value} onChange={(e) => props.handleChangeArgPropertyValue(e, props.methodIndex, props.argIndex, propertyIndexes)} />
                  }
                </Col>
              </Row>
              {property.type === "object" &&
                <ObjectInSendMethod
                  methodIndex={props.methodIndex}
                  argIndex={props.argIndex}
                  properties={property.properties}
                  propertyIndexes={propertyIndexes}
                  handleChangeArgPropertyValue={(event, methodIndex, argIndex, propertyIndexes) => props.handleChangeArgPropertyValue(event, methodIndex, argIndex, propertyIndexes)}
                />
              }
            </div>
          );
        })}
      </Col>
    </Row>
  );
}

function ObjectInReceiveMethod(props) {
  return (
    <Row>
      <Col xs="auto">
      <>
      &nbsp;
      </>
      </Col>
      <Col xs="auto">
        {props.properties.map((property, propertyIndex) => 
          <div key={propertyIndex}>
            <Row key={propertyIndex} className="mb-3">
              <Col xs="auto">
                {property.name} ( {property.type} )
              </Col>
            </Row>
            {property.type === "object" &&
              <ObjectInReceiveMethod
                properties={property.properties}
              />
            }
          </div>
        )}
      </Col>
    </Row>
  );
}

function DisplayNotify(props) {
  return (
    <ToastContainer position="top-end">

      <Toast>
        <Toast.Header>
          <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
          <strong className="me-auto">Bootstrap</strong>
          <small className="text-muted">just now</small>
        </Toast.Header>
        <Toast.Body>See? Just like this.</Toast.Body>
      </Toast>

    </ToastContainer>
  );
}

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: "",
      isConnecting: false,
      showModal: false,
      modalAddOrEdit: true,
      modalSendOrReceive: true,
      modalIndex: -1,
      methodNameInModal: "",
      methodArgsInModal: [],
      sendMethods: [],
      receiveMethods: [],
      logs: [],
      connection: null
    };
  }

  componentDidMount() {
    // ローカルストレージがなければ初期化して保存
    if (!localStorage.getItem("Url")) {
      localStorage.setItem("Url", "");
    }
    if (!localStorage.getItem("SendMethods")) {
      localStorage.setItem("SendMethods", "[]");
    }
    if (!localStorage.getItem("ReceiveMethods")) {
      localStorage.setItem("ReceiveMethods", "[]");
    }
    if (!localStorage.getItem("Logs")) {
      localStorage.setItem("Logs", "[]");
    }

    // ローカルストレージから情報を取得
    this.setStateFromLocalStorage();
  }

  setStateFromLocalStorage() {
    let url = localStorage.getItem("Url");
    this.setState({url: url});

    let sendJson = localStorage.getItem("SendMethods");
    let sendMethods = JSON.parse(sendJson);
    this.setState({sendMethods: sendMethods});

    let receiveJson = localStorage.getItem("ReceiveMethods");
    let receiveMethods = JSON.parse(receiveJson);
    this.setState({receiveMethods: receiveMethods});

    let logsJson = localStorage.getItem("Logs");
    let logs = JSON.parse(logsJson);
    this.setState({logs: logs});
  }

  handleChangeUrl = (event) => {
    this.setState({url: event.target.value});
  }

  async handleConnect(url) {
    // ローカルストレージにURLを保存
    localStorage.setItem("Url", url);

    const connection = new HubConnectionBuilder()
      .withUrl(url)
      //.withAutomaticReconnect()
      .build();

    this.setState({connection}, () => {
      connection.start()
      .then(() => {
        console.log("SignalR Connected.");
        this.setState({isConnecting: true});
        this.addAndSaveLog("Connecting to " + url);
      })
      .catch(err => {
        console.log('Error while establishing connection :(')
        this.setState({isConnecting: false});
        this.addAndSaveLog("Could not connect to " + url);
      });

      connection.onclose(() => {
        this.setState({isConnecting: false});
      });

      this.state.receiveMethods.forEach(method => {
        connection.on(method.name, (...data) => {
          console.log("Receive: ");
          console.log(method.name, data);
          this.addAndSaveLog("Receive. Method: " + method.name + ", Args: " + this.toStringData(method.args, data));
          this.render(<DisplayNotify />);
        });
      });
    });
  }

  handleDisconnect = () => {
    this.state.connection.stop();
    this.addAndSaveLog("Disconnecting to " + this.state.url);
  }

  convertSendingData(arg) {
    if (arg.type === "int") {
      return parseInt(arg.value, 10);
    }
    else if (arg.type === "object") {
      return Object.fromEntries(arg.properties.map((p) => [p.name, this.convertSendingData(p)]));
    }
    else {
      return arg.value;
    }
  }

  toStringData(args, data) {
    let result = [];
    for (let i = 0; i < args.length; i++) {
      result.push(args[i].name + ":" + JSON.stringify(data[i]));
    }
    return result;
    //return arg.name + ":" + JSON.stringify(this.convertSendingData(arg));
  }

  handleSend(index) {
    let method = this.state.sendMethods[index];

    try {
      this.state.connection.invoke(method.name, ...method.args.map(arg => this.convertSendingData(arg)));
      console.log("Send: ");
      console.log(method.name, method.args.map(arg => this.convertSendingData(arg)));
      this.addAndSaveLog("Send. Method: " + method.name + ", Args: " + this.toStringData(method.args, method.args.map(arg => this.convertSendingData(arg))));
    } catch (err) {
      console.error(err);
    }
  }

  handleShowModal = (index, modalSendOrReceive) => {
    this.setState({modalSendOrReceive: modalSendOrReceive});

    if (index === -1) {
      this.setState({methodNameInModal: "", methodArgsInModal: [{name: "", type: "string"}], modalAddOrEdit: true, modalIndex: -1});
    }
    else {
      let method = modalSendOrReceive ? this.state.sendMethods[index] : this.state.receiveMethods[index];
      let args = JSON.parse(JSON.stringify(method.args));
      this.setState({methodNameInModal: method.name, methodArgsInModal: args, modalAddOrEdit: false, modalIndex: index});
    }

    this.setState({showModal: true})
  }
    
  handleCloseModal = () => this.setState({showModal: false});

  handleAddArg = () => {
    let args = this.state.methodArgsInModal;
    args.push({name: "", type: "string"});
    this.setState({methodArgsInModal: args});
  }

  handleDeleteArg = (index) => {
    let args = this.state.methodArgsInModal;
    args.splice(index, 1);
    this.setState({methodArgsInModal: args});
  }

  handleAddProperty = (argIndex, propertyIndexes) => {
    let args = this.state.methodArgsInModal;
    let arg = args[argIndex];
    let properties = arg.properties;
    for (let i = 0; i < propertyIndexes.length; i++) {
      properties = properties[propertyIndexes[i]].properties;
    }
    properties.push({name: "", type: "string"});
    console.log(args);
    this.setState({methodArgsInModal: args});
  }

  handleDeleteProp = (argIndex, propertyIndexes) => {
    let args = this.state.methodArgsInModal;
    let arg = args[argIndex];
    let properties = arg.properties;
    for (let i = 0; i < propertyIndexes.length - 1; i++) {
      properties = properties[propertyIndexes[i]].properties;
    }
    properties.splice(propertyIndexes[propertyIndexes.length - 1], 1);
    this.setState({methodArgsInModal: args});
  }

  handleChangeMethodName = (event) => {
    this.setState({methodNameInModal: event.target.value});
  }

  handleChangeArgName = (event, index) => {
    let args = this.state.methodArgsInModal;
    args[index].name = event.target.value;
    this.setState({methodArgsInModal: args});
  }

  handleChangeArgType = (event, index) => {
    let args = this.state.methodArgsInModal;
    args[index].type = event.target.value;
    if (event.target.value === "object") {
      args[index].properties = [];
      delete args[index].value;
    }
    else {
      delete args[index].properties;
    }
    this.setState({methodArgsInModal: args});
  }

  handleChangePropName = (event, argIndex, propertyIndexes) => {
    let args = this.state.methodArgsInModal;
    let arg = args[argIndex];
    let properties = arg.properties;
    for (let i = 0; i < propertyIndexes.length - 1; i++) {
      properties = properties[propertyIndexes[i]].properties;
    }
    properties[propertyIndexes[propertyIndexes.length - 1]].name = event.target.value;
    this.setState({methodArgsInModal: args});
  }

  handleChangePropType = (event, argIndex, propertyIndexes) => {
    let args = this.state.methodArgsInModal;
    let arg = args[argIndex];
    let properties = arg.properties;
    for (let i = 0; i < propertyIndexes.length - 1; i++) {
      properties = properties[propertyIndexes[i]].properties;
    }
    properties[propertyIndexes[propertyIndexes.length - 1]].type = event.target.value;
    if (event.target.value === "object") {
      properties[propertyIndexes[propertyIndexes.length - 1]].properties = [];
      delete properties[propertyIndexes[propertyIndexes.length - 1]].value;
    }
    this.setState({methodArgsInModal: args});
  }

  checkArrayName(array) {
    let filtered = array.filter(item => item.name.match(/^[A-Za-z0-9]+$/));
    array.forEach(item => {
      if ("properties" in item) {
        item.properties = this.checkArrayName(item.properties);
      }
    });
    return filtered;
  }

  handleAddMethod = () => {
    let methods;
    if (this.state.modalSendOrReceive) {
      methods = this.state.sendMethods;
    }
    else {
      methods = this.state.receiveMethods;
    }

    // 名前が条件に合うもののみ使う
    let args = this.state.methodArgsInModal;
    let filteredArgs = this.checkArrayName(args);

    methods.push({name: this.state.methodNameInModal, args: filteredArgs});

    if (this.state.modalSendOrReceive) {
      this.setState({sendMethods: methods});
      this.saveSendMethods();
    }
    else {
      this.setState({receiveMethods: methods});
      this.saveReceiveMethods();
    }

    this.handleCloseModal();
  }

  handleDeleteMethod = () => {
    let methods;
    if (this.state.modalSendOrReceive) {
      methods = this.state.sendMethods;
    }
    else {
      methods = this.state.receiveMethods;
    }

    methods.splice(this.state.modalIndex, 1);

    if (this.state.modalSendOrReceive) {
      this.setState({sendMethods: methods});
      this.saveSendMethods();
    }
    else {
      this.setState({receiveMethods: methods});
      this.saveReceiveMethods();
    }

    this.handleCloseModal();
  }
  
  handleEditMethod = () => {
    let methods;
    if (this.state.modalSendOrReceive) {
      methods = this.state.sendMethods;
    }
    else {
      methods = this.state.receiveMethods;
    }

    // 名前が条件に合うもののみ使う
    let args = this.state.methodArgsInModal;
    let filteredArgs = this.checkArrayName(args);

    methods[this.state.modalIndex] = {name: this.state.methodNameInModal, args: filteredArgs};

    if (this.state.modalSendOrReceive) {
      this.setState({sendMethods: methods});
      this.saveSendMethods();
    }
    else {
      this.setState({receiveMethods: methods});
      this.saveReceiveMethods();
    }

    this.handleCloseModal();
  }
  
  handleChangeArgValue = (event, methodIndex, argIndex) => {
    let sendMethods = this.state.sendMethods;
    sendMethods[methodIndex].args[argIndex].value = event.target.value;
    this.setState({sendMethods: sendMethods});

    this.saveSendMethods();
  }

  handleChangeArgPropertyValue = (event, methodIndex, argIndex, propertyIndexes) => {
    let sendMethods = this.state.sendMethods;
    let sendMethod = sendMethods[methodIndex];
    let args = sendMethod.args;
    let arg = args[argIndex];
    let properties = arg.properties;
    for (let i = 0; i < propertyIndexes.length - 1; i++) {
      properties = properties[propertyIndexes[i]].properties;
    }
    properties[propertyIndexes[propertyIndexes.length - 1]].value = event.target.value;
    this.setState({sendMethods: sendMethods});

    this.saveSendMethods();
  }

  handleClearLogs = () => {
    let logs = this.state.logs;
    logs = [];
    this.setState({logs: logs});

    let json = JSON.stringify(logs);
    localStorage.setItem("Logs", json);
  }

  setSendMethods = () => {
    // ローカルストレージがなければ初期化して保存
    if (!localStorage.getItem("SendMethods")) {
      let sendMethods = JSON.parse("[]");
      localStorage.setItem("SendMethods", sendMethods);
    }

    let json = localStorage.getItem("SendMethods");
    let sendMethods = JSON.parse(json);
    this.setState({sendMethods: sendMethods});
  }
  setReceiveMethods = () => {
    // ローカルストレージがなければ初期化して保存
    if (!localStorage.getItem("ReceiveMethods")) {
      let receiveMethods = JSON.parse("[]");
      localStorage.setItem("ReceiveMethods", receiveMethods);
    }

    let json = localStorage.getItem("ReceiveMethods");
    let receiveMethods = JSON.parse(json);
    this.setState({receiveMethods: receiveMethods});
  }

  saveSendMethods = () => {
    let sendMethods = this.state.sendMethods;
    let json = JSON.stringify(sendMethods);
    localStorage.setItem("SendMethods", json);
  }
  saveReceiveMethods = () => {
    let receiveMethods = this.state.receiveMethods;
    let json = JSON.stringify(receiveMethods);
    localStorage.setItem("ReceiveMethods", json);
  }

  toISOStringWithTimezone(date) {
    var tzo = -date.getTimezoneOffset(),
        dif = tzo >= 0 ? '+' : '-',
        pad = function(num) {
            var norm = Math.floor(Math.abs(num));
            return (norm < 10 ? '0' : '') + norm;
        };

    return date.getFullYear() +
        '-' + pad(date.getMonth() + 1) +
        '-' + pad(date.getDate()) +
        'T' + pad(date.getHours()) +
        ':' + pad(date.getMinutes()) +
        ':' + pad(date.getSeconds()) +
        '.' + pad(date.getMilliseconds()) +
        dif + pad(tzo / 60) +
        ':' + pad(tzo % 60);
  }

  addAndSaveLog = (message) => {
    let logs = this.state.logs;
    let now = new Date();
    logs.push({datetime: this.toISOStringWithTimezone(now), message: message});
    this.setState({logs: logs});

    let json = JSON.stringify(logs);
    localStorage.setItem("Logs", json);
  }

  handleApplingTutorialSettings = () => {
    let url = "https://tutorialhub.signalrguy.com/testHub";

    let sendMethods = [];
    sendMethods.push({
      name: "SendMessage",
      args: [
        {
          name: "message",
          type: "string",
          value: ""
        }
      ]
    });
    sendMethods.push({
      name: "SendMessageToGroup",
      args: [
        {
          name: "group",
          type: "string",
          value: ""
        },
        {
          name: "user",
          type: "string",
          value: ""
        },
        {
          name: "message",
          type: "string",
          value: ""
        }
      ]
    });
    sendMethods.push({
      name: "JoinToGroup",
      args: [
        {
          name: "group",
          type: "string",
          value: ""
        }
      ]
    });
    sendMethods.push({
      name: "LeaveFromGroup",
      args: [
        {
          name: "group",
          type: "string",
          value: ""
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
              type: "string",
              value: ""
            },
            {
              name: "value2",
              type: "int",
              value: 0
            }
          ]
        }
      ]
    });
    sendMethods.push({
      name: "SendNumber",
      args: [
        {
          name: "number",
          type: "int",
          value: 0
        }
      ]
    });

    let receiveMethods = [];
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
      name: "ReceiveNumber",
      args: [
        {
          name: "number",
          type: "int"
        }
      ]
    });

    this.setState({url: url});
    localStorage.setItem("Url", url);

    this.setState({sendMethods: sendMethods});
    this.saveSendMethods();

    this.setState({receiveMethods: receiveMethods});
    this.saveReceiveMethods();

    this.handleClearLogs();
  }

  render() {
    return (
      <>
      <Navbar  bg="primary" variant="dark">
    <Container>
      <Navbar.Brand href="/">SignalRGuy</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <NavDropdown title="Actions" id="basic-nav-dropdown">
            <NavDropdown.Item onClick={this.handleApplingTutorialSettings}>Apply tutorial values</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>

        <div className="url">
          <InputGroup className="mb-3">
            <FormControl
              placeholder="SignalR hub URL"
              value={this.state.url}
              onChange={this.handleChangeUrl}
            />
            {!this.state.isConnecting &&
              <Button variant="primary" type="button" onClick={() => this.handleConnect(this.state.url)}>
                Connect
              </Button>
            }
            {this.state.isConnecting &&
              <Button variant="outline-danger" type="button" onClick={this.handleDisconnect}>
                Disconnect
              </Button>
            }
          </InputGroup>
        </div>

        <div className="send-and-receive">
          <div className="methods">
            <h2>
              Send Methods
              <Button className="stick-button" variant="info" size="sm" onClick={() => this.handleShowModal(-1, true)} disabled={this.state.isConnecting}>
                Add
              </Button>
            </h2>
            <div className="method-content">
              {this.state.sendMethods.map((method, methodIndex) => 
                <Card key={methodIndex} className="card">
                  <Card.Header as="h3">
                    {method.name}
                    <Button className="stick-button" variant="success" size="sm" onClick={() => this.handleShowModal(methodIndex, true)} disabled={this.state.isConnecting}>
                      Edit
                    </Button>
                  </Card.Header>
                  <Card.Body>
                    <Form>
                      <Form.Group as={Row}>
                      {method.args.map((arg, argIndex) =>

                      <Container key={argIndex}>
                        <Row className="mb-3">
                          <Col xs="auto">
                            {arg.name} ( {arg.type} )
                          </Col>
                          <Col xs="auto">
                            {arg.type !== "object" &&
                              <Form.Control type="text" placeholder="Input value" value={arg.value} onChange={(e) => this.handleChangeArgValue(e, methodIndex, argIndex)} />
                            }
                          </Col>
                        </Row>
                        {arg.type === "object" &&
                          <ObjectInSendMethod
                            methodIndex={methodIndex}
                            argIndex={argIndex}
                            properties={arg.properties}
                            propertyIndexes={[]}
                            handleChangeArgPropertyValue={(event, methodIndex, argIndex, propertyIndexes) => this.handleChangeArgPropertyValue(event, methodIndex, argIndex, propertyIndexes)}
                          />
                        }
                      </Container>
                      )}
                      </Form.Group>
                    </Form>
                    <Button onClick={() => this.handleSend(methodIndex)} disabled={!this.state.isConnecting}>
                      Send
                    </Button>
                  </Card.Body>
                </Card>
              )}
            </div>
          </div>
          <div className="methods">
            <h2>
              Receive Methods
              <Button className="stick-button" variant="info" size="sm" onClick={() => this.handleShowModal(-1, false)} disabled={this.state.isConnecting}>
                Add
              </Button>
            </h2>
            <div className="method-content">
              {this.state.receiveMethods.map((method, methodIndex) => 
                <Card key={methodIndex} className="card">
                  <Card.Header as="h3">
                    {method.name}
                    <Button className="stick-button" variant="success" size="sm" onClick={() => this.handleShowModal(methodIndex, false)} disabled={this.state.isConnecting}>
                      Edit
                    </Button>
                  </Card.Header>
                  <Card.Body>
                    {method.args.map((arg, argIndex) =>
                      <Container key={argIndex}>
                        <Row className="mb-3">
                          <Col xs="auto">
                            {arg.name} ( {arg.type} )
                          </Col>
                        </Row>
                        {arg.type === "object" &&
                          <ObjectInReceiveMethod
                            properties={arg.properties}
                          />
                        }
                      </Container>
                    )}
                  </Card.Body>
                </Card>
              )}
            </div>
          </div>
        </div>

        <div className="logs">
            <h2>
              Logs
              <Button className="stick-button" variant="outline-warning" size="sm" onClick={this.handleClearLogs}>
                Clear
              </Button>



            </h2>
            <div>
              <ListGroup>
                {this.state.logs.reverse().map((log ,index) => 
                  <ListGroup.Item key={index}>{log.datetime} : {log.message}</ListGroup.Item>
                )}
              </ListGroup>
            </div>
        </div>

        <Modal size="lg" show={this.state.showModal} onHide={this.handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>
              {this.state.modalSendOrReceive &&
                <> Send </>
              }
              {!this.state.modalSendOrReceive &&
                <> Receive </>
              }
              Method</Modal.Title>
          </Modal.Header>
          <Modal.Body>

            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Method name</Form.Label>
                <Form.Control type="text" placeholder="Input method name" value={this.state.methodNameInModal} onChange={this.handleChangeMethodName} />
              </Form.Group>
              <Form.Group>
                <Form.Label>
                  Args
                  <Button variant="info" size="sm" onClick={this.handleAddArg}>Add</Button>
                </Form.Label>
                {this.state.methodArgsInModal.map((arg, argIndex) => 
                  <Container key={argIndex}>
                    <Row className="mb-3">
                      <Col xs="auto">
                        <Form.Control type="text" placeholder="Input argument name" value={arg.name} onChange={(e) => this.handleChangeArgName(e, argIndex)}/>
                      </Col>
                      <Col xs="auto">
                        <Form.Select defaultValue={arg.type} onChange={(e) => this.handleChangeArgType(e, argIndex)}>
                          <option value="string">string</option>
                          <option value="int">int</option>
                          <option value="bool">bool</option>
                          <option value="DateTime">DateTime</option>
                          <option value="object">object</option>
                        </Form.Select>
                      </Col>
                      <Col xs="auto">
                        {arg.type === "object" &&
                          <Button variant="info" type="button" onClick={() => this.handleAddProperty(argIndex, [])}>
                            <Plus/>
                          </Button>
                        }
                        <Button variant="danger" type="button" onClick={() => this.handleDeleteArg(argIndex)}>
                          <TrashFill/>
                        </Button>
                      </Col>
                    </Row>
                    {arg.type === "object" &&
                      <ObjectInModal
                        argIndex={argIndex}
                        properties={arg.properties}
                        propertyIndexes={[]}
                        handleChangePropName={(event, argIndex, propertyIndexes) => this.handleChangePropName(event, argIndex, propertyIndexes)}
                        handleChangePropType={(event, argIndex, propertyIndexes) => this.handleChangePropType(event, argIndex, propertyIndexes)}
                        handleAddProperty={(argIndex, propertyIndexes) => this.handleAddProperty(argIndex, propertyIndexes)}
                        handleDeleteProp={(argIndex, propertyIndexes) => this.handleDeleteProp(argIndex, propertyIndexes)}
                      />
                    }
                  </Container>
                )}
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleCloseModal}>
              Close
            </Button>
            {!this.state.modalAddOrEdit &&
              <Button variant="danger" onClick={this.handleDeleteMethod}>
                Delete
              </Button>
            }
            {!this.state.modalAddOrEdit &&
              <Button variant="success" onClick={this.handleEditMethod}>
                Edit
              </Button>
            }
            {this.state.modalAddOrEdit &&
              <Button variant="info" onClick={this.handleAddMethod}>
                Add
              </Button>
            }
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}