import React, { useEffect } from "react";
import UserForm from "../components/UserForm";
import { useIsFocused } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { userLogout } from "../store/actions/user";
import UserProfile from "../components/UserProfile";
import axios from "axios";

export default function UserScreen(props) {
   const isFocused = useIsFocused();
   const dispatch = useDispatch();
   const { navigation } = props;
   const username = useSelector((state) => state.users.username);
   const onLogout = () => dispatch(userLogout());

   useEffect(() => {
      if (username) navigation.setOptions({ title: "Porfile" })
      else navigation.setOptions({ title: "Login / Register" })
   }, [username]);


   if (!username) return <UserForm isFocus={isFocused} navigation={navigation} />;
   return <UserProfile username={username} navigation={navigation} isFocus={isFocused} onLogout={onLogout} />;
}
