import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { AlertPane } from './AlertPane';
import { TitleBar } from './TitleBar';

export interface Alert {
    id: string;
    type: AlertType;
    severity: AlertSeverity;
    time: string;
    coordinates: Coordinates;
    location: string;
    status: AlertStatus;
    speed: number;
    avgSpeed: number;
    refSpeed: number;
    camera: string | null;
}

export interface Camera {
    name: string;
    distance: number;
}

export interface Coordinates {
    latitude: number;
    longitude: number;
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
        longitude: -45,
    },
    id: '5678-alert',
    refSpeed: 70,
    location: 'HERON DRIVE',
    severity: AlertSeverity.WARN,
    speed: 0,
    status: AlertStatus.NEW,
    time: new Date().toString(),
    type: AlertType.CONGESTION,
    camera: 'CRANE CT @ BIRD LN',
};

const alert2: Alert = {
    avgSpeed: 100,
    coordinates: {
        latitude: -23,
        longitude: -45,
    },
    id: '9876-alert',
    refSpeed: 70,
    location: 'JOE DRIVE',
    severity: AlertSeverity.WARN,
    speed: 0,
    status: AlertStatus.NEW,
    time: '2021-10-27T21:36:00.231343Z',
    type: AlertType.CONGESTION,
    camera: 'HAYDEN RUN BLVD & HAYDEN RUN RD @ HAYDEN RUN RD & SPRING RIVER AVE',
};

const alert3: Alert = {
    avgSpeed: 60,
    coordinates: {
        latitude: -23,
        longitude: -45,
    },
    id: '0001-alert',
    refSpeed: 70,
    location: 'APPLE STREET',
    severity: AlertSeverity.WARN,
    speed: 0,
    status: AlertStatus.NEW,
    time: '2021-10-27T21:36:00.231343Z',
    type: AlertType.CONGESTION,
    camera: null,
};

export default function App() {
    const [alerts, setAlerts] = useState([alert, alert2, alert3]);
    const websocketRef = useRef<WebSocket>();

    useEffect(() => {
        const websocket = new WebSocket(`${process.env.REACT_APP_ALERTS_URL}`);
        websocket.onopen = () => {
            console.log('Connected to Alerting Engine');
        };
        websocket.onerror = () => {
            console.log('Error received from server');
        };
        websocket.onclose = () => {
            console.log('Disconnected');
        };
        websocket.onmessage = (message) => {
            const stringMessage = message.data as string;
            if (stringMessage !== 'Connected') {
                console.log(stringMessage);
                const alert = JSON.parse(stringMessage) as Alert;
                setAlerts((alerts) => [alert, ...alerts]);
            }
        };
        websocketRef.current = websocket;
    }, []);

    return (
        <div className="App">
            <TitleBar />
            <div className="alertList">
                <AlertPane alerts={alerts} />
            </div>
        </div>
    );
}
