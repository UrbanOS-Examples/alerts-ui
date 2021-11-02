import { Alert } from './App';
import { useEffect, useState } from 'react';
import './AlertCard.css';
import congestionIcon from './congestion_icon.png';
import cameraIcon from './videocam.png';

interface AlertCardProps {
    alert: Alert;
}

const oneMinute = 60000;

export function AlertCard(props: AlertCardProps) {
    const [timeDifference, setTimeDifference] = useState(minutesSinceAlert());

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeDifference(minutesSinceAlert());
        }, oneMinute);

        return () => clearInterval(interval);
    });

    function minutesSinceAlert(): number {
        const alertTime = new Date(props.alert.time).getTime();
        const currentTime = Date.now();
        const millisecondDifference = currentTime - alertTime;
        const minutesDifference = millisecondDifference / oneMinute;
        return Math.trunc(minutesDifference);
    }

    function formatToTitleCase(phrase: string): string {
        let formattedPhrase = '';
        phrase.split(' ').forEach((part) => {
            const firstLetter = part.charAt(0).toUpperCase();
            const restOfWord = part.slice(1).toLowerCase();
            const formattedPart = firstLetter + restOfWord;
            formattedPhrase = formattedPhrase.concat(formattedPart).concat(' ');
        });
        return formattedPhrase.trimEnd();
    }

    return (
        <div className="AlertCard">
            <div className="AlertCard-leftBar" />
            <div className="AlertCard-content">
                <img
                    className="AlertCard-congestionIcon"
                    data-testid="congestionIcon"
                    src={congestionIcon}
                    alt=""
                />
                <div className="AlertCard-details">
                    <div className="AlertCard-roadName" data-testid="roadName">
                        {formatToTitleCase(props.alert.roadName)}
                    </div>
                    {props.alert.camera && (
                        <div className="AlertCard-camera" data-testid="camera">
                            <img
                                className="AlertCard-cameraIcon"
                                data-testid="cameraIcon"
                                src={cameraIcon}
                                alt="Camera available"
                            />
                            <span className="AlertCard-cameraText AlertCard-smallFont">
                                {formatToTitleCase(props.alert.camera.name)}
                            </span>
                        </div>
                    )}
                </div>
                <div
                    className="AlertCard-time AlertCard-smallFont"
                    data-testid="time"
                >
                    {timeDifference}m ago
                </div>
            </div>
        </div>
    );
}
