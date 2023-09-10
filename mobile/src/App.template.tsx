import React from "react";
import {
  IonApp,
  IonIcon,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";
import PrayerTab from "./pages/PrayerTab/PrayerTab";
import Tab2 from "./pages/Tab2";
import SettingsTab from "./pages/SettingsTab/SettingsTab";
import prayerMat from "./assets/icons/prayermat.svg";
import { book, settings } from "ionicons/icons";

const AppTemplate: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/prayer">
            <PrayerTab />
          </Route>
          <Route exact path="/tab2">
            <Tab2 />
          </Route>
          <Route path="/settings">
            <SettingsTab />
          </Route>
          <Route exact path="/">
            <Redirect to="/prayer" />
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="prayer-tab" href="/prayer">
            <IonIcon aria-hidden="true" src={prayerMat} />
          </IonTabButton>
          <IonTabButton tab="tab2" href="/tab2">
            <IonIcon aria-hidden="true" icon={book} />
          </IonTabButton>
          <IonTabButton tab="tab3" href="/settings">
            <IonIcon aria-hidden="true" icon={settings} />
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default AppTemplate;
