import { Alert, AlertSeverity, AlertStatus, AlertType } from './App';
import { render } from '@testing-library/react';
import { AlertPane } from './AlertPane';

const alert: Alert = {
    id: '1234-alert',
    location: 'SWALLOW RD',
    time: '2021-10-05T19:46:00.231343Z',
    type: AlertType.CONGESTION,
    severity: AlertSeverity.WARN,
    coordinates: {
        latitude: -20,
        longitude: 45,
    },
    status: AlertStatus.NEW,
    speed: 6,
    avgSpeed: 50,
    refSpeed: 65,
    camera: null,
};

const alert2: Alert = {
    id: '2345-alert',
    location: 'APPLE RD',
    time: '2020-10-05T19:46:00.231343Z',
    type: AlertType.CONGESTION,
    severity: AlertSeverity.WARN,
    coordinates: {
        latitude: -20,
        longitude: 45,
    },
    status: AlertStatus.NEW,
    speed: 6,
    avgSpeed: 50,
    refSpeed: 65,
    camera: null,
};

test('displays single alerts in pane', () => {
    const { container } = render(<AlertPane alerts={[alert]} />);
    expect(container.getElementsByClassName('AlertCard').length).toBe(1);
});

test('displays a list of alerts', () => {
    const { container } = render(<AlertPane alerts={[alert, alert2]} />);
    expect(container.getElementsByClassName('AlertCard').length).toBe(2);
});
