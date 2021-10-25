import {Alert} from "./App";
import {useEffect, useState} from "react";

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

    return (
        <div>
          <div className='roadName' data-testid='roadName'>{props.alert.roadName}</div>
          <div className='time' data-testid='time'>{timeDifference}m ago</div>
        </div>
    );
}
