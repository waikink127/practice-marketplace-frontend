import React, { useState, useCallback } from "react";
import { NavigationContainer } from "@react-navigation/native";
import BottomTabNavigation from "../navigation/BottomTabNavigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { useEffect } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import { useDispatch } from "react-redux";
import { saveUser } from "../store/actions/user";
import axiosSetting from "../utils/axios";

export default function LandingScreen() {
   const [start, setStart] = useState(false);
   const dispatch = useDispatch();

   const getUserInfo = useCallback(async () => {
      axiosSetting();
      try {
         const token = await AsyncStorage.getItem("authToken");
         if (!token) setStart(true);
         else{
            const decoded = jwt_decode(token);
            axios.defaults.headers.common["Authorization"] = token;
            const username = decoded.sub;
            dispatch(saveUser(username));
            setStart(true);
         }
      } catch (e) {
         setStart(true);
      }
   });

   useEffect(() => {
      getUserInfo()
   } , []);

   if (!start) return <LoadingSpinner />;

   return (
      <NavigationContainer>
         <BottomTabNavigation />
      </NavigationContainer>
   );
}
