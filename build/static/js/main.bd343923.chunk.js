(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{49:function(e,t,a){e.exports=a(72)},54:function(e,t,a){},58:function(e,t,a){},72:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),o=a(22),l=a.n(o),s=(a(54),a(9)),d=a.n(s),c=a(12),i=a(7),m=a(10),h=a(18),u=a(13),g=a(17),p=a(27),v=(a(58),a(85)),E=a(77),f=a(63),S=a(87),M=a(78),y=a(81),C=a(88),I=a(90),A=a(66),b=a(89),N=a(82),x=a(86),k=a(84),O=a(79),P=a(80);a(60);function D(e){return r.a.createElement(E.a,null,r.a.createElement(f.a,{xs:"auto"},r.a.createElement(r.a.Fragment,null,"\xa0")),r.a.createElement(f.a,{xs:"auto"},e.properties.map(function(t,a){var n=Object(p.a)(e.propertyIndexes);return n.push(a),r.a.createElement(r.a.Fragment,null,r.a.createElement(E.a,{className:"mb-3"},r.a.createElement(f.a,{xs:"auto"},r.a.createElement(S.a.Control,{type:"text",placeholder:"Input argument name",value:t.name,onChange:function(t){return e.handleChangePropName(t,e.argIndex,n)}})),r.a.createElement(f.a,{xs:"auto"},r.a.createElement(S.a.Select,{defaultValue:t.type,onChange:function(t){return e.handleChangePropType(t,e.argIndex,n)}},r.a.createElement("option",{value:"string"},"string"),r.a.createElement("option",{value:"int"},"int"),r.a.createElement("option",{value:"bool"},"bool"),r.a.createElement("option",{value:"DateTime"},"DateTime"),r.a.createElement("option",{value:"object"},"object"))),r.a.createElement(f.a,{xs:"auto"},"object"===t.type&&r.a.createElement(M.a,{variant:"info",type:"button",onClick:function(){return e.handleAddProperty(e.argIndex,n)}},r.a.createElement(O.a,null)),r.a.createElement(M.a,{variant:"danger",type:"button",onClick:function(){return e.handleDeleteProp(e.argIndex,n)}},r.a.createElement(P.a,null)))),"object"===t.type&&r.a.createElement(D,{argIndex:e.argIndex,properties:t.properties,propertyIndexes:n,handleChangePropName:function(t,a,n){return e.handleChangePropName(t,a,n)},handleChangePropType:function(t,a,n){return e.handleChangePropType(t,a,n)},handleAddProperty:function(t,a){return e.handleAddProperty(t,a)},handleDeleteProp:function(t,a){return e.handleDeleteProp(t,a)}}))})))}function j(e){return r.a.createElement(E.a,null,r.a.createElement(f.a,{xs:"auto"},r.a.createElement(r.a.Fragment,null,"\xa0")),r.a.createElement(f.a,{xs:"auto"},e.properties.map(function(t,a){var n=Object(p.a)(e.propertyIndexes);return n.push(a),r.a.createElement("div",{key:a},r.a.createElement(E.a,{key:a,className:"mb-3"},r.a.createElement(f.a,{xs:"auto"},t.name," ( ",t.type," )"),r.a.createElement(f.a,{xs:"auto"},"object"!==t.type&&r.a.createElement(S.a.Control,{type:"text",placeholder:"Input value",value:t.value,onChange:function(t){return e.handleChangeArgPropertyValue(t,e.methodIndex,e.argIndex,n)}}))),"object"===t.type&&r.a.createElement(j,{methodIndex:e.methodIndex,argIndex:e.argIndex,properties:t.properties,propertyIndexes:n,handleChangeArgPropertyValue:function(t,a,n,r){return e.handleChangeArgPropertyValue(t,a,n,r)}}))})))}function R(e){return r.a.createElement(E.a,null,r.a.createElement(f.a,{xs:"auto"},r.a.createElement(r.a.Fragment,null,"\xa0")),r.a.createElement(f.a,{xs:"auto"},e.properties.map(function(e,t){return r.a.createElement("div",{key:t},r.a.createElement(E.a,{key:t,className:"mb-3"},r.a.createElement(f.a,{xs:"auto"},e.name," ( ",e.type," )")),"object"===e.type&&r.a.createElement(R,{properties:e.properties}))})))}function w(e){return r.a.createElement(y.a,{position:"top-end"},r.a.createElement(C.a,null,r.a.createElement(C.a.Header,null,r.a.createElement("img",{src:"holder.js/20x20?text=%20",className:"rounded me-2",alt:""}),r.a.createElement("strong",{className:"me-auto"},"Bootstrap"),r.a.createElement("small",{className:"text-muted"},"just now")),r.a.createElement(C.a.Body,null,"See? Just like this.")))}var T=function(e){function t(e){var a;return Object(i.a)(this,t),(a=Object(h.a)(this,Object(u.a)(t).call(this,e))).handleChangeUrl=function(e){a.setState({url:e.target.value})},a.handleDisconnect=function(){a.state.connection.stop(),a.addAndSaveLog("Disconnecting to "+a.state.url)},a.handleShowModal=function(e,t){if(a.setState({modalSendOrReceive:t}),-1===e)a.setState({methodNameInModal:"",methodArgsInModal:[{name:"",type:"string"}],modalAddOrEdit:!0,modalIndex:-1});else{var n=t?a.state.sendMethods[e]:a.state.receiveMethods[e],r=JSON.parse(JSON.stringify(n.args));a.setState({methodNameInModal:n.name,methodArgsInModal:r,modalAddOrEdit:!1,modalIndex:e})}a.setState({showModal:!0})},a.handleCloseModal=function(){return a.setState({showModal:!1})},a.handleAddArg=function(){var e=a.state.methodArgsInModal;e.push({name:"",type:"string"}),a.setState({methodArgsInModal:e})},a.handleDeleteArg=function(e){var t=a.state.methodArgsInModal;t.splice(e,1),a.setState({methodArgsInModal:t})},a.handleAddProperty=function(e,t){for(var n=a.state.methodArgsInModal,r=n[e].properties,o=0;o<t.length;o++)r=r[t[o]].properties;r.push({name:"",type:"string"}),console.log(n),a.setState({methodArgsInModal:n})},a.handleDeleteProp=function(e,t){for(var n=a.state.methodArgsInModal,r=n[e].properties,o=0;o<t.length-1;o++)r=r[t[o]].properties;r.splice(t[t.length-1],1),a.setState({methodArgsInModal:n})},a.handleChangeMethodName=function(e){a.setState({methodNameInModal:e.target.value})},a.handleChangeArgName=function(e,t){var n=a.state.methodArgsInModal;n[t].name=e.target.value,a.setState({methodArgsInModal:n})},a.handleChangeArgType=function(e,t){var n=a.state.methodArgsInModal;n[t].type=e.target.value,"object"===e.target.value?(n[t].properties=[],delete n[t].value):delete n[t].properties,a.setState({methodArgsInModal:n})},a.handleChangePropName=function(e,t,n){for(var r=a.state.methodArgsInModal,o=r[t].properties,l=0;l<n.length-1;l++)o=o[n[l]].properties;o[n[n.length-1]].name=e.target.value,a.setState({methodArgsInModal:r})},a.handleChangePropType=function(e,t,n){for(var r=a.state.methodArgsInModal,o=r[t].properties,l=0;l<n.length-1;l++)o=o[n[l]].properties;o[n[n.length-1]].type=e.target.value,"object"===e.target.value&&(o[n[n.length-1]].properties=[],delete o[n[n.length-1]].value),a.setState({methodArgsInModal:r})},a.handleAddMethod=function(){var e;e=a.state.modalSendOrReceive?a.state.sendMethods:a.state.receiveMethods;var t=a.state.methodArgsInModal,n=a.checkArrayName(t);e.push({name:a.state.methodNameInModal,args:n}),a.state.modalSendOrReceive?(a.setState({sendMethods:e}),a.saveSendMethods()):(a.setState({receiveMethods:e}),a.saveReceiveMethods()),a.handleCloseModal()},a.handleDeleteMethod=function(){var e;(e=a.state.modalSendOrReceive?a.state.sendMethods:a.state.receiveMethods).splice(a.state.modalIndex,1),a.state.modalSendOrReceive?(a.setState({sendMethods:e}),a.saveSendMethods()):(a.setState({receiveMethods:e}),a.saveReceiveMethods()),a.handleCloseModal()},a.handleEditMethod=function(){var e;e=a.state.modalSendOrReceive?a.state.sendMethods:a.state.receiveMethods;var t=a.state.methodArgsInModal,n=a.checkArrayName(t);e[a.state.modalIndex]={name:a.state.methodNameInModal,args:n},a.state.modalSendOrReceive?(a.setState({sendMethods:e}),a.saveSendMethods()):(a.setState({receiveMethods:e}),a.saveReceiveMethods()),a.handleCloseModal()},a.handleChangeArgValue=function(e,t,n){var r=a.state.sendMethods;r[t].args[n].value=e.target.value,a.setState({sendMethods:r}),a.saveSendMethods()},a.handleChangeArgPropertyValue=function(e,t,n,r){for(var o=a.state.sendMethods,l=o[t].args[n].properties,s=0;s<r.length-1;s++)l=l[r[s]].properties;l[r[r.length-1]].value=e.target.value,a.setState({sendMethods:o}),a.saveSendMethods()},a.handleClearLogs=function(){var e=a.state.logs;e=[],a.setState({logs:e});var t=JSON.stringify(e);localStorage.setItem("Logs",t)},a.setSendMethods=function(){if(!localStorage.getItem("SendMethods")){var e=JSON.parse("[]");localStorage.setItem("SendMethods",e)}var t=localStorage.getItem("SendMethods"),n=JSON.parse(t);a.setState({sendMethods:n})},a.setReceiveMethods=function(){if(!localStorage.getItem("ReceiveMethods")){var e=JSON.parse("[]");localStorage.setItem("ReceiveMethods",e)}var t=localStorage.getItem("ReceiveMethods"),n=JSON.parse(t);a.setState({receiveMethods:n})},a.saveSendMethods=function(){var e=a.state.sendMethods,t=JSON.stringify(e);localStorage.setItem("SendMethods",t)},a.saveReceiveMethods=function(){var e=a.state.receiveMethods,t=JSON.stringify(e);localStorage.setItem("ReceiveMethods",t)},a.addAndSaveLog=function(e){var t=a.state.logs,n=new Date;t.push({datetime:a.toISOStringWithTimezone(n),message:e}),a.setState({logs:t});var r=JSON.stringify(t);localStorage.setItem("Logs",r)},a.state={url:"https://localhost:44338/testHub",isConnecting:!1,showModal:!1,modalAddOrEdit:!0,modalSendOrReceive:!0,modalIndex:-1,methodNameInModal:"",methodArgsInModal:[],sendMethods:[],receiveMethods:[],logs:[],connection:null},a}return Object(g.a)(t,e),Object(m.a)(t,[{key:"componentDidMount",value:function(){localStorage.getItem("SendMethods")||localStorage.setItem("SendMethods","[]"),localStorage.getItem("ReceiveMethods")||localStorage.setItem("ReceiveMethods","[]"),localStorage.getItem("Logs")||localStorage.setItem("Logs","[]");var e=localStorage.getItem("SendMethods"),t=JSON.parse(e);this.setState({sendMethods:t});var a=localStorage.getItem("ReceiveMethods"),n=JSON.parse(a);this.setState({receiveMethods:n});var r=localStorage.getItem("Logs"),o=JSON.parse(r);this.setState({logs:o})}},{key:"handleConnect",value:function(){var e=Object(c.a)(d.a.mark(function e(t){var a,n=this;return d.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:a=(new v.a).withUrl(t).build(),this.setState({connection:a},function(){a.start().then(function(){console.log("SignalR Connected."),n.setState({isConnecting:!0}),n.addAndSaveLog("Connecting to "+t)}).catch(function(e){console.log("Error while establishing connection :("),n.setState({isConnecting:!1}),n.addAndSaveLog("Could not connect to "+t)}),a.onclose(function(){n.setState({isConnecting:!1})}),n.state.receiveMethods.forEach(function(e){a.on(e.name,function(){console.log("Receive: ");for(var t=arguments.length,a=new Array(t),o=0;o<t;o++)a[o]=arguments[o];console.log(e.name,a),n.addAndSaveLog("Receive. Method: "+e.name+", Args: "+n.toStringData(e.args,a)),n.render(r.a.createElement(w,null))})})});case 2:case"end":return e.stop()}},e,this)}));return function(t){return e.apply(this,arguments)}}()},{key:"convertSendingData",value:function(e){var t=this;return"int"===e.type?parseInt(e.value,10):"object"===e.type?Object.fromEntries(e.properties.map(function(e){return[e.name,t.convertSendingData(e)]})):e.value}},{key:"toStringData",value:function(e,t){for(var a=[],n=0;n<e.length;n++)a.push(e[n].name+":"+JSON.stringify(t[n]));return a}},{key:"handleSend",value:function(e){var t=this,a=this.state.sendMethods[e];try{var n;(n=this.state.connection).invoke.apply(n,[a.name].concat(Object(p.a)(a.args.map(function(e){return t.convertSendingData(e)})))),console.log("Send: "),console.log(a.name,a.args.map(function(e){return t.convertSendingData(e)})),this.addAndSaveLog("Send. Method: "+a.name+", Args: "+this.toStringData(a.args,a.args.map(function(e){return t.convertSendingData(e)})))}catch(r){console.error(r)}}},{key:"checkArrayName",value:function(e){var t=this,a=e.filter(function(e){return e.name.match(/^[A-Za-z0-9]+$/)});return e.forEach(function(e){"properties"in e&&(e.properties=t.checkArrayName(e.properties))}),a}},{key:"toISOStringWithTimezone",value:function(e){var t=-e.getTimezoneOffset(),a=t>=0?"+":"-",n=function(e){var t=Math.floor(Math.abs(e));return(t<10?"0":"")+t};return e.getFullYear()+"-"+n(e.getMonth()+1)+"-"+n(e.getDate())+"T"+n(e.getHours())+":"+n(e.getMinutes())+":"+n(e.getSeconds())+"."+n(e.getMilliseconds())+a+n(t/60)+":"+n(t%60)}},{key:"render",value:function(){var e=this;return r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{className:"url"},r.a.createElement(I.a,{className:"mb-3"},r.a.createElement(A.a,{value:this.state.url,onChange:this.handleChangeUrl}),!this.state.isConnecting&&r.a.createElement(M.a,{variant:"primary",type:"button",onClick:function(){return e.handleConnect(e.state.url)}},"Connect"),this.state.isConnecting&&r.a.createElement(M.a,{variant:"outline-danger",type:"button",onClick:this.handleDisconnect},"Disconnect"))),r.a.createElement("div",{className:"send-and-receive"},r.a.createElement("div",{className:"methods"},r.a.createElement("h2",null,"Send Methods",r.a.createElement(M.a,{className:"stick-button",variant:"info",size:"sm",onClick:function(){return e.handleShowModal(-1,!0)},disabled:this.state.isConnecting},"Add")),r.a.createElement("div",{className:"method-content"},this.state.sendMethods.map(function(t,a){return r.a.createElement(b.a,{key:a,className:"card"},r.a.createElement(b.a.Header,{as:"h3"},t.name,r.a.createElement(M.a,{className:"stick-button",variant:"success",size:"sm",onClick:function(){return e.handleShowModal(a,!0)},disabled:e.state.isConnecting},"Edit")),r.a.createElement(b.a.Body,null,r.a.createElement(S.a,null,r.a.createElement(S.a.Group,{as:E.a},t.args.map(function(t,n){return r.a.createElement(N.a,{key:n},r.a.createElement(E.a,{className:"mb-3"},r.a.createElement(f.a,{xs:"auto"},t.name," ( ",t.type," )"),r.a.createElement(f.a,{xs:"auto"},"object"!==t.type&&r.a.createElement(S.a.Control,{type:"text",placeholder:"Input value",value:t.value,onChange:function(t){return e.handleChangeArgValue(t,a,n)}}))),"object"===t.type&&r.a.createElement(j,{methodIndex:a,argIndex:n,properties:t.properties,propertyIndexes:[],handleChangeArgPropertyValue:function(t,a,n,r){return e.handleChangeArgPropertyValue(t,a,n,r)}}))}))),r.a.createElement(M.a,{onClick:function(){return e.handleSend(a)},disabled:!e.state.isConnecting},"Send")))}))),r.a.createElement("div",{className:"methods"},r.a.createElement("h2",null,"Receive Methods",r.a.createElement(M.a,{className:"stick-button",variant:"info",size:"sm",onClick:function(){return e.handleShowModal(-1,!1)},disabled:this.state.isConnecting},"Add")),r.a.createElement("div",{className:"method-content"},this.state.receiveMethods.map(function(t,a){return r.a.createElement(b.a,{key:a,className:"card"},r.a.createElement(b.a.Header,{as:"h3"},t.name,r.a.createElement(M.a,{className:"stick-button",variant:"success",size:"sm",onClick:function(){return e.handleShowModal(a,!1)},disabled:e.state.isConnecting},"Edit")),r.a.createElement(b.a.Body,null,t.args.map(function(e,t){return r.a.createElement(N.a,{key:t},r.a.createElement(E.a,{className:"mb-3"},r.a.createElement(f.a,{xs:"auto"},e.name," ( ",e.type," )")),"object"===e.type&&r.a.createElement(R,{properties:e.properties}))})))})))),r.a.createElement("div",{className:"logs"},r.a.createElement("h2",null,"Logs",r.a.createElement(M.a,{className:"stick-button",variant:"outline-warning",size:"sm",onClick:this.handleClearLogs},"Clear")),r.a.createElement("div",null,r.a.createElement(x.a,null,this.state.logs.reverse().map(function(e,t){return r.a.createElement(x.a.Item,{key:t},e.datetime," : ",e.message)})))),r.a.createElement(k.a,{size:"lg",show:this.state.showModal,onHide:this.handleCloseModal},r.a.createElement(k.a.Header,{closeButton:!0},r.a.createElement(k.a.Title,null,this.state.modalSendOrReceive&&r.a.createElement(r.a.Fragment,null," Send "),!this.state.modalSendOrReceive&&r.a.createElement(r.a.Fragment,null," Receive "),"Method")),r.a.createElement(k.a.Body,null,r.a.createElement(S.a,null,r.a.createElement(S.a.Group,{className:"mb-3"},r.a.createElement(S.a.Label,null,"Method name"),r.a.createElement(S.a.Control,{type:"text",placeholder:"Input method name",value:this.state.methodNameInModal,onChange:this.handleChangeMethodName})),r.a.createElement(S.a.Group,null,r.a.createElement(S.a.Label,null,"Args",r.a.createElement(M.a,{variant:"info",size:"sm",onClick:this.handleAddArg},"Add")),this.state.methodArgsInModal.map(function(t,a){return r.a.createElement(N.a,{key:a},r.a.createElement(E.a,{className:"mb-3"},r.a.createElement(f.a,{xs:"auto"},r.a.createElement(S.a.Control,{type:"text",placeholder:"Input argument name",value:t.name,onChange:function(t){return e.handleChangeArgName(t,a)}})),r.a.createElement(f.a,{xs:"auto"},r.a.createElement(S.a.Select,{defaultValue:t.type,onChange:function(t){return e.handleChangeArgType(t,a)}},r.a.createElement("option",{value:"string"},"string"),r.a.createElement("option",{value:"int"},"int"),r.a.createElement("option",{value:"bool"},"bool"),r.a.createElement("option",{value:"DateTime"},"DateTime"),r.a.createElement("option",{value:"object"},"object"))),r.a.createElement(f.a,{xs:"auto"},"object"===t.type&&r.a.createElement(M.a,{variant:"info",type:"button",onClick:function(){return e.handleAddProperty(a,[])}},r.a.createElement(O.a,null)),r.a.createElement(M.a,{variant:"danger",type:"button",onClick:function(){return e.handleDeleteArg(a)}},r.a.createElement(P.a,null)))),"object"===t.type&&r.a.createElement(D,{argIndex:a,properties:t.properties,propertyIndexes:[],handleChangePropName:function(t,a,n){return e.handleChangePropName(t,a,n)},handleChangePropType:function(t,a,n){return e.handleChangePropType(t,a,n)},handleAddProperty:function(t,a){return e.handleAddProperty(t,a)},handleDeleteProp:function(t,a){return e.handleDeleteProp(t,a)}}))})))),r.a.createElement(k.a.Footer,null,r.a.createElement(M.a,{variant:"secondary",onClick:this.handleCloseModal},"Close"),!this.state.modalAddOrEdit&&r.a.createElement(M.a,{variant:"danger",onClick:this.handleDeleteMethod},"Delete"),!this.state.modalAddOrEdit&&r.a.createElement(M.a,{variant:"success",onClick:this.handleEditMethod},"Edit"),this.state.modalAddOrEdit&&r.a.createElement(M.a,{variant:"info",onClick:this.handleAddMethod},"Add"))))}}]),t}(n.Component),L=function(e){e&&e instanceof Function&&a.e(1).then(a.bind(null,83)).then(function(t){var a=t.getCLS,n=t.getFID,r=t.getFCP,o=t.getLCP,l=t.getTTFB;a(e),n(e),r(e),o(e),l(e)})};l.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(T,null)),document.getElementById("root")),L()}},[[49,3,2]]]);
//# sourceMappingURL=main.bd343923.chunk.js.map