import {render, screen} from "@testing-library/react";
import {AlertCard} from "./AlertCard";
import {Alert, AlertSeverity, AlertStatus, AlertType} from "./App";
import SpyInstance = jest.SpyInstance;
import {act} from "react-dom/test-utils";

const oneMinute = 60000;
const alert: Alert = {
  id: '1234-alert',
  roadName: 'SWALLOW RD',
  time: '2021-10-05T19:46:00.231343Z',
  type: AlertType.CONGESTION,
  severity: AlertSeverity.WARN,
  coordinates: {
    latitude: -20,
    longitude: 45
  },
  status: AlertStatus.NEW,
  speed: 6,
  avgSpeed: 50,
  refSpeed: 65
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
    render(<AlertCard alert={alert}/>);
    const roadName = screen.getByTestId('roadName');
    expect(roadName.textContent).toEqual('Swallow Rd');
});

test('shows time since alert was issued', () => {
  const twoMinutesLater = '2021-10-05T19:48:00.231343Z';
  controlTime(twoMinutesLater);
  render(<AlertCard alert={alert}/>);
  const timeSince = screen.getByTestId('time')
  expect(timeSince.textContent).toEqual('2m ago');
});

test('rounds down to nearest minute', () => {
  const threeMinutesThirtySecondsLater = '2021-10-05T19:49:30.231343Z';
  controlTime(threeMinutesThirtySecondsLater);
  render(<AlertCard alert={alert}/>);
  const timeSince = screen.getByTestId('time')
  expect(timeSince.textContent).toEqual('3m ago');
});

test('updates elapsed time every minute', () => {
  const fourMinutesLater = '2021-10-05T19:50:00.231343Z';
  controlTime(fourMinutesLater);
  render(<AlertCard alert={alert}/>);
  const timeSince = screen.getByTestId('time');
  expect(timeSince.textContent).toEqual('4m ago');
  const fiveMinutesLater = '2021-10-05T19:51:00.231343Z';
  controlTime(fiveMinutesLater);

  act(() => {jest.advanceTimersByTime(oneMinute)});

  const newTimeSince = screen.getByTestId('time');
  expect(newTimeSince.textContent).toEqual('5m ago');
});

test('shows congestion icon', () => {
    render(<AlertCard alert={alert}/>);
    const icon = screen.getByTestId('icon');
    expect(icon).toBeInTheDocument();
});
