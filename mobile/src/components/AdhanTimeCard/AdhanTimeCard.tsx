import React, { FC, useMemo } from "react";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
} from "@ionic/react";
import { TimeName } from "../../utils/PrayerTimeCalculator";
import "./AdhanTimeCard.css";
import { compareDateToRange, formattedTimeToDate } from "../../utils/time";

interface AdhanTimeCardProps {
  icon:
    | string
    | {
        src: string;
      };
  name: TimeName;
  time?: string;
  endTime?: string;
}

const AdhanTimeCard: FC<AdhanTimeCardProps> = (props) => {
  const status = useMemo(() => {
    console.log(`%c${props.name}`, "font-size: 20pt;");

    if (!props.time || !props.endTime) return "na";
    const range = [
      formattedTimeToDate(props.time),
      formattedTimeToDate(props.endTime),
    ] as [Date, Date];
    switch (compareDateToRange(new Date(), range)) {
      case -1:
        return "upcoming";
      case 0:
        return "current";
      case 1:
        return "past";
      default:
        throw "weeee waaa weee waaa weee waa";
    }
  }, [props.time, props.endTime]);

  return (
    <div className="adhan-time-card-container text-center">
      <IonCard
        className={
          "adhan-time-card d-flex justify-content-between" +
          ` align-items-center p-3 ${status}`
        }
      >
        <IonCardHeader className={"d-flex flex-row gap-1 p-0"}>
          <IonCardTitle>
            <IonIcon
              icon={typeof props.icon === "string" ? props.icon : undefined}
              src={typeof props.icon === "object" ? props.icon.src : undefined}
            />
          </IonCardTitle>
          <IonCardSubtitle className={"name m-0"}>{props.name}</IonCardSubtitle>
        </IonCardHeader>

        <IonCardContent className={"p-0"}>{props.time}</IonCardContent>
      </IonCard>
    </div>
  );
};

export default AdhanTimeCard;
