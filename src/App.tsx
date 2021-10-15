import React from 'react';
import './App.css';
let ws: WebSocket

async function socketConnect() {
  ws = new WebSocket('ws://localhost:8080')

  ws.onopen = () => {
    console.log('connected')
  };

  ws.onmessage = evt => {
    // listen to data sent from the websocket server
    const message = JSON.parse(evt.data)
    console.log(message)
  }

  ws.onclose = () => {
    console.log('disconnected')
    // automatically try to reconnect on connection loss
  }
};

const App = () => {
  return (
    <div className="App">
      <div className="header">
        Alerts Dashboard
      </div>
    </div>

  );
}



export default App;
