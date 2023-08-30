import React, { FC } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { TimeName } from "../../utils/PrayerTimeCalculator";
import AdhanTimeCard from "../../components/AdhanTimeCard/AdhanTimeCard";
import { megaphone } from "ionicons/icons";

interface PrayerTabTemplateProps {
  prayerTimes?: Record<TimeName, string>;
}

const PrayerTabTemplate: FC<PrayerTabTemplateProps> = (props) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Prayer</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className={"overflow-hidden"}>
          <div className="">
            <AdhanTimeCard
              icon={megaphone}
              name={"fajr"}
              time={props.prayerTimes?.fajr}
            />
            <AdhanTimeCard
              icon={megaphone}
              name={"dhuhr"}
              time={props.prayerTimes?.dhuhr}
            />
            <AdhanTimeCard
              icon={megaphone}
              name={"asr"}
              time={props.prayerTimes?.asr}
            />
            <AdhanTimeCard
              icon={megaphone}
              name={"maghrib"}
              time={props.prayerTimes?.maghrib}
            />
            <AdhanTimeCard
              icon={megaphone}
              name={"isha"}
              time={props.prayerTimes?.isha}
            />
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default PrayerTabTemplate;
