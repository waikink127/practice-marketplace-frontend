import React, { useEffect, useCallback } from "react";
import { useState } from "react";
import { Alert, StyleSheet, View, Dimensions } from "react-native";
import ErrorMessage from "../components/ErrorMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import axios from "axios";
import ProductDetailsCard from "../components/ProductDetailsCard";

export default function ProductDetailsScreen(props) {
   const { navigation, route } = props;
   const { id, name } = route.params;
   const [fetched, setFetched] = useState(false);
   const [error, setError] = useState(null);
   const [product, setProduct] = useState(null);
   const [productOwner, setProductOwner] = useState(null);
   

   const fetchProduct = useCallback(async () => {
      setError(null);
      setFetched(false);
      try {
         const res = await axios.get(`/api/products/p/${id}`);
         const data = res.data
         const userRes = await axios.get(`/api/users/${data.ownerName}`);
         const owner = userRes.data;
         setProduct(data);
         setProductOwner(owner);
         setFetched(true);
      } catch (e) {
         let message = e.response ? e.response.data.error : e.message;
         if(!message) message = "Something went wrong";
         setError(message);
         setFetched(true);
      }
   }, [id]);

   const makeOfferHandler = async () => {
      try {
         // await axios.patch(`api/products/p/${id}`);
         Alert.alert("Success", "Offer made", [{ text: "OK", style: "cancel" }]);
      } catch (e) {
         Alert.alert("Something went wrong", "Please retry making offer", [{ text: "OK", style: "cancel" }]);
      }
   };

   useEffect(() => {
      navigation.setOptions({ title: name });
      fetchProduct();
   }, [id]);


   
   if (!fetched) return <LoadingSpinner />;
   if (error) return <ErrorMessage retry={fetchProduct} error={error} navigation={navigation} />;
   return (
      <View style={styles.screen}>
         <ProductDetailsCard product={product} navigation={navigation} productOwner={productOwner} onMakeOffer={makeOfferHandler} />
      </View>
   );
}

const styles = StyleSheet.create({
   screen: {
      flex: 1,
   },
});
