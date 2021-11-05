import React from 'react';
import { render, screen } from '@testing-library/react';
import App, { Alert, AlertSeverity, AlertStatus, AlertType } from './App';
import WS from 'jest-websocket-mock';
import waitForExpect from 'wait-for-expect';
import SpyInstance = jest.SpyInstance;

let fakeConsole: SpyInstance;
let socketServer: WS;

beforeEach(() => {
    fakeConsole = jest.spyOn(console, 'log').mockImplementation();
    const url: string = `${process.env.REACT_APP_ALERTS_URL}`;
    socketServer = new WS(url);
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

test('connects to alert stream on startup', () => {
    render(<App />);
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
    });
});

test('logs when new alert is received', async () => {
    render(<App />);
    const alert: Alert = {
        avgSpeed: 0,
        coordinates: { latitude: 0, longitude: 0 },
        id: '1234-alert',
        refSpeed: 0,
        roadName: '',
        severity: AlertSeverity.WARN,
        speed: 0,
        status: AlertStatus.NEW,
        time: '',
        type: AlertType.CONGESTION,
    };
    const alertMessage = JSON.stringify(alert);
    socketServer.send(alertMessage);
    await waitForExpect(() => {
        expect(fakeConsole).toHaveBeenCalledWith(alertMessage);
    });
});

test('adds new alerts to current set', async () => {
    render(<App />);
    const alert: Alert = {
        avgSpeed: 0,
        coordinates: { latitude: 0, longitude: 0 },
        id: '1234-alert',
        refSpeed: 0,
        roadName: 'Test Road',
        severity: AlertSeverity.WARN,
        speed: 0,
        status: AlertStatus.NEW,
        time: '',
        type: AlertType.CONGESTION,
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
        id: '1234-alert',
        refSpeed: 0,
        roadName: 'Test Road',
        severity: AlertSeverity.WARN,
        speed: 0,
        status: AlertStatus.NEW,
        time: '',
        type: AlertType.CONGESTION,
    };
    const alertMessage = JSON.stringify(alert);
    socketServer.send(alertMessage);
    await waitForExpect(() => {
        const newAlert = screen.getByText('Test Road');
        expect(newAlert).toBeInTheDocument();
    });
    expect(numberOfWebsocketClients()).toEqual(1);
});
