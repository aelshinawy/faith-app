import { IonContent, IonHeader, IonIcon, IonLabel, IonPage, IonRoute, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, IonText, IonTitle, IonToolbar, RouteInfo, useIonRouter } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { History, Location } from 'history';
import { moonSharp, settingsSharp } from 'ionicons/icons';
import { useCallback, useMemo } from 'react';
import { match, Redirect, Route, RouteComponentProps } from 'react-router';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';
import PageNotFound from './PageNotFound';
import PrayerPage from './PrayerPage';
import Settings from './Settings';



const Home: React.FC<RouteComponentProps> = ({match, history}) => {
  return (
    <IonPage>
    {/* //   <IonHeader>
    //     <IonToolbar>
    //       <IonTitle>This is a title</IonTitle>
    //     </IonToolbar>
    //   </IonHeader>

    //   <IonContent fullscreen>
    //     <IonHeader collapse="condense">
    //       <IonToolbar>
    //         <IonTitle size="large">Blank</IonTitle>
    //       </IonToolbar>
    //     </IonHeader>
    //     <ExploreContainer />
    //   </IonContent> */}
      <IonTabs>
        <IonRouterOutlet>
          <Route 
            exact
            path={`${match.url}/prayer`}
            component={PrayerPage}
          />
          <Route 
            exact
            path={`${match.url}/settings`}
            component={Settings}
          />
          <Route
            exact
            path={`${match.url}`}
            render={() => <Redirect to={`${match.url}/prayer`}/>}
          />
          <Route component={PageNotFound}></Route>
        </IonRouterOutlet>
        <IonTabBar slot='bottom'>
          <IonTabButton
            tab='prayer'
            href={`${match.url}/prayer`}
          >
            <IonIcon icon={moonSharp} ></IonIcon>
            <IonLabel>Prayer</IonLabel>
          </IonTabButton>
          <IonTabButton
            tab='settings'
            href={`${match.url}/settings`}
          >
            <IonIcon icon={settingsSharp} />
            <IonLabel>Settings</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonPage>
  );
};

export default Home;
