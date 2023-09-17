import React, { FC } from "react";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
} from "@ionic/react";
import { TimeName } from "../../utils/PrayerTimeCalculator";
import "./AdhanTimeCard.css";
import { useAtom } from "jotai/react";
import currentDateTimeAtom from "../../atoms/time";

interface AdhanTimeCardProps {
  name: TimeName;
  status?: string;
  time?: string;
  endTime?: string;
}

const AdhanTimeCard: FC<AdhanTimeCardProps> = (props) => {
  const [dateTime] = useAtom(currentDateTimeAtom);

  return (
    <div className="adhan-time-card-container text-center">
      <IonCard
        className={
          "adhan-time-card d-flex justify-content-between" +
          `  align-items-center p-3 ${props.status}`
        }
      >
        <IonCardHeader className={"d-flex text-capitalize flex-row gap-1 p-0"}>
          <IonCardTitle>{props.name}</IonCardTitle>
        </IonCardHeader>

        <IonCardContent className={"p-0"}>{props.time}</IonCardContent>
      </IonCard>
    </div>
  );
};

export default AdhanTimeCard;
