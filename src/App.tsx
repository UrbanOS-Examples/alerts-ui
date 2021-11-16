import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { AlertPane } from './AlertPane';
import { TitleBar } from './TitleBar';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { Config } from './config'

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

export default function App() {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const websocketRef = useRef<ReconnectingWebSocket>();

    useEffect(() => {
        const websocket = new ReconnectingWebSocket(
            `${Config.alerts_url}`
        );
        websocket.addEventListener('message', (message) => {
            const stringMessage = message.data as string;
            if (stringMessage !== 'Connected') {
                console.log(stringMessage);
                const alert = JSON.parse(stringMessage) as Alert;
                setAlerts((alerts) => [alert, ...alerts]);
            }
        });
        websocket.addEventListener('open', () => {
            console.log('Connected to Alerting Engine');
        });
        websocket.addEventListener('close', () => {
            console.log('Disconnected');
        });
        websocket.addEventListener('error', () => {
            console.log('Error received from server');
        });
        websocketRef.current = websocket;
        return () => websocket.close();
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
