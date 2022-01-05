import { AlertCard } from './AlertCard';
import { Alert } from './App';

interface AlertPaneProps {
    alerts: Alert[];
}

export function AlertPane(props: AlertPaneProps) {
    const listAlerts = props.alerts.map((alert) => (
        <AlertCard alert={alert} key={alert.id} />
    ));

    const numberOfAlerts = props.alerts.length;

    return <div className="AlertPane">
                <div className="AlertPaneTitle">
                     <pre> Alerts ({numberOfAlerts}) </pre>
                </div>
                {listAlerts}
            </div>;
}
