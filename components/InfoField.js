import React from "react";
import {  Text, View, StyleSheet, ActivityIndicator } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";


export default function InfoField (props){
    return (
        <View style={{...styles.infoField, ...props.style}}>
           <View style={{...styles.labelContainer, ...props.labelContainerStyle}}>
              <MaterialCommunityIcons name={props.iconName} size={28} color='black' />
           </View>
           {props.content !== null ? <Text style={{ ...styles.contentText, ...props.style }}>{props.content}</Text> : <ActivityIndicator size='small' color='#ccc' />  }
           
        </View>
     );
} 

const styles = StyleSheet.create({
    labelContainer: {
        width: "100%",
        alignItems: "center",
        marginVertical: 10,
     },
     infoField: {
        width: "100%",
        alignItems: "center",
        marginVertical: 10,
     },

});