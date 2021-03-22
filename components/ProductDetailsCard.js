import React from "react";
import { useState, useEffect } from "react";
import { ActivityIndicator, StyleSheet, TouchableOpacity, View, TouchableNativeFeedback, Platform } from "react-native";
import { Avatar, Button, Card, Title, Paragraph } from "react-native-paper";
import { useSelector } from "react-redux";
import { Entypo } from "@expo/vector-icons";
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

export default function ProductDetailsCard(props) {
   const { product, productOwner, navigation } = props;
   const [loading, setLoading] = useState(false);
   const username = useSelector((state) => state.users.username);
   const TouchableComp = Platform.OS === "android" && Platform.Version >= 23 ? TouchableNativeFeedback : TouchableOpacity;

   const goToEditPage = () => {
      navigation.navigate("EditProduct", {
         identifier: product.identifier,
         name: product.name,
         description: product.description,
         price: product.price,
         image: product.imageUrl,
      });
   };

   const makeOfferHandler = () => {
      setLoading(true);
      props
         .onMakeOffer()
         .then(() => setLoading(false))
         .catch(() => setLoading(false));
   };

   useEffect(() => {
      if (username === productOwner.username)
         navigation.setOptions({
            headerRight: () => (
               <TouchableComp activeOpacity={0.5} onPress={goToEditPage}>
                  <Entypo name='edit' size={22} color='black' style={{ marginRight: 15 }} />
               </TouchableComp>
            ),
         });
   }, [product, productOwner]);

   return (
      <Card style={styles.screen}>
         <Card.Cover source={{ uri: product.imageUrl }} style={{ width: "100%", height: "50%", resizeMode: "cover" }} />

         <Card.Content>
            <Title style={styles.title}>{product.name}</Title>
            <Paragraph style={styles.price}>HKD {product.price}</Paragraph>
            <Paragraph style={styles.description}>{product.description}</Paragraph>
         </Card.Content>
         <View style={styles.border} />
         <Card.Title
            style={styles.userField}
            subtitle={`By ${product.ownerName}`}
            left={() => <Avatar.Image size={48} {...props} source={{ uri: productOwner.profilePictureUrl }} />}
         />
         <Card.Actions>
            {username !== product.ownerName && (
               <View style={styles.buttonContainer}>
                  <Button onPress={makeOfferHandler} style={{ borderWidth: 1 }}>
                     Make Offer
                  </Button>
                  {loading && <ActivityIndicator />}
               </View>
            )}
         </Card.Actions>
      </Card>
   );
}

const styles = StyleSheet.create({
   screen: {
      flex: 1,
      backgroundColor: "white",
   },
   title: {
      marginVertical: 5,
      fontWeight: "bold",
   },
   price: {
      fontStyle: "italic",
      color: "rgb(77, 77, 77)",
   },
   description: {
      marginVertical: 5,
   },
   border: {
      marginHorizontal: "5%",
      borderTopColor: "#ccc",
      borderTopWidth: 1,
      marginTop: 10,
   },
   buttonContainer: {
      flexDirection: "row",
   },
});
