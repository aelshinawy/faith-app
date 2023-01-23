import { Redirect, Route, RouteComponentProps } from 'react-router-dom';
import { IonApp, IonRouterOutlet, IonTabs, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import './App.css';
import Login from './pages/Login';
import { createContext, useContext, useState } from 'react';
import PageNotFound from './pages/PageNotFound';

setupIonicReact();
const userContext = createContext(null);

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState();

  return(
    <IonApp>
      <IonReactRouter>
          <IonRouterOutlet>
            <Route 
              path="/home" 
              render={(routeContext:RouteComponentProps) => <Home {...routeContext}/>} 
            />
            <Route 
              exact 
              path="/login" 
              render={(routeContext:RouteComponentProps) => <Login {...routeContext}/>}
            />
            <Route exact path="/" render={() => <Redirect to="/login" />}/>
            <Route component={PageNotFound}/>
          </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  )
};

export default App;
