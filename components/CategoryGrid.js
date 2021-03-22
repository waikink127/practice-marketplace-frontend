import React from "react";
import { TouchableOpacity, View, Text, StyleSheet,TouchableNativeFeedback, Platform , Image} from "react-native";

const CategoryGrid = (props) => {
    let TouchableComponent = TouchableOpacity;
    if(Platform.OS === "android" && Platform.Version >= 21){
        TouchableComponent = TouchableNativeFeedback;
    }

   return (
       <View style={styles.gridItem}>
      <TouchableComponent
         activeOpacity={0.6}
         style={{flex: 1}}
         onPress={props.onSelect}
         >
         <View style={{...styles.container}}>
             <Image source={props.icon} style={{width: '25%', height: '30%'}} />
            <Text style={styles.title}>{props.title}</Text>
         </View>
      </TouchableComponent>
      </View>
   );
};

const styles = StyleSheet.create({
    gridItem: {
        flex: 1,
        margin: 16,
        height: 120,
        overflow: Platform.OS === "android" && Platform.Version >= 21 ? "hidden" : "visible",
        
     },
     container: {
         flex:1,
         padding: 5,
         justifyContent: "center",
         alignItems: "center",
     },
     title: {
         fontSize: 14,
         fontWeight: 'bold',
         margin: 15
     }
})

export default CategoryGrid;
