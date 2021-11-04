import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App, { Alert, AlertSeverity, AlertStatus, AlertType } from './App';
import { WS } from 'jest-websocket-mock';
import waitForExpect from 'wait-for-expect';
import { act } from 'react-dom/test-utils';
import SpyInstance = jest.SpyInstance;

let socketServer: WS;
let fakeConsole: SpyInstance;

beforeAll(() => {
    fakeConsole = jest.spyOn(console, 'log').mockImplementation();
    socketServer = new WS(`${process.env.ALERTS_URL}`);
});
afterAll(async () => {
    socketServer.server.clients().forEach((client) => client.close());
    await socketServer.closed;
    fakeConsole.mockRestore();
}, 30000);

test('renders dashboard title', () => {
    render(<App />);
    const linkElement = screen.getByText(/Smart Traffic/i);
    expect(linkElement).toBeInTheDocument();
});
//
// test.skip('displays alert', async () => {
//     console.log('Beginning test...');
//     render(<App />);
//     console.log('Waiting to connect to socket server...');
//     await act(async () => {
//         await socketServer.connected.then(() =>
//             console.log('Server got a connection!'),
//         );
//     });
//     const alert: Alert = {
//         avgSpeed: 60,
//         coordinates: {
//             latitude: -23,
//             longitude: -45,
//         },
//         id: '5678-alert',
//         refSpeed: 70,
//         roadName: 'TEST DRIVE',
//         severity: AlertSeverity.WARN,
//         speed: 0,
//         status: AlertStatus.NEW,
//         time: '2021-10-05T19:46:00.231343Z',
//         type: AlertType.CONGESTION,
//     };
//     const alertJson = JSON.stringify(alert);
//     console.log('Sending alert...');
//     act(() => socketServer.send(alertJson));
//     await waitFor(() => {
//         console.log('Waiting for expect...');
//         const alerts = screen.getByTestId('alerts');
//         expect(alerts.textContent).toContain(alert.roadName);
//     });
// });
//
// test('Renders alert pane', () => {
//     const { container } = render(<App />);
//     expect(container.getElementsByClassName('AlertPane').length).toBe(1);
// });
