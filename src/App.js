import React, { Component } from 'react';
import './App.css';
import {
  HubConnectionBuilder,
} from '@microsoft/signalr';
import { Container, Row, Col, Form, Button, Modal, ListGroup } from 'react-bootstrap';
import { TrashFill } from 'react-bootstrap-icons';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: "https://localhost:44338/testHub",
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
        connection.on(method.name, (...args) => {
          console.log("Receive: ");
          console.log(method.name, args);
          this.addAndSaveLog("Receive. Method: " + method.name + ", Args: " + args);
          for (let i = 0; i < method.args.length; i++) {
            console.log(method.args[i].name, args[i]);
          }
        });
      });
    });
  }

  handleDisconnect = () => {
    this.state.connection.stop();
    this.addAndSaveLog("Disconnecting to " + this.state.url);
  }

  handleSend(index) {
    let method = this.state.sendMethods[index];

    try {
      this.state.connection.invoke(method.name, ...method.args.map(arg => arg.value));
      console.log("Send: ");
      console.log(method.name, ...method.args.map(arg => arg.value));
      this.addAndSaveLog("Send. Method: " + method.name + ", Args: " + method.args.map(arg => arg.value));
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
      let method = this.state.sendMethods[index];
      let args = method.args.map((obj) => Object.assign({},obj));
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
    this.setState({methodArgsInModal: args});
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
    let filteredArgs = args.filter(e => e.name.match(/^[A-Za-z0-9]+$/));

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
    let filteredArgs = args.filter(e => e.name.match(/^[A-Za-z0-9]+$/));

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

  addAndSaveLog = (message) => {
    let logs = this.state.logs;
    let now = new Date();
    logs.push({datetime: now.toISOString(), message: message});
    this.setState({logs: logs});

    let json = JSON.stringify(logs);
    localStorage.setItem("Logs", json);
  }

  render() {
    return (
      <>
      <Container>
        <Row>
          <Form>
            <Row>
              <Col>
                <Form.Control type="text" placeholder="https://localhost:44338/testHub" value={this.state.url} onChange={this.handleChangeUrl} />
              </Col>
              <Col md="2">
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
              </Col>
            </Row>
          </Form>
        </Row>
        <Row>
          <Col>
            <h2>
              Send Methods
              <Button variant="info" size="sm" onClick={() => this.handleShowModal(-1, true)} disabled={this.state.isConnecting}>
                Add
              </Button>
            </h2>
            {this.state.sendMethods.map((method, methodIndex) => 
            <>
              <h3 key={methodIndex}>
                {method.name}
                <Button variant="success" size="sm" onClick={() => this.handleShowModal(methodIndex, true)} disabled={this.state.isConnecting}>
                  Edit
                </Button>
              </h3>
              <h4>
                Args
              </h4>
              {method.args.map((arg, argIndex) =>
                <Form>
                  <Form.Group as={Row} key={argIndex}>
                    <Form.Label column xs="4">
                      {arg.name} ( {arg.type} )
                    </Form.Label>
                    <Col xs="8">
                      <Form.Control type="text" placeholder="Input value" value={arg.value} onChange={(e) => this.handleChangeArgValue(e, methodIndex, argIndex)} />
                    </Col>
                  </Form.Group>
                </Form>
              )}
              <Button onClick={() => this.handleSend(methodIndex)} disabled={!this.state.isConnecting}>
                Send
              </Button>
            </>
            )}
          </Col>
          <Col>
            <h2>
              Receive Methods
              <Button variant="info" size="sm" onClick={() => this.handleShowModal(-1, false)} disabled={this.state.isConnecting}>
                Add
              </Button>
            </h2>
            {this.state.receiveMethods.map((method, methodIndex) => 
            <>
              <h3 key={methodIndex}>
                {method.name}
                <Button variant="success" size="sm" onClick={() => this.handleShowModal(methodIndex, false)} disabled={this.state.isConnecting}>
                  Edit
                </Button>
              </h3>
              <h4>
                Args
              </h4>
              {method.args.map((arg, argIndex) =>
                <Form key={argIndex}>
                  <Form.Group as={Row}>
                    <Form.Label column xs="4">
                      {arg.name} ( {arg.type} )
                    </Form.Label>
                  </Form.Group>
                </Form>
              )}
            </>
            )}
          </Col>
        </Row>

        <Row>
          <Col>
            <h2>Logs</h2>
            <ListGroup style={{ display: 'flex' }}>
              {this.state.logs.map((log ,index) => 
                <ListGroup.Item key={index} style={{order: -index}}>{log.datetime} : {log.message}</ListGroup.Item>
              )}
            </ListGroup>
          </Col>
        </Row>

      </Container>

      <Modal show={this.state.showModal} onHide={this.handleCloseModal}>
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
                {this.state.methodArgsInModal.map((arg, index) => 
                  <Row key={index}>
                    <Col md="6">
                      <Form.Control type="text" placeholder="Input argument name" value={arg.name} onChange={(e) => this.handleChangeArgName(e, index)}/>
                    </Col>
                    <Col md="4">
                      <Form.Select defaultValue={arg.type} onChange={(e) => this.handleChangeArgType(e, index)}>
                        <option value="string">string</option>
                        <option value="int">int</option>
                        <option value="bool">bool</option>
                        <option value="DateTime">DateTime</option>
                      </Form.Select>
                    </Col>
                    <Col md="2">
                      <Button variant="danger" type="button" onClick={() => this.handleDeleteArg(index)}>
                        <TrashFill/>
                      </Button>
                    </Col>
                  </Row>
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