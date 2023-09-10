import React, { FC } from "react";
import { IonContent, IonPage } from "@ionic/react";
import { TimeName } from "../../utils/PrayerTimeCalculator";
import AdhanTimeCard from "../../components/AdhanTimeCard/AdhanTimeCard";
import { useAtom } from "jotai/react";
import currentDateTimeAtom from "../../atoms/currentDateTime";
import { hrMinFormat } from "../../utils/time";
import { timeFormatAtom } from "../../atoms/userOptions";

interface PrayerTabTemplateProps {
  prayerTimes?: Record<TimeName, string>;
  onNextDay: () => void;
  onPrevDay: () => void;
}

const PrayerTabTemplate: FC<PrayerTabTemplateProps> = (props) => {
  const [dateTime] = useAtom(currentDateTimeAtom);
  const [timeFormat] = useAtom(timeFormatAtom);

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="header">
          <h1 className={"ms-3 display-3"}>
            {hrMinFormat(dateTime, timeFormat)}
          </h1>
        </div>
        <div className={"overflow-hidden"}>
          <div>
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
