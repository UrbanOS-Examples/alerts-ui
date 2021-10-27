import {Alert} from "./App";
import {useEffect, useState} from "react";
import './AlertCard.css';

interface AlertCardProps {
    alert: Alert
}

const oneMinute = 60000;

export function AlertCard(props: AlertCardProps) {

    const [timeDifference, setTimeDifference] = useState(minutesSinceAlert());

    useEffect(() => {
      const interval = setInterval(() => {
        setTimeDifference(minutesSinceAlert())
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

    function formatRoadName(roadName: string): string {
        let formattedRoadName = '';
        roadName.split(' ')
          .forEach((part) => {
              const firstLetter = part.charAt(0).toUpperCase();
              const restOfWord = part.slice(1).toLowerCase();
              const formattedPart = firstLetter + restOfWord;
              formattedRoadName = formattedRoadName.concat(formattedPart).concat(' ');
          });
        return formattedRoadName.trimEnd();
    }

    return (
        <div className='AlertCard'>
          <div className='AlertCard-roadName' data-testid='roadName'>{formatRoadName(props.alert.roadName)}</div>
          <div className='AlertCard-time' data-testid='time'>{timeDifference}m ago</div>
        </div>
    );
}
