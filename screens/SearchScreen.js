import React, { useEffect, useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, TouchableWithoutFeedback, View, Keyboard, Platform } from "react-native";
import { Searchbar } from "react-native-paper";
import axios from "axios";
import { useIsFocused } from "@react-navigation/native";
import { useCallback } from "react";
import ErrorMessage from "../components/ErrorMessage";
import ProductItem from "../components/ProductItem";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import LoadingSpinner from "../components/LoadingSpinner";
import { useSelector } from "react-redux";

export default function ScreenScreen(props) {
   const bottomHeight = useBottomTabBarHeight();
   const isFocused = useIsFocused();
   const username = useSelector((state) => state.users.username);
   const { navigation } = props;
   const [searchQuery, setSearchQuery] = useState("");
   const [products, setProducts] = useState(null);
   const [error, setError] = useState(null);
   const [fetched, setFetched] = useState(false);
   const onChangeSearch = (query) => setSearchQuery(query);

   const fetchProducts = useCallback(async () => {
      setFetched(false);
      setError(null);
      try {
         const res = await axios.get("/api/products");
         const p = res.data.sort((a, b) => a.name.localeCompare(b.name))
         setProducts(p.filter((i) => i.ownerName !== username));
         setFetched(true);
      } catch (e) {
         const message = e.response ? e.response.data.error : e.message;
         setError(message);
         setFetched(true);
      }
   });
   const refetch = useCallback(async () => {
      setError(null);
      try {
         const res = await axios.get("/api/products");
         const p = res.data.sort((a, b) => a.name.localeCompare(b.name))
         setProducts(p.filter((i) => i.ownerName !== username));
      } catch (e) {
         let message = e.response ? e.response.data.error : e.message;
         if(!message) message = "Something went wrong";
         setError(message);
      }
   });

   const toDetailsScreen = (id, name) => navigation.navigate("SearchProductsDetails", { id, name });

   useEffect(() => {
      if (!fetched) fetchProducts();
      if (products && fetched && isFocused) refetch();
   }, [isFocused]);

   let searchedProducts, productList;
   if (products && searchQuery.length > 0) {
      searchedProducts = products.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()) && p.name > searchQuery);
      productList = (
         <FlatList
            data={searchedProducts}
            keyExtractor={(item) => item.identifier}
            renderItem={({ item }) => (
               <ProductItem
                  title={item.name}
                  ownerName={item.ownerName}
                  price={item.price}
                  image={item.imageUrl}
                  toDetails={() => toDetailsScreen(item.identifier, item.name)}
               />
            )}
         />
      );
   } else {
      productList = null;
   }

   if (!fetched)
      return (
         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.screen}>
               <View style={styles.searchBar}>
                  <Searchbar placeholder='Search' onChangeText={onChangeSearch} value={searchQuery} />
               </View>
               <LoadingSpinner />
            </SafeAreaView>
         </TouchableWithoutFeedback>
      );

   return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
         <SafeAreaView style={styles.screen}>
            <View style={styles.searchBar}>
               <Searchbar placeholder='Search' onChangeText={onChangeSearch} value={searchQuery} />
            </View>
            {error ? (
               <ErrorMessage error={error} retry={fetchProducts} navigation={navigation} />
            ) : (
               <View style={{ ...styles.content, marginBottom: bottomHeight + 5 }}>{productList}</View>
            )}
         </SafeAreaView>
      </TouchableWithoutFeedback>
   );
}

const styles = StyleSheet.create({
   screen: {
      flex: 1,
      backgroundColor: "white",
   },
   searchBar: {
      marginTop: Platform.OS === "android" ? 30 : 15,
      marginBottom: Platform.OS === "android" ? 5 : 5,
      width: "90%",
      alignSelf: "center",
   },
   content: {
      width: "95%",
      alignSelf: "center",
   },
});
