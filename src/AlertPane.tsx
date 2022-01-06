import { AlertCard } from './AlertCard';
import { Alert } from './App';

interface AlertPaneProps {
    alerts: Alert[];
    goToFunc: any;
}

export function AlertPane(props: AlertPaneProps) {
    const listAlerts = props.alerts.map((alert) => (
        <button
        className="AlertButton"
        onClick={ () => props.goToFunc(alert.coordinates.latitude, alert.coordinates.longitude)}
        >
            <AlertCard alert={alert} key={alert.id} />
        </button>
       
    ));

    const numberOfAlerts = props.alerts.length;

    return <div className="AlertPane">
                <div className="AlertPaneTitle">
                     <pre> Alerts ({numberOfAlerts}) </pre>
                </div>
                <div className ="AlertsInAlertPane">
                    {listAlerts}
                </div>
            </div>;
}
