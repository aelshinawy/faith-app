import React, { useEffect, useRef } from "react";
import { setupIonicReact } from "@ionic/react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min"; /* Bootstrap imports */
import "@ionic/react/css/core.css"; /* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css"; /* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css"; /* Theme variables */
import "./theme/variables.css";
import AppTemplate from "./App.template";
import { useAtom } from "jotai/react";
import { updateDateTimeAtom } from "./atoms/time";
import { minsToMs, nextPerfectMin } from "./utils/time";

setupIonicReact();

const App: React.FC = () => {
  const [, updateDateTime] = useAtom(updateDateTimeAtom);
  const timeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (timeout.current === undefined) {
      const timeTillNextMin = nextPerfectMin().valueOf() - new Date().valueOf();
      console.log(`setting timeout for ${timeTillNextMin}ms`);
      timeout.current = setTimeout(() => {
        setInterval(updateDateTime, minsToMs(1));
        updateDateTime();
      }, timeTillNextMin);
    }
    window.onfocus = (e) => {
      updateDateTime();
    };
  }, []);

  return <AppTemplate />;
};

export default App;
