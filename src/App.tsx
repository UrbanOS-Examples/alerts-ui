import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import './AlertPane.css';
import { AlertPane } from './AlertPane';
import { TitleBar } from './TitleBar';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { Config } from './config'
import ReactMapGL, {Marker} from 'react-map-gl'
import congestionIcon from './congestion_icon.png';

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
    const [viewport, setViewport] = useState({
        latitude: 39.98654998139231, 
        longitude: -83.00250910125781,
        width: '100vw',
        height: '100vh',
        zoom: 10
    })
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
            <ReactMapGL 
                {...viewport} 
                mapboxApiAccessToken={Config.mapbox_key}
                mapStyle="mapbox://styles/mapbox/streets-v11"
                onViewportChange={(viewport: React.SetStateAction<{ latitude: number; longitude: number; width: string; height: string; zoom: number; }>) => {
                    setViewport(viewport);
                }}
            >
                {alerts.map ((congestionAlert) => (
                    <Marker
                    key={congestionAlert.id}
                    latitude={congestionAlert.coordinates.latitude}
                    longitude={congestionAlert.coordinates.longitude}
                    >
                        <div>
                        <img
                            className="AlertCard-congestionIcon"
                            data-testid="congestionIcon"
                            src={congestionIcon}
                            alt=""
                        />
                        </div>
                    </Marker>
                ))}
                <div className="alertList">
                    <AlertPane alerts={alerts} />
                </div>
            </ReactMapGL>
        </div>
    );
}
