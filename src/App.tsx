import React, { Component } from 'react';
import './App.css';
import { w3cwebsocket as W3CWebSocket } from "websocket";

const client = new W3CWebSocket('ws://alerts-api.staging.internal.smartcolumbusos.com')

interface Alert {
  id: string
  type: AlertType
  severity: AlertSeverity
  time: string
  coordinates: Coordinates
  roadName: string
  status: AlertStatus
}
interface Coordinates {
  latitude: number
  longitude: number
}

export enum AlertStatus {
  NEW = 'new',
}

export enum AlertType {
  CONGESTION = 'congestion',
}

export enum AlertSeverity {
  WARN = 'warn',
}
export default class App extends Component {

  state = {
    alerts: []
  }

  componentDidMount() {
    client.onopen = () => {
      console.log('Connected to Alerting Engine');
    };

    client.onmessage = (message) => {
      const alert = message.data as string;
      if (alert !== "Connected") {
        const parsedAlert = JSON.parse(alert) as Alert;
        console.log('Received Alert');
        console.log(parsedAlert.coordinates);
        this.setState(state => ({ alerts: [alert] }));
      };
    };

    client.onclose = () => {
      console.log('Disconnected');
      // automatically try to reconnect on connection loss
    };
  };

  render() {
    return (
      <div>
        <div>
          Alerting Dashboard Version 2 <br />
        </div>
        <div>
          Alerts: {this.state.alerts}
        </div>
      </div>
    )
  };
};