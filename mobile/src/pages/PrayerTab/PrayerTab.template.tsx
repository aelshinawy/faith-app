import React, { FC } from "react";
import { IonContent, IonPage } from "@ionic/react";
import { TimeName } from "../../utils/PrayerTimeCalculator";
import AdhanTimeCard from "../../components/AdhanTimeCard/AdhanTimeCard";

interface PrayerTabTemplateProps {
  prayerTimes?: Record<TimeName, string>;
  onNextDay: () => void;
  onPrevDay: () => void;
}

const PrayerTabTemplate: FC<PrayerTabTemplateProps> = (props) => {
  return (
    <IonPage>
      {/*<IonHeader>*/}
      {/*  <IonToolbar>*/}
      {/*    <IonTitle>Prayer</IonTitle>*/}
      {/*  </IonToolbar>*/}
      {/*</IonHeader>*/}
      <IonContent fullscreen>
        <div className={"overflow-hidden"}>
          <div className="">
            <AdhanTimeCard
              name={"fajr"}
              time={props.prayerTimes?.fajr}
              endTime={props.prayerTimes?.dhuhr}
            />
            <AdhanTimeCard
              name={"dhuhr"}
              time={props.prayerTimes?.dhuhr}
              endTime={props.prayerTimes?.asr}
            />
            <AdhanTimeCard
              name={"asr"}
              time={props.prayerTimes?.asr}
              endTime={props.prayerTimes?.maghrib}
            />
            <AdhanTimeCard
              name={"maghrib"}
              time={props.prayerTimes?.maghrib}
              endTime={props.prayerTimes?.isha}
            />
            <AdhanTimeCard
              name={"isha"}
              time={props.prayerTimes?.isha}
              endTime={props.prayerTimes?.midnight}
            />
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default PrayerTabTemplate;
