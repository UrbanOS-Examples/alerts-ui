import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import './AlertPane.css';
import { AlertPane } from './AlertPane';
import { TitleBar } from './TitleBar';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { Config } from './config'
import ReactMapGL, {Marker} from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
import congestionIcon from './congestion_icon.png';
import { MAPBOX_PUBLIC_KEY } from './mapbox_public_key'

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
                if (!alerts.includes(alert)) {
                    setAlerts((alerts) => [alert, ...alerts]);
                }
                setViewport({
                    latitude: 39.98654998139231, 
                    longitude: -83.00250910125781,
                    width: '100vw',
                    height: '100vh',
                    zoom: 10})
            }
        });
        websocket.addEventListener('open', () => {
            console.log('Connected to Alerting Engine');
        });
        websocket.addEventListener('close', () => {
            console.log('Disconnected');
            setAlerts((alerts) => [])
        });
        websocket.addEventListener('error', () => {
            console.log('Error received from server');
        });
        websocketRef.current = websocket;
        return () => websocket.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="App">
            <TitleBar />
            <ReactMapGL 
                {...viewport} 
                mapboxApiAccessToken={MAPBOX_PUBLIC_KEY}
                mapStyle="mapbox://styles/mapbox/light-v10"
                minZoom={8}
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
                        <button
                        className="marker-btn"
                        onClick={e => {
                            e.preventDefault();
                            setViewport({
                                ...viewport,
                                longitude: congestionAlert.coordinates.longitude,
                                latitude: congestionAlert.coordinates.latitude,
                                width: '100vw',
                                height: '100vh',
                                zoom: 20
                              });
                          }}
                        >
                            <img
                                className="AlertCard-congestionIcon"
                                data-testid="congestionIcon"
                                src={congestionIcon}
                                alt=""
                            />
                        </button>
                    </Marker>
                ))}
                <div className="alertList">
                    <AlertPane alerts={alerts} />
                </div>
            </ReactMapGL>
        </div>
    );
}
