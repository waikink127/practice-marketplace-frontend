
import React from "react";
import { Provider } from "react-redux";
import store from "./store";
import axiosSetting from "./utils/axios";
import LandingScreen from "./screens/LandingScreen";


axiosSetting();

export default function App() {
   return (
      <Provider store={store}>
         <LandingScreen />
      </Provider>
   );
}
