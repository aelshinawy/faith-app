import React, { useEffect, useState } from "react";
import "./PrayerTab.css";
import PrayerTabTemplate from "./PrayerTab.template";
import prayerTimesCalculator, {
  TimeName,
} from "../../calculations/PrayerTimeCalculator";
import { Geolocation as geolocation } from "@capacitor/geolocation";
import { PermissionState } from "@capacitor/core";

const PrayerTab: React.FC = () => {
  const [prayerTimes, setPrayerTimes] = useState<Record<TimeName, string>>();

  const updatePrayerTimes = (locationPermission: PermissionState) => {
    const date = new Date();
    const coords: number[] = [];

    if (locationPermission !== "denied") {
      geolocation
        .getCurrentPosition({ enableHighAccuracy: true })
        .then((pos) => {
          const timezone = -date.getTimezoneOffset() / 60;
          coords.push(pos.coords.latitude, pos.coords.longitude);
          setPrayerTimes(
            prayerTimesCalculator.getTimes(date, coords, timezone)
          );
        });
    }
  };

  useEffect(() => {
    geolocation.checkPermissions().then((status) => {
      if (status.coarseLocation !== "granted") {
        geolocation.requestPermissions().then((status) => {
          updatePrayerTimes(status.coarseLocation);
        });
      } else {
        updatePrayerTimes(status.coarseLocation);
      }
    });
  }, []);

  return <PrayerTabTemplate prayerTimes={prayerTimes} />;
};

export default PrayerTab;
