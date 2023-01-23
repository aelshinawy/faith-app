import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonText, IonTitle, IonToolbar } from "@ionic/react";
import { useLocation } from "react-router";

export default function PageNotFound(){
    const location = useLocation();

    return(
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton/>
                    </IonButtons>
                    <IonTitle>404 - Page not found</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonBackButton />
                <div className="container">
                    <IonText>couldn't find a page at <em className="color-medium">"{location.pathname}"</em></IonText>
                </div>
            </IonContent>
        </IonPage>
    )
}