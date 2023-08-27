import React, { useEffect, useState } from "react";
import "./PrayerTab.css";
import PrayerTabTemplate from "./PrayerTab.template";
import prayTimes from "../../calculations/PrayTimes";

const PrayerTab: React.FC = () => {
  const [prayerTimes, setPrayerTimes] = useState("dumb stuff");

  useEffect(() => {
    const date = new Date();
    const coords: number[] = [];
    navigator.geolocation.getCurrentPosition((pos) => {
      const timeZone = -date.getTimezoneOffset() / 60;
      coords.push(pos.coords.latitude, pos.coords.longitude);
      console.log("date: ", date);
      console.log("coords: ", coords);
      console.log("timeZone: ", timeZone);
      console.log(prayTimes.getTimes(date, coords, timeZone));
    });
  }, []);

  return <PrayerTabTemplate />;
};

export default PrayerTab;
