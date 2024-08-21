import React, { createContext } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/index/index.module.scss";
import "./styles/adapt/adapt.scss";
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDzbrPf2V649itFNGzK85Sw7cLNbhz-DaI",
  authDomain: "finance-bea5d.firebaseapp.com",
  projectId: "finance-bea5d",
  storageBucket: "finance-bea5d.appspot.com",
  messagingSenderId: "998646537883",
  appId: "1:998646537883:web:147235723c4d7e694df03e",
};

const Context = createContext(null);
export default Context;
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getStorage(app);
export const db = getFirestore(app);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Context.Provider
      value={{
        firebaseConfig,
        auth,
        firestore,
      }}
    >
      <App />
    </Context.Provider>
  </React.StrictMode>
);
