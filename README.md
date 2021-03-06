# SignalR Guy
![Vercel](https://vercelbadge.vercel.app/api/tetsis/signalrguy)

## What is "SignalR Guy"
SignalR Guy is a tool for testing the operation of SignalR servers.
You can check if the SignalR server you are developing sends and receives messages as expected.

You can use in [here](https://signalrguy.vercel.app).

## Get started
I have prepared SignalR hub server for tutorial.
You can get started without own server.

How to use tutorial is bellow.
1. Access to [web site](https://signalrguy.vercel.app)
1. Header -> "Actions" -> "Appliy tutorial values"
1. Click "Connect" button
1. Wait until changing button to "Disconnect"
1. Click "Send" buttons
1. You can see receiving data from server.

[Source code of tutorial server](https://github.com/tetsis/SignalRGuyTutorialServer)

## How to use
1. Input the URL of SignalR hub endpoint.
    - Server must be allow cross-origin access from "https://signalrguy.vercel.app/".
1. Define send methods and receive methods.
1. Connect to server to click "Connect" button.
1. Send messages to click "Send" buttons.
1. Check receiving messages.

## Sections
### URL
In the top text box, input the URL of SignalR Hub.
Click the "Connect" button to connect to hub.

### Send Methods
In this section, you define methods that client sends to server.
"SendMessage" in the following function is applicable.
```
public Task SendMessage(string message)
{
    return Clients.Caller.SendAsync("ReceiveMessage", message);
}
```

### Receive Methods
In this section, you define methods that client receives from server.
"Pong" in the following function is applicable.
```
public Task Ping()
{
    return Clients.Caller.SendAsync("Pong");
}
```

### Logs
The results of sending and receiving will be saved here.