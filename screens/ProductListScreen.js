import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import ErrorMessage from "../components/ErrorMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import ProductItem from "../components/ProductItem";

export default function ProductListScreen(props) {
   const { navigation, route } = props;
   const { cat } = route.params;
   const username = useSelector((state) => state.users.username);
   const [fetched, setFetched] = useState(false);
   const [error, setError] = useState(null);
   const [products, setProducts] = useState(null);
   const [loading, setLoading] = useState(false);

   const fetchProducts = useCallback(async () => {
      setError(null);
      setFetched(false);
      try {
         const res = await axios.get(`/api/products/category/${cat}`);
         const data = res.data;
         const p = data.filter((i) => i.ownerName !== username);
         setProducts(p);
         setFetched(true);
      } catch (e) {
         if (e.response) setError(e.response.data.error);
         else setError(e.message);
         setFetched(true);
      }
   }, [cat]);
   const reFetchProducts = async () => {
      setLoading(true);
      try {
         const res = await axios.get(`/api/products/category/${cat}`);
         const data = res.data;
         const p = data.filter((i) => i.ownerName !== username);
         setProducts(p);
         setLoading(false);
      } catch (e) {
         let message = e.response ? e.response.data.error : e.message;
         if(!message) message = "Something went wrong";
         setError(message);
         setLoading(false);
      }
   };
   const toDetailsScreen = (id, name) => navigation.navigate("ProductDetails", { id, name });

   useEffect(() => {
      navigation.setOptions({ title: cat });
      fetchProducts();
   }, [cat]);

   if (!fetched) return <LoadingSpinner />;
   if (error) return <ErrorMessage retry={fetchProducts} error={error} navigation={navigation} />;
   if (!products.length)
      return (
         <View style={styles.noProductScreen}>
            <Text style={styles.noProduct}>No Product Available</Text>
         </View>
      );

   return (
      <View style={styles.screen}>
         <FlatList
            style={{}}
            onRefresh={reFetchProducts}
            contentContainerStyle={{width: '100%'}}
            refreshing={loading}
            data={products}
            numColumns={2}
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
      </View>
   );
}

const styles = StyleSheet.create({
   screen: {
      flex: 1,
      backgroundColor: "white",
      width: '100%'
   },
   noProductScreen: {
      flex: 1,
      backgroundColor: "white",
      justifyContent: "center",
      alignItems: "center",
   },
   noProduct: {
      fontSize: 18,
      color: "grey",
   },
});
