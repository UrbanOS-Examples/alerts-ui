import React from 'react';
import { render, screen } from '@testing-library/react';
import App, { Alert, AlertSeverity, AlertStatus, AlertType } from './App';
import WS from 'jest-websocket-mock';
import waitForExpect from 'wait-for-expect';
import SpyInstance = jest.SpyInstance;
import { Config } from "./config"

let fakeConsole: SpyInstance;
let socketServer: WS;

beforeEach(() => {
    fakeConsole = jest.spyOn(console, 'log').mockImplementation();
    const url: string = `${Config.alerts_url}`;
    socketServer = new WS(url);
    Config.alerts_url = 'ws://localhost:9876';
});

afterEach(() => {
    WS.clean();
    fakeConsole.mockRestore();
});

test('renders dashboard title', () => {
    render(<App />);
    const linkElement = screen.getByText(/Smart Traffic/i);
    expect(linkElement).toBeInTheDocument();
});

test('renders alert pane', () => {
    const { container } = render(<App />);
    expect(container.getElementsByClassName('AlertPane').length).toBe(1);
});

test('connects to alert stream on startup', async () => {
    render(<App />);
    await socketServer.connected;
    expect(numberOfWebsocketClients()).toEqual(1);
});

test('logs when connected to alert stream', async () => {
    render(<App />);
    await waitForExpect(() => {
        expect(fakeConsole).toHaveBeenCalledWith(
            'Connected to Alerting Engine',
        );
    });
});

test('logs when there is an error', async () => {
    render(<App />);
    socketServer.error();
    await waitForExpect(() => {
        expect(fakeConsole).toHaveBeenCalledWith('Error received from server');
    });
});

test('logs when the socket is disconnected', async () => {
    render(<App />);
    socketServer.close();
    await waitForExpect(() => {
        expect(fakeConsole).toHaveBeenCalledWith('Disconnected');
        expect(numberOfWebsocketClients()).toEqual(0);
    });
});

test('logs when new alert is received', async () => {
    render(<App />);
    await socketServer.connected;
    const alert: Alert = {
        avgSpeed: 0,
        coordinates: { latitude: 0, longitude: 0 },
        id: '1234-alert',
        refSpeed: 0,
        location: '',
        severity: AlertSeverity.WARN,
        speed: 0,
        status: AlertStatus.NEW,
        time: '',
        type: AlertType.CONGESTION,
        camera: null,
    };
    const alertMessage = JSON.stringify(alert);
    socketServer.send(alertMessage);
    await waitForExpect(() => {
        expect(fakeConsole).toHaveBeenCalledWith(alertMessage);
    });
});

test('adds new alerts to current set', async () => {
    render(<App />);
    await socketServer.connected;
    const alert: Alert = {
        avgSpeed: 0,
        coordinates: { latitude: 0, longitude: 0 },
        id: '1234-alert',
        refSpeed: 0,
        location: 'Test Road',
        severity: AlertSeverity.WARN,
        speed: 0,
        status: AlertStatus.NEW,
        time: '',
        type: AlertType.CONGESTION,
        camera: null,
    };
    const alertMessage = JSON.stringify(alert);
    socketServer.send(alertMessage);
    await waitForExpect(() => {
        const newAlert = screen.getByText('Test Road');
        expect(newAlert).toBeInTheDocument();
    });
});

function numberOfWebsocketClients() {
    return socketServer.server.clients().length;
}

test('only open one websocket connection', async () => {
    expect(numberOfWebsocketClients()).toEqual(0);
    render(<App />);
    await waitForExpect(() => {
        expect(numberOfWebsocketClients()).toEqual(1);
    });
    const alert: Alert = {
        avgSpeed: 0,
        coordinates: { latitude: 0, longitude: 0 },
        id: '7777-alert',
        refSpeed: 0,
        location: 'Test Road',
        severity: AlertSeverity.WARN,
        speed: 0,
        status: AlertStatus.NEW,
        time: '',
        type: AlertType.CONGESTION,
        camera: null,
    };
    const alertMessage = JSON.stringify(alert);
    socketServer.send(alertMessage);
    await waitForExpect(() => {
        const newAlert = screen.getByText('Test Road');
        expect(newAlert).toBeInTheDocument();
    });
    expect(numberOfWebsocketClients()).toEqual(1);
});

test('reconnect after disconnect', async () => {
    expect(numberOfWebsocketClients()).toEqual(0);
    render(<App />);
    const socket = await socketServer.connected;
    expect(numberOfWebsocketClients()).toEqual(1);
    socket.close();
    await waitForExpect(() => {
        expect(numberOfWebsocketClients()).toEqual(0);
    });
    await waitForExpect(() => {
        expect(numberOfWebsocketClients()).toEqual(1);
    });
});
