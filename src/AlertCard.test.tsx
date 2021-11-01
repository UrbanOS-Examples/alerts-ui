import { render, screen } from '@testing-library/react';
import { AlertCard } from './AlertCard';
import { Alert, AlertSeverity, AlertStatus, AlertType } from './App';
import { act } from 'react-dom/test-utils';
import SpyInstance = jest.SpyInstance;

const oneMinute = 60000;
const alert: Alert = {
    id: '1234-alert',
    roadName: 'SWALLOW RD',
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
};

let fakeNow: SpyInstance;

function controlTime(currentTime: string) {
    const now = new Date(currentTime).getTime();
    fakeNow.mockImplementation(() => now);
}

beforeEach(() => {
    jest.useFakeTimers();
    fakeNow = jest.spyOn(Date, 'now');
});

afterEach(() => {
    jest.useRealTimers();
    fakeNow.mockRestore();
});

test('displays road name with only first letters capitalized', () => {
    render(<AlertCard alert={alert} />);
    const roadName = screen.getByTestId('roadName');
    expect(roadName.textContent).toEqual('Swallow Rd');
});

test('shows time since alert was issued', () => {
    const twoMinutesLater = '2021-10-05T19:48:00.231343Z';
    controlTime(twoMinutesLater);
    render(<AlertCard alert={alert} />);
    const timeSince = screen.getByTestId('time');
    expect(timeSince.textContent).toEqual('2m ago');
});

test('rounds down to nearest minute', () => {
    const threeMinutesThirtySecondsLater = '2021-10-05T19:49:30.231343Z';
    controlTime(threeMinutesThirtySecondsLater);
    render(<AlertCard alert={alert} />);
    const timeSince = screen.getByTestId('time');
    expect(timeSince.textContent).toEqual('3m ago');
});

test('updates elapsed time every minute', () => {
    const fourMinutesLater = '2021-10-05T19:50:00.231343Z';
    controlTime(fourMinutesLater);
    render(<AlertCard alert={alert} />);
    const timeSince = screen.getByTestId('time');
    expect(timeSince.textContent).toEqual('4m ago');
    const fiveMinutesLater = '2021-10-05T19:51:00.231343Z';
    controlTime(fiveMinutesLater);

    act(() => {
        jest.advanceTimersByTime(oneMinute);
    });

    const newTimeSince = screen.getByTestId('time');
    expect(newTimeSince.textContent).toEqual('5m ago');
});

test('shows congestion icon', () => {
    render(<AlertCard alert={alert} />);
    const icon = screen.getByTestId('congestionIcon');
    expect(icon).toBeInTheDocument();
});

test('shows no camera when nothing available', () => {
    let { container } = render(<AlertCard alert={alert} />);
    const camera = container.getElementsByClassName('camera');
    expect(camera.length).toEqual(0);
});

test('shows camera location when one is available', () => {
    const alertWithCamera: Alert = {
        avgSpeed: 60,
        camera: {
            name: 'CRANE CT @ BIRD LN',
            distance: 0.1,
        },
        coordinates: {
            latitude: -20,
            longitude: 29,
        },
        id: '0000-camera-alert',
        refSpeed: 60,
        roadName: 'CRANE COURT',
        severity: AlertSeverity.WARN,
        speed: 0,
        status: AlertStatus.NEW,
        time: '2021-10-05T19:46:00.231343Z',
        type: AlertType.CONGESTION,
    };
    render(<AlertCard alert={alertWithCamera} />);
    const cameraIcon = screen.getByTestId('cameraIcon');
    expect(cameraIcon).toBeInTheDocument();
    const camera = screen.getByTestId('camera');
    expect(camera.textContent).toEqual('Crane Ct @ Bird Ln');
});
