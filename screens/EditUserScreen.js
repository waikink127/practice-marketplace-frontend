import React, { useReducer, useCallback, useState, useEffect } from "react";
import { Keyboard, StyleSheet, TouchableWithoutFeedback, View, KeyboardAvoidingView, Alert } from "react-native";
import InfoField from "../components/InfoField";
import InputField from "../components/InputField";
import { useIsFocused } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { userEdit } from "../store/actions/user";
import { Button } from 'react-native-paper';

const formReducer = (state, action) => {
   const updatedValues = { ...state.inputValues, [action.input]: action.value };
   const updatedValidities = { ...state.inputValidities, [action.input]: action.isValid };
   let updatedFormValid = true;
   for (const key in updatedValidities) {
      updatedFormValid = updatedFormValid && updatedValidities[key];
   }
   return { ...state, inputValues: updatedValues, inputValidities: updatedValidities };
};

export default function EditUserScreen(props) {
   const { navigation } = props;
   const { user } = props.route.params;
   const dispatch = useDispatch();
   const isFocused = useIsFocused();
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState();
   const [formState, dispatchFormState] = useReducer(formReducer, {
      inputValues: {
         email: user.email,
         phone: user.phone,
      },
      inputValidities: {
         email: true,
         phone: true,
      },
   });

   useEffect(() => {
      if (error) Alert.alert("Fail: Please retry", error, [{ text: "OK", onPress: () => setError(false) }]);
   }, [error]);

   const inputChangeHandler = useCallback(
      (field, inputValue, inputIsValid) => {
         dispatchFormState({ value: inputValue, isValid: inputIsValid, input: field });
      },
      [dispatchFormState]
   );

   const onSubmitForm = async () => {
      const { inputValues, inputValidities } = formState;
      if (inputValidities.email && inputValidities.email) {
         setLoading(true);
         setError(null);
         try {
            await dispatch(userEdit(inputValues.email, inputValues.phone));
            navigation.goBack();
         } catch (e) {
            setError(e.message);
            setLoading(false);
         }
      }
   };

   return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
         <View style={{ flex: 1, backgroundColor: "white" }}>
            <KeyboardAvoidingView behavior='padding' style={styles.screen}>
               <InfoField
                  iconName='account-circle-outline'
                  content={user.username}
                  style={styles.username}
                  labelContainerStyle={styles.labelContainerStyle}
               />
               <InfoField iconName='email-outline' style={styles.infoField} />
               <View style={styles.input}>
                  <InputField
                     labelStyle={styles.labelStyle}
                     id='email'
                     keyboardType='email-address'
                     required
                     email
                     autoCapitalize='none'
                     errorText='Please enter a valid email address'
                     onInputChange={inputChangeHandler}
                     initialValue={user.email}
                     isFocus={isFocused}
                     initialIsValid={true}
                  />
               </View>
               <InfoField iconName='cellphone' style={styles.infoField} />
               <View style={styles.input}>
                  <InputField
                     labelStyle={styles.labelStyle}
                     id='phone'
                     keyboardType='phone-pad'
                     required
                     minLength={8}
                     autoCapitalize='none'
                     errorText='Please enter a valid telephone number'
                     onInputChange={inputChangeHandler}
                     initialValue={user.phone}
                     isFocus={isFocused}
                     initialIsValid={true}
                  />
               </View>
               <View style={styles.buttonContainer}>
                  <Button title='Submit' loading={loading} onPress={onSubmitForm}>Submit</Button>
               </View>
            </KeyboardAvoidingView>
         </View>
      </TouchableWithoutFeedback>
   );
}

const styles = StyleSheet.create({
   screen: {
      marginTop: 20,
   },
   username: {
      textAlign: "center",
      fontSize: 20,
      marginBottom: 18,
      fontWeight: "bold",
   },
   input: {
      width: "70%",
      alignSelf: "center",
      marginBottom: 20,
   },
   infoField: {
      marginVertical: 0,
   },
   labelStyle: {
      marginVertical: 0,
   },
   labelContainerStyle: {
      marginVertical: 0,
   },
   buttonContainer: {
      marginTop: 10,
   },
});
