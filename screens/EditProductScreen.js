import React, { useState, useReducer, useEffect } from "react";
import { Alert, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import { TextInput } from "react-native-paper";
import { Chip } from "react-native-paper";
import ProductImageEdit from "../components/ProductImageEdit";
import { CategoryList } from "../utils/constants";
import { Button } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import UnAuth from "../components/UnAuth";
import { editProduct } from "../store/actions/products";
import { useIsFocused } from "@react-navigation/native";
import { deleteProduct } from "../store/actions/user";

const formReducer = (state, action) => {
   switch (action.type) {
      case "input":
         const updatedValue = { ...state.value, [action.label]: action.value };
         const updatedValidities = { ...state.valid, [action.label]: action.isValid };
         let updatedFormValid = true;
         for (const key in updatedValidities) {
            updatedFormValid = updatedFormValid && updatedValidities[key];
         }
         return { ...state, value: updatedValue, valid: updatedValidities, formValid: updatedFormValid };
      case "touch":
         const updatedTouch = { ...state.touched, [action.label]: true };
         return { ...state, touched: updatedTouch };
      case "reset":
         return {
            value: {
               name: "",
               description: "",
               price: "",
            },
            valid: {
               name: false,
               description: false,
               price: false,
            },
            touched: {
               name: false,
               description: false,
               price: false,
            },
            formValid: false,
         };
   }
};

export default function EditProductScreen(props) {
   const { navigation, route } = props;
   const isFocused = useIsFocused();
   const username = useSelector((state) => state.users.username);
   const dispatch = useDispatch();
   const [category, setCategory] = useState("Electronics");
   const [image, setImage] = useState(route.params ? route.params.image : null);
   const [picked, setPicked] = useState(false);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);
   const [formState, dispatchForm] = useReducer(formReducer, {
      value: {
         name: route.params ? route.params.name : "",
         description: route.params ? route.params.description : "",
         price: route.params ? route.params.price.toString() : "",
      },
      valid: {
         name: route.params ? true : false,
         description: route.params ? true : false,
         price: route.params ? true : false,
      },
      touched: {
         name: false,
         description: false,
         price: false,
      },
      formValid: route.params ? true : false,
   });

   const inputChangeHandler = (label, text) => {
      let isValid = true;
      switch (label) {
         case "name":
            if (text.trim().length < 1 || text.length < 1 || text.length > 50) isValid = false;
            break;
         case "description":
            if (text.trim().length < 10 || text.length < 10 || text.length > 100) isValid = false;
            break;
         case "price":
            if (text.length < 1 || parseInt(text) < 1) isValid = false;
            break;
      }
      dispatchForm({ label, value: text.toString(), isValid, type: "input" });
   };
   const touchFieldHandler = (label) => {
      dispatchForm({ label, type: "touch" });
   };
   const onSubmitHandler = async () => {
      setLoading(true);
      try {
         await dispatch(editProduct(route.params, formState.value, category, image, picked));
         setLoading(false);
         navigation.navigate("Owned");
      } catch (e) {
         setError(e.message);
         setLoading(false);
      }
   };

   const deleteRequest = async () => {
      setLoading(true);
      try {
         await dispatch(deleteProduct(route.params.identifier));
         setLoading(false);
         navigation.navigate("Owned");
      } catch (e) {
         setError(e.message);
         setLoading(false);
      }
   };

   const onDeleteHandler = () => {
      Alert.alert("Are you sure?", "Please confirm", [
         { text: "Sure", style: "destructive", onPress: () => deleteRequest() },
         { text: "Cancel", style: "cancel" },
      ]);
   };

   useEffect(() => {
      if (!isFocused) {
         dispatchForm({ type: "reset" });
         setPicked(false);
         setImage(null);
      }
   }, [isFocused]);

   useEffect(() => {
      if (error) Alert.alert("Error: Please retry", error, [{ text: "OK", onPress: () => setError(null) }]);
   }, [error]);

   if (!username) return <UnAuth navigation={navigation} />;

   return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
         <ScrollView style={styles.screen}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'android' ? 'padding' : 'position'} keyboardVerticalOffset={10}>
               <ProductImageEdit setImage={setImage} image={image} setPicked={setPicked} picked={picked} />
               <View style={styles.inputContainer}>
                  <TextInput
                     style={styles.textInput}
                     mode='outlined'
                     label='Name'
                     keyboardType='default'
                     onBlur={() => touchFieldHandler("name")}
                     error={!formState.valid.name && formState.touched.name}
                     placeholder='Name'
                     value={formState.value.name}
                     onChangeText={(t) => inputChangeHandler("name", t)}
                  />
                  <Text style={styles.valid}> Required, less than 50 charaters</Text>
                  <TextInput
                     style={styles.textInput}
                     mode='outlined'
                     label='Description'
                     keyboardType='default'
                     onBlur={() => touchFieldHandler("description")}
                     error={!formState.valid.description && formState.touched.description}
                     placeholder='Required, less than 100 charaters'
                     value={formState.value.description}
                     onChangeText={(t) => inputChangeHandler("description", t)}
                  />
                  <Text style={styles.valid}> Required, less than 100 charaters</Text>
                  <TextInput
                     style={styles.textInput}
                     mode='outlined'
                     label='Price'
                     disabled={route.params ? true : false}
                     onBlur={() => touchFieldHandler("price")}
                     error={!formState.valid.price && formState.touched.price}
                     placeholder='Price'
                     value={formState.value.price}
                     onChangeText={(t) => inputChangeHandler("price", t.toString())}
                     keyboardType='number-pad'
                  />
                  <Text style={styles.valid}> At least $1</Text>
               </View>
               <View style={styles.chipContainer}>
                  {CategoryList.map((i) => (
                     <Chip
                        key={i.name}
                        style={styles.chip}
                        selected={category === i.name}
                        mode='outlined'
                        onPress={() => setCategory(i.name)}
                        textStyle={styles.chipText}>
                        {i.name}
                     </Chip>
                  ))}
               </View>
               <View style={styles.buttonContainer}>
                  <Button onPress={onSubmitHandler} loading={loading} disabled={!formState.formValid}>
                     SUBMIT
                  </Button>
               </View>
               {route.params && (
                  <View style={styles.buttonContainer}>
                     <Button onPress={onDeleteHandler} color='red' loading={loading}>
                        DELELTE
                     </Button>
                  </View>
               )}
            </KeyboardAvoidingView>
         </ScrollView>
      </TouchableWithoutFeedback>
   );
}

const styles = StyleSheet.create({
   screen: {
      width: "100%",
      height: "100%",
      backgroundColor: "white",
   },
   chip: {
      height: 30,
      marginHorizontal: 3,
      marginVertical: 5,
   },
   chipText: {
      fontSize: 12,
      fontStyle: "italic",
      textAlign: "center",
      marginVertical: "auto",
   },
   chipContainer: {
      marginTop: 15,
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "flex-start",
      marginHorizontal: 10,
   },
   inputContainer: {
      width: "80%",
      alignSelf: "center",
      marginTop: 10,
   },
   textInput: {
      marginVertical: 8,
      backgroundColor: "white",
   },
   valid: {
      fontSize: 11,
      fontStyle: "italic",
      color: "grey",
   },
   buttonContainer: {
      flexDirection: "row",
      justifyContent: "center",
      marginVertical: 15,
   },
});

//
