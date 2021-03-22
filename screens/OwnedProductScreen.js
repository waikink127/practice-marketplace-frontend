import React, { useEffect, useState } from "react";
import { StyleSheet, Platform, TouchableOpacity, TouchableNativeFeedback, View, FlatList, RefreshControl } from "react-native";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import ProductItem from "../components/ProductItem";
import { useSelector } from "react-redux";
import UnAuth from "../components/UnAuth";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Button } from "react-native-paper";
import { useCallback } from "react";
import { Foundation } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";

export default function OwnedProductScreen(props) {
   const isFocused = useIsFocused();
   const bottomHeight = useBottomTabBarHeight();
   const { navigation } = props;
   const [error, setError] = useState(null);
   const [products, setProducts] = useState(null);
   const [fetched, setFetched] = useState(false);
   const [loading, setLoading] = useState(false);
   const username = useSelector((state) => state.users.username);
   const TouchableComp = Platform.OS === "android" && Platform.Version >= 23 ? TouchableNativeFeedback : TouchableOpacity;

   const toDetailsScreen = (id, name) => navigation.navigate("MyProductsDetails", { id, name });

   const fetchProducts = useCallback(async () => {
      if (username) {
         try {
            setFetched(false);
            const user = (await axios.get(`api/users/${username}`)).data;
            const allProducts = user.ownedProduct.filter((p) => p.ownerActive === true);
            setProducts(allProducts);
            setFetched(true);
         } catch (e) {
            const message = e.response ? e.response.data.error : e.message;
            setError(message);
            setFetched(true);
         }
      } else {
         setFetched(true);
      }
   }, [username]);

   const refresh = useCallback(async () => {
      if (username) {
         setLoading(true);
         try {
            const user = (await axios.get(`api/users/${username}`)).data;
            const products = user.ownedProduct;
            setProducts(products);
            setLoading(false);
         } catch (e) {
            let message = e.response ? e.response.data.error : e.message;
            if(!message) message = "Something went wrong";
            setError(message);
            setLoading(false);
         }
      } else {
         setLoading(false);
      }
   }, [username]);

   useEffect(() => {
      if (isFocused) {
         fetchProducts();
         if (username) {
            navigation.setOptions({
               headerRight: () => (
                  <TouchableComp activeOpacity={0.5} onPress={refresh}>
                     <Foundation name='refresh' size={22} color='black' style={{ marginRight: 15 }} />
                  </TouchableComp>
               ),
            });
         }
      } else navigation.setOptions({ headerRight: null });
   }, [username, isFocused]);

   if (!fetched && !products) return <LoadingSpinner />;
   if (error) return <ErrorMessage retry={fetchProducts} error={error} navigation={navigation} />;
   if (!username) return <UnAuth navigation={navigation} />;
   if (!products || !products.length)
      return (
         <View style={styles.noProductScreen}>
            <Button icon='plus' onPress={() => navigation.navigate("CreateStack")} color='grey'>
               ADD SOME
            </Button>
         </View>
      );

   return (
      <View style={styles.screen}>
         <View style={{ ...styles.content }}>
            <FlatList
               refreshControl={<RefreshControl onRefresh={refresh} refreshing={loading} />}
               data={products}
               keyExtractor={(item) => item.identifier.toString()}
               renderItem={({ item }) => (
                  <ProductItem
                     title={item.name}
                     price={item.price}
                     image={item.imageUrl}
                     toDetails={() => toDetailsScreen(item.identifier, item.name)}
                  />
               )}
            />
         </View>
      </View>
   );
}

const styles = StyleSheet.create({
   screen: {
      flex: 1,
      backgroundColor: "white",
   },
   content: {
      width: "95%",
      alignSelf: "center",
      flex: 1,
   },
   noProductScreen: {
      flex: 1,
      backgroundColor: "white",
      justifyContent: "center",
      alignItems: "center",
   },
});
