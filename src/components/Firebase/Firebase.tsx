import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import React, {useContext, useEffect, useState} from 'react';

const config = {
  apiKey: "AIzaSyDQXVgYUJJJdvGT4lvQvnf1Yq4zoAn_doo",
  authDomain: "doko-7fac9.firebaseapp.com",
  databaseURL: "https://doko-7fac9.firebaseio.com",
  projectId: "doko-7fac9",
  storageBucket: "doko-7fac9.appspot.com",
  messagingSenderId: "237996390753",
  appId: "1:237996390753:web:8aed52fe785d78d7912d20",
};

interface FirebaseApi {
  auth: app.auth.Auth;
  db: app.database.Database;
}

export function initFirebaseContext(): FirebaseApi {
  app.initializeApp(config);
  return {
    auth: app.auth(),
    db: app.database(),
  };
}

// @ts-ignore
export const firebaseContext = React.createContext<FirebaseApi>(null);

export function useCurrentUser() {
  const {auth} = useContext(firebaseContext);
  const [user, setUser] = useState<app.User | null>(auth.currentUser);
  useEffect(() => {
    setUser(auth.currentUser);
    return auth.onAuthStateChanged(setUser);
  }, [auth]);
  return user;
}
