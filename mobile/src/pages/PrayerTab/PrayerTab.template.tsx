import React, { FC } from "react";
import { IonContent, IonPage } from "@ionic/react";
import { nextTime, TimeName } from "../../utils/PrayerTimeCalculator";
import AdhanTimeCard from "../../components/AdhanTimeCard/AdhanTimeCard";
import { useAtom } from "jotai/react";
import currentDateTimeAtom, {
  currentTimeNameAtom,
  prayerTimesAtom,
} from "../../atoms/time";
import { timeFormatAtom } from "../../atoms/userOptions";
import { formattedTimeToDate, timeRemaining } from "../../utils/time";
import TimeIndicator from "../../components/TimeIndicator/TimeIndicator";

interface PrayerTabTemplateProps {
  prayerTimes?: Record<TimeName, string>;
  onNextDay: () => void;
  onPrevDay: () => void;
  timeStatus: Partial<Record<TimeName, "past" | "current" | "upcoming">>;
}

const PrayerTabTemplate: FC<PrayerTabTemplateProps> = (props) => {
  const [dateTime] = useAtom(currentDateTimeAtom);
  const [timeFormat] = useAtom(timeFormatAtom);
  const [currentTimeName] = useAtom(currentTimeNameAtom);
  const [prayerTimes] = useAtom(prayerTimesAtom);

  console.log("current time name: ", currentTimeName);
  console.log("next time name: ", nextTime[currentTimeName]);
  console.log("time of next time: ", prayerTimes[nextTime[currentTimeName]]);

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="ms-3 header">
          <h1 className={"fw-bold display-2 text-capitalize"}>
            {currentTimeName}
          </h1>
          <h2 className={"mt-0 time-remaining"}>
            {prayerTimes[nextTime[currentTimeName]] !== ""
              ? timeRemaining(
                  dateTime,
                  formattedTimeToDate(prayerTimes[nextTime[currentTimeName]])
                )
              : null}
          </h2>
        </div>
        <div className={"overflow-hidden"}>
          <div>
            <AdhanTimeCard
              name={"fajr"}
              time={props.prayerTimes?.fajr}
              status={props.timeStatus.fajr}
            />
            <TimeIndicator
              name={"sunrise"}
              status={props.timeStatus.sunrise}
              time={props.prayerTimes?.sunrise}
            />
            <AdhanTimeCard
              name={"dhuhr"}
              time={props.prayerTimes?.dhuhr}
              status={props.timeStatus.dhuhr}
            />
            <AdhanTimeCard
              name={"asr"}
              time={props.prayerTimes?.asr}
              status={props.timeStatus.asr}
            />
            <AdhanTimeCard
              name={"maghrib"}
              time={props.prayerTimes?.maghrib}
              status={props.timeStatus.maghrib}
            />
            <AdhanTimeCard
              name={"isha"}
              time={props.prayerTimes?.isha}
              status={props.timeStatus.isha}
            />
            <TimeIndicator
              name={"midnight"}
              time={prayerTimes.midnight}
              status={props.timeStatus.midnight}
            />
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default PrayerTabTemplate;
