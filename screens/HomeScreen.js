import React, { useEffect } from "react";
import { StyleSheet, Text, View, FlatList, SafeAreaView } from "react-native";
import CategoryGrid from "../components/CategoryGrid";
import { CategoryList } from "../utils/constants";
const Beverage = require("../assets/icons/Beverage.png");
const Sports = require("../assets/icons/Sports.png");
const Books = require("../assets/icons/Books.png");
const Cosmetics = require("../assets/icons/Cosmetics.png");
const Electronics = require("../assets/icons/Electronics.png");
const Fasion = require("../assets/icons/Fasion.png");
const Games = require("../assets/icons/Games.png");
const Luxury = require("../assets/icons/Luxury.png");

export default function HomeScreen(props) {
   const { navigation } = props;
   const genIcon = (item) => {
      switch (item) {
         case "Beverage":
            return Beverage;
         case "Sports":
            return Sports;
         case "Books":
            return Books;
         case "Cosmetics":
            return Cosmetics;
         case "Electronics":
            return Electronics;
         case "Fasion":
            return Fasion;
         case "Games":
            return Games;
         case "Luxury":
            return Luxury;
      }
   };

   const renderGridItem = (item) => {
      return <CategoryGrid title={item} icon={genIcon(item)} onSelect={() => navigation.navigate("ProductList", { cat: item })} />;
   };

   useEffect(() => {
      navigation.setOptions({ title: "Explore" });
   }, []);

   return (
      <View style={styles.screen}>
         <SafeAreaView>
            <FlatList
               style={styles.list}
               keyExtractor={(item) => item.name}
               numColumns={2}
               data={CategoryList}
               renderItem={({ item }) => renderGridItem(item.name)}
            />
         </SafeAreaView>
      </View>
   );
}

const styles = StyleSheet.create({
   screen: {
      backgroundColor: "white",
      flex: 1,
   },
   titleContainer: {
      marginVertical: 20,
      alignItems: "center",
   },
   title: {
      fontSize: 20,
      fontWeight: "bold",
   },
   list: {
      marginHorizontal: 16,
   },
});
