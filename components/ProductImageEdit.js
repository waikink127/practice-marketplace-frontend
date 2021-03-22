import React from "react";
import { Alert, StyleSheet, TouchableOpacity, Image, View, Dimensions } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { Entypo } from "@expo/vector-icons";


export default function ProductImageEdit(props) {
   const { image, setImage, setPicked } = props;

   const onChangeImage = async () => {
      const result = await Permissions.askAsync(Permissions.CAMERA, Permissions.MEDIA_LIBRARY);
      if (result.status !== "granted") {
         Alert.alert("No permissions", "You need to grant camera permission", [{ text: "Okay" }]);
         return;
      }
      Alert.alert("Select Image", "What do you want to use", [
         { text: "Camera", onPress: () => takeImageHandler() },
         { text: "Library", onPress: () => selectImageHandler() },
      ]);
   };

   const takeImageHandler = async () => {
      const img = await ImagePicker.launchCameraAsync({
         allowsEditing: true,
         aspect: [1, 1],
         quality: 0.3,
         mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });
      if (img.cancelled) return;
      setImage(img.uri);
      setPicked(true);
   };

   const selectImageHandler = async () => {
      const img = await ImagePicker.launchImageLibraryAsync({
         allowsEditing: true,
         aspect: [1, 1],
         quality: 0.3,
         mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });
      if (img.cancelled) return;
      setImage(img.uri);
      setPicked(true);
   };
   return (
      <TouchableOpacity style={styles.main} activeOpacity={0.6} onPress={onChangeImage}>
         {image ? 
            <Image source={{ uri: image }} style={styles.image} />
          : 
            <View style={styles.iconContainer}>
               <Entypo name='images' size={Dimensions.get("screen").width / 6} color='#ccc' />
            </View>
         }
      </TouchableOpacity>
   );
}

const styles = StyleSheet.create({
   main: {
      width: "80%",
      aspectRatio: 1,
      borderColor: "#ccc",
      borderWidth: 1,
      alignSelf: "center",
      marginTop: 15,
      borderRadius: 5,
      overflow: "hidden",
   },
   image: {
      width: "100%",
      aspectRatio: 1,
   },
   iconContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
   },
});
