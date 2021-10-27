import React from 'react';
import {render, screen} from '@testing-library/react';
import App, {Alert, AlertSeverity, AlertStatus, AlertType} from './App';
import {WS} from 'jest-websocket-mock';
import {act} from "react-dom/test-utils";
import waitForExpect from "wait-for-expect";

let socketServer: WS;

beforeEach(() => socketServer = new WS('wss://alerts-api.staging.internal.smartcolumbusos.com'));
afterEach(() => socketServer.close());

test('renders dashboard title', () => {
  render(<App />);
  const linkElement = screen.getByText(/Smart Traffic/i);
  expect(linkElement).toBeInTheDocument();
});

test('displays alert', () => {
  render(<App/>);
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
    time: '2021-10-05T19:46:00.231343Z',
    type: AlertType.CONGESTION

  }
  const alertJson = JSON.stringify(alert);
  act(() => socketServer.send(alertJson));
  waitForExpect(() => {
    const alerts = screen.getByTestId('alerts');
    expect(alerts.textContent).toContain(alert.roadName);
  });
});
