import React, { Component } from 'react';
import './App.css';
import { w3cwebsocket as W3CWebSocket } from "websocket";

const client = new W3CWebSocket('ws://alerts-api.staging.internal.smartcolumbusos.com')

export default class App extends Component {

  componentDidMount() {
    client.onopen = () => {
      console.log('Connected to Alerting Engine');
    };

    client.onmessage = (event) => {
      this.setState({ currentData: JSON.parse((event.data).toString()) });
      console.log('Received Alert')
    };

    client.onclose = () => {
      console.log('Disconnected');
      // automatically try to reconnect on connection loss
    };
  };

  render() {
    return (
      <div>
        Alerting Dashboard Version 2 <br />
      </div>
    )
  };
};