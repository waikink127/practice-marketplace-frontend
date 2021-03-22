import React from "react";
import { StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform , Text} from "react-native";
import { Card, Paragraph, Avatar } from "react-native-paper";

export default function ProductItem(props) {
   let TouchableComponent = TouchableOpacity;
   if (Platform.OS === "android" && Platform.Version >= 21) {
      TouchableComponent = TouchableNativeFeedback;
   }
   return (
      <TouchableComponent activeOpacity={0.8} style={{ }} onPress={props.toDetails}>
         <Card style={styles.card}>
            <Card.Cover source={{ uri: props.image }} />
            <Card.Content>
               <Text numberOfLines={1} ellipsizeMode='tail' style={styles.title}>{props.title}</Text>
               <Paragraph style={styles.price}>HKD {props.price ? (props.price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ''}</Paragraph>
               <Text style={styles.user}>{props.ownerName}</Text>
            </Card.Content>
         </Card>
      </TouchableComponent>
   );
}

const styles = StyleSheet.create({
   card: {
      margin: 5, 
      flex: 1/2
   }, 
   title:{
      fontSize: 14, 
      marginTop: 5, 
      fontWeight: 'bold'
   }, 
   price:{
      color: 'grey', 
      fontStyle: 'italic', 
      marginBottom: 0
   }, 
   user:{
      color: 'grey', 
      fontStyle: 'italic', 
      marginBottom: 0, 
      fontSize: 12, 
      textAlign: 'right'
   }
});
