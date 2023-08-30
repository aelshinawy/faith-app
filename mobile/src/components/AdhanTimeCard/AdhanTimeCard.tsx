import React, { FC } from "react";
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

interface AdhanTimeCardProps {
  icon:
    | string
    | {
        src: string;
      };
  name: TimeName;
  time?: string;
}

const AdhanTimeCard: FC<AdhanTimeCardProps> = (props) => {
  return (
    <div className="adhan-time-card text-center">
      <IonCard
        className={"d-flex justify-content-between align-items-center p-3"}
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
