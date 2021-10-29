import { AlertCard } from './AlertCard';
import { Alert } from './App';

interface AlertPaneProps {
    alerts: Alert[];
}

export function AlertPane(props: AlertPaneProps) {
    const listAlerts = props.alerts.map((alert) => (
        <AlertCard alert={alert} key={alert.id} />
    ));

    return <div className="AlertPane">{listAlerts}</div>;
}
