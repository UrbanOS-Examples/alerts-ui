import { Alert } from './App';
import { useEffect, useState } from 'react';
import './AlertCard.css';
import congestionIcon from './congestion_icon.png';
import cameraIcon from './videocam.png';
import { ReactComponent as ThumbUpIcon } from './thumbsup.svg';
import { ReactComponent as ThumbDownIcon } from './thumbsdown.svg';

interface AlertCardProps {
    alert: Alert;
}

const oneMinute = 60000;

enum FeedbackOption {
    CONGESTION = 'CONGESTION',
    NOT_CONGESTION = 'NOT_CONGESTION',
}

class Feedback {
    constructor(
        public readonly alertId: string,
        public readonly isCongestion: boolean,
    ) {}
}

export function AlertCard(props: AlertCardProps) {
    const [timeDifference, setTimeDifference] = useState(minutesSinceAlert());
    const [feedback, setFeedback] = useState<FeedbackOption | null>(null);

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

    function saveFeedback(providedFeedback: FeedbackOption): void {
        setFeedback(providedFeedback);
        const feedbackBoolean = providedFeedback === FeedbackOption.CONGESTION;
        const requestBody = new Feedback(props.alert.id, feedbackBoolean);
        const bodyAsString = JSON.stringify(requestBody);
        window
            .fetch(`${process.env.REACT_APP_FEEDBACK_URL}`, {
                method: 'POST',
                body: bodyAsString,
            })
            .catch((error) => {
                console.log(error);
            });
    }

    function styleForPositiveFeedback() {
        return feedback === FeedbackOption.CONGESTION
            ? 'AlertCard-providedFeedback'
            : '';
    }

    function styleForNegativeFeedback() {
        return feedback === FeedbackOption.NOT_CONGESTION
            ? 'AlertCard-providedFeedback'
            : '';
    }

    return (
        <div className="AlertCard">
            <div className="AlertCard-leftBar" />
            <div className="AlertCard-interior">
                <div className="AlertCard-content">
                    <img
                        className="AlertCard-congestionIcon"
                        data-testid="congestionIcon"
                        src={congestionIcon}
                        alt=""
                    />
                    <div className="AlertCard-details">
                        <div
                            className="AlertCard-roadName"
                            data-testid="roadName"
                        >
                            {formatToTitleCase(props.alert.roadName)}
                        </div>
                        {props.alert.camera && (
                            <div
                                className="AlertCard-camera"
                                data-testid="camera"
                            >
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
                <div className="AlertCard-feedback" data-testid="feedback">
                    <div
                        className="AlertCard-feedbackText AlertCard-smallFont"
                        data-testid="feedbackText"
                    >
                        Was this congestion?
                    </div>
                    <div
                        className={`AlertCard-thumbsUp AlertCard-button ${styleForPositiveFeedback()}`}
                        data-testid="thumbsUp"
                        onClick={() => saveFeedback(FeedbackOption.CONGESTION)}
                    >
                        <ThumbUpIcon />
                    </div>
                    <div
                        className={`AlertCard-thumbsDown AlertCard-button ${styleForNegativeFeedback()}`}
                        data-testid="thumbsDown"
                        onClick={() =>
                            saveFeedback(FeedbackOption.NOT_CONGESTION)
                        }
                    >
                        <ThumbDownIcon />
                    </div>
                </div>
            </div>
        </div>
    );
}
