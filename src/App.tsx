import React, { Component } from 'react';
import './App.css';
import {AlertCard} from "./AlertCard";
import { w3cwebsocket as W3CWebSocket } from "websocket";

const client = new W3CWebSocket('wss://alerts-api.staging.internal.smartcolumbusos.com')

export interface Alert {
  id: string
  type: AlertType
  severity: AlertSeverity
  time: string
  coordinates: Coordinates
  roadName: string
  status: AlertStatus
  speed: number
  avgSpeed: number
  refSpeed: number
}
export interface Coordinates {
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

const alert: Alert = {
  avgSpeed: 60,
  coordinates: {
    latitude: -23,
    longitude: -45
  },
  id: '5678-alert',
  refSpeed: 70,
  roadName: 'HERON DRIVE',
  severity: AlertSeverity.WARN,
  speed: 0,
  status: AlertStatus.NEW,
  time: '2021-10-27T21:36:00.231343Z',
  type: AlertType.CONGESTION

}

export default class App extends Component {

  state = {
    alerts: [alert]
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
        this.setState(() => ({ alerts: [alert] }));
      }
    };

    client.onclose = () => {
      console.log('Disconnected');
    };
  };

  render() {
    return (
      <div className="App">
        <div>
          Alerting Dashboard Version 2 <br />
        </div>
        <div className="alertList">
          <AlertCard alert={this.state.alerts[0]} />
        </div>
      </div>
    )
  };
};
