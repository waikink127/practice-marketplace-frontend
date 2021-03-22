import React, { useState, useEffect } from "react";
import { StyleSheet, SafeAreaView, View, Image, Dimensions, Alert } from "react-native";
import { Button, IconButton } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import axios from "axios";
import {useDispatch} from 'react-redux';
import { editProfilePic } from "../store/actions/user";

export default function EditProfilePicScreen(props) {
   const { route, navigation } = props;
   const dispatch = useDispatch();
   const { image, username } = route.params;
   const [pickedImage, setPickedImage] = useState(image);
   const [picked, setPicked] = useState(false);
   const [error, setError] = useState(null);
   const [loading, setLoading] = useState(false);

   const permissionVerify = async () => {
      const result = await Permissions.askAsync(Permissions.CAMERA, Permissions.MEDIA_LIBRARY);
      if (result.status !== "granted") {
         Alert.alert("No permissions", "You need to grant camera permission", [{ text: "Okay" }]);
         return false;
      }
      return true;
   };

   const takeImageHandler = async () => {
      const hasPermissions = await permissionVerify();
      if (!hasPermissions) return;
      const img = await ImagePicker.launchCameraAsync({
         allowsEditing: true,
         aspect: [1, 1],
         quality: 0.2,
         mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });
      if (img.cancelled) return;
      setPickedImage(img.uri);
      setPicked(true);
   };

   const selectImageHandler = async () => {
      const hasPermissions = await permissionVerify();
      if (!hasPermissions) return;
      const img = await ImagePicker.launchImageLibraryAsync({
         allowsEditing: true,
         aspect: [1, 1],
         quality: 0.2,
         mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });
      if (img.cancelled) return;
      setPickedImage(img.uri);
      setPicked(true);
   };

   const onSubmitPicture = async () => {
      if (!picked) return;
      setLoading(true);
      try{
         await dispatch(editProfilePic(pickedImage, username, navigation));
         navigation.navigate("User");
      } catch (e){
         setError(e.message);
         console.log(e);
         setLoading(false);
      }
   };

   useEffect(() => {
      if(error) Alert.alert("Error: Please retry to submit", error, [{ text: "OK", onPress: () => setError(null)}]);
   }, [error]);

   return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
         <SafeAreaView style={styles.screen}>
            <View style={styles.imageContainer}>
               <Image source={{ uri: pickedImage }} style={styles.image} />
            </View>
            <View style={styles.buttonContainer}>
               <IconButton icon='camera' size={30} onPress={takeImageHandler} />
               <IconButton icon='folder-image' size={30} onPress={selectImageHandler} />
            </View>
            <View style={styles.buttonContainer}>
               <Button disabled={!picked} loading={loading} onPress={onSubmitPicture}>
                  Change
               </Button>
            </View>
         </SafeAreaView>
      </View>
   );
}

const styles = StyleSheet.create({
   screen: {
      justifyContent: "center",
      alignItems: "center",
   },
   imageContainer: {
      marginTop: Dimensions.get("window").height * 0.15,
      height: Dimensions.get("window").width * 0.8,
      width: "80%",
      borderWidth: 3,
      borderRadius: (Dimensions.get("window").width * 0.8) / 2,
      overflow: "hidden",
   },
   image: {
      width: "100%",
      height: "100%",
   },
   buttonContainer: {
      flexDirection: "row",
      marginTop: 50,
      width: "60%",
      justifyContent: "space-around",
   },
});
