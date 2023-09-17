import "./TimeIndicator.css";
import { FC } from "react";

interface TimeIndicatorProps {
  name: string;
  status?: "past" | "current" | "upcoming";
  time?: string;
}

const TimeIndicator: FC<TimeIndicatorProps> = (props) => {
  return (
    <div className={`time-indicator d-flex align-items-center ${props.status}`}>
      <p className={"time-name mx-4 my-0"}>{props.name}</p>
      <div className={"hr"} />
      <p className={"time-start mx-4 my-0"}>{props.time}</p>
    </div>
  );
};

export default TimeIndicator;
