import React, { useEffect } from "react";
import { SafeAreaView, StyleSheet, View, Image, Platform, TouchableNativeFeedback, TouchableOpacity, ScrollView } from "react-native";
import { useState } from "react";
import axios from "axios";
import ErrorMessage from "../components/ErrorMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import { Feather } from "@expo/vector-icons";
import { Button } from "react-native-paper";
import InfoField from "../components/InfoField";

export default function UserScreen(props) {
   const { username, navigation, isFocus } = props;
   const [user, setUser] = useState(null);
   const [error, setError] = useState(null);
   const TouchableComp = Platform.OS === "android" && Platform.Version >= 23 ? TouchableNativeFeedback : TouchableOpacity;

   const goToEditPage = () => navigation.navigate("EditUser", { user });
   const goToEditPic = () => navigation.navigate("EditProfilePic", { username: user.username, image: user.profilePictureUrl });

   const fetchProfile = async () => {
      setError(null);
      try {
         const res = await axios.get(`/api/users/${username}`);
         setUser(res.data);
      } catch (e) {
         let message = e.response ? e.response.data.error : e.message;
         if(!message) message = "Something went wrong";
         setError(message);
      }
   };

   useEffect(() => {
      if (username && isFocus) fetchProfile();
   }, [username, isFocus]);

   useEffect(() => {
      navigation.setOptions({
         headerRight: () => (
            <TouchableComp activeOpacity={0.6} onPress={goToEditPage}>
               <Feather name='edit' size={22} color='black' style={{ marginRight: 15 }} />
            </TouchableComp>
         ),
      });
      return () => navigation.setOptions({ headerRight: null });
   }, [user]);

   if (error) return <ErrorMessage navigation={navigation} error={error} retry={fetchProfile} />;

   return (
      <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
         <SafeAreaView style={styles.screen}>
            <View style={styles.imageContainer}>
               <Image source={{ uri: user ? user.profilePictureUrl : null }} style={styles.image} />
            </View>
            {user ? (
               <View>
                  <Button labelStyle={styles.imageButton} onPress={goToEditPic}>
                     Change
                  </Button>
               </View>
            ) : null}
            <View style={styles.field}>
               <InfoField iconName='account-circle-outline' content={user ? user.username : null} style={{ ...styles.username }} />
               <InfoField iconName='email-outline' content={user ? user.email : null} />
               <InfoField iconName='cellphone' content={user ? user.phone : null} />
               {user && (
                  <View style={styles.logoutContainer}>
                     <Button onPress={props.onLogout}>Logout</Button>
                  </View>
               )}
            </View>
         </SafeAreaView>
      </ScrollView>
   );
}

const styles = StyleSheet.create({
   screen: {
      justifyContent: "center",
      alignItems: "center",
   },
   imageContainer: {
      marginTop: 25,
      width: 150,
      height: 150,
      borderWidth: 3,
      borderRadius: 75,
      overflow: "hidden",
   },
   image: {
      width: "100%",
      height: "100%",
   },
   field: {
      width: "60%",
   },
   username: {
      textAlign: "center",
      fontSize: 20,
      marginVertical: 8,
      fontWeight: "bold",
   },
   imageButton: {
      fontSize: 12,
      opacity: 0.5,
   },
   logoutContainer: {
      marginTop: 30,
   },
   labelText: {
      fontSize: 20,
   },
});
