import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useState } from "react";
import { Link, Redirect, RouteComponentProps } from "react-router-dom";
import "./form.css";

const Login:React.FC<RouteComponentProps> = ({match, location, history}) => {
  const [goHome, setGoHome] = useState<boolean>(false);

  //TODO: Monitor state and Carry out Validation
  const [emailInput, setEmailInput] = useState();
  const [passwordInput, setPasswordInput] = useState();

  const [emailIsValid, setEmailIsValid] = useState<boolean>();
  const [passwordIsValid, setPasswordIsValid] = useState<boolean>();

  const onLogin = () => {
    //TODO: Send login 'POST' request
    setGoHome(true);
  };

  return (
    <IonPage>
      {goHome && <Redirect to="/home" />}
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>  

      <IonContent fullscreen>
        <div className="form-container">
          <IonItem>
            <IonLabel position="stacked">E-mail</IonLabel>
            <IonInput placeholder="abc@example.xyz" />
          </IonItem>
          <IonItem
            counter={true}
          >
            <IonLabel position="stacked">Password</IonLabel>
            <IonInput minlength={8} type="password" placeholder="********" />
          </IonItem>
          <div className="d-flex justify-content-center">
            <IonButton fill="clear" color="medium" onClick={onLogin}>
              Login
            </IonButton>
          </div>
          <div className="d-flex justify-content-center">
            <div className="text-center">
              Don't have an account?
              <br />
              <Link className="text-decoration-none" to="/register">
                Register
              </Link>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
