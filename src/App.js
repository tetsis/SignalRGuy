import React, { Component } from 'react';
import './App.css';
import {
  HubConnectionBuilder,
} from '@microsoft/signalr';
import { Container, Row, Col, Form, Button, Modal, Card, Badge } from 'react-bootstrap';
import { TrashFill, Plus } from 'react-bootstrap-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import toast, { Toaster } from 'react-hot-toast';
import { Header } from './components/Header';
import { Url } from './components/Url';
import { Log } from './components/Log';
import { ObjectInModal } from './components/ObjectInModal';
import { ObjectInSendMethod } from './components/ObjectInSendMethod';
import { ObjectInReceiveMethod } from './components/ObjectInReceiveMethod';
import toISOStringWithTimezone from './functions/toISOStringWithTimezone';
import checkValidName from './functions/checkValidName';
import toStringData from './functions/toStringData';
import convertSendingData from './functions/convertSendingData';

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

  setStateFromLocalStorage = () => {
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

  handleConnect = () => {
    let url = this.state.url;
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
          this.addAndSaveLog("Receive. Method: " + method.name + ", Args: " + toStringData(method.args, data));

          toast(() => (
            <span>
              <Badge bg="success">Receive</Badge>
              {method.name}<br/>
              Args: {toStringData(method.args, data)}
            </span>
          ));
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
      this.state.connection.invoke(method.name, ...method.args.map(arg => convertSendingData(arg)));
      console.log("Send: ");
      console.log(method.name, method.args.map(arg => convertSendingData(arg)));
      this.addAndSaveLog("Send. Method: " + method.name + ", Args: " + toStringData(method.args, method.args.map(arg => convertSendingData(arg))));

      toast(() => (
        <span>
          <Badge bg="primary">Send</Badge>
          {method.name}<br/>
          Args: {toStringData(method.args, method.args.map(arg => convertSendingData(arg)))}
        </span>
      ));

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
    let filteredArgs = checkValidName(args);

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
    let filteredArgs = checkValidName(args);

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
    logs.push({datetime: toISOStringWithTimezone(now), message: message});
    this.setState({logs: logs});

    let json = JSON.stringify(logs);
    localStorage.setItem("Logs", json);
  }

  render() {
    return (
      <>
        <Toaster position="top-right" />

        <Header
          setStateFromLocalStorage={this.setStateFromLocalStorage}
        />

        <div className="url">
          <Url
            url={this.state.url}
            isConnecting={this.state.isConnecting}
            handleChangeUrl={(event) => this.handleChangeUrl(event)}
            handleConnect={this.handleConnect}
            handleDisconnect={this.handleDisconnect}
          />
        </div>

        <div className="send-and-receive">
          <div className="methods">
            <h4>
              Send Methods
              <Button className="stick-button" variant="info" size="sm" onClick={() => this.handleShowModal(-1, true)} disabled={this.state.isConnecting}>
                Add
              </Button>
            </h4>
            <div className="method-content">
              {this.state.sendMethods.map((method, methodIndex) => 
                <Card key={methodIndex} className="card">
                  <Card.Header as="h5">
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
                          <Col>
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
            <h4>
              Receive Methods
              <Button className="stick-button" variant="info" size="sm" onClick={() => this.handleShowModal(-1, false)} disabled={this.state.isConnecting}>
                Add
              </Button>
            </h4>
            <div className="method-content">
              {this.state.receiveMethods.map((method, methodIndex) => 
                <Card key={methodIndex} className="card">
                  <Card.Header as="h5">
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
          <Log
            logs={this.state.logs}
            setStateFromLocalStorage={this.setStateFromLocalStorage}
          />
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
                  <Button className="stick-button" variant="info" size="sm" onClick={this.handleAddArg}>Add</Button>
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