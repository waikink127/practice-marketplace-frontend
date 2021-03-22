import React, { useReducer, useCallback, useState, useEffect } from "react";
import {
   StyleSheet,
   View,
   Alert,
   Keyboard,
   TouchableWithoutFeedback,
   KeyboardAvoidingView,
} from "react-native";
import { useDispatch } from "react-redux";
import InputField from "./InputField";
import { userLogin, userRegister } from "../store/actions/user";
import { useIsFocused } from "@react-navigation/native";
import { Button } from 'react-native-paper';

const initialFormState = {
   inputValues: {
      username: "",
      email: "",
      phone: "",
      password: "",
   },
   inputValidities: {
      username: false,
      email: false,
      password: false,
      phone: false,
   },
   formIsValid: false,
};

const formReducer = (state, action) => {
   if (action.type === "reset")
      return {
         inputValues: {
            username: "",
            email: "",
            phone: "",
            password: "",
         },
         inputValidities: {
            username: false,
            email: false,
            password: false,
            phone: false,
         },
         formIsValid: false,
      };
   const updatedValues = { ...state.inputValues, [action.input]: action.value };
   const updatedValidities = { ...state.inputValidities, [action.input]: action.isValid };
   let updatedFormValid = true;
   for (const key in updatedValidities) {
      updatedFormValid = updatedFormValid && updatedValidities[key];
   }
   return { ...state, inputValues: updatedValues, inputValidities: updatedValidities, formIsValid: updatedFormValid };
};

export default function UserForm(props) {
   const isfocused = useIsFocused();
   const dispatch = useDispatch();
   const [isLogin, setIsLogin] = useState(true);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState();
   const [formState, dispatchFormState] = useReducer(formReducer, initialFormState);

   useEffect(() => {
      if (error) Alert.alert("Error: Please try again", error, [{ text: "Okay", onPress: () => setError(false) }]);
   }, [error]);


   const authHandler = async () => {
      const { username, password, email, phone } = formState.inputValues;
      setLoading(true);
      setError(null);
      try {
         if (isLogin) {
            if (formState.inputValidities.username && formState.inputValidities.password) {
               await dispatch(userLogin(username, password));
            } else {
               Alert.alert("Something went wrong", "Please check the input", [{ text: "OK", onPress: () => setLoading(false) }]);
            }
         } else {
            if (formState.formIsValid) await dispatch(userRegister(username, password, email, phone));
            else Alert.alert("Something went wrong", "Please check the input", [{ text: "OK", onPress: () => setLoading(false) }]);
         }
      } catch (e) {
         setError(e.message);
         setLoading(false);
      }
   };

   const inputChangeHandler = useCallback(
      (field, inputValue, inputIsValid) => {
         dispatchFormState({ value: inputValue, isValid: inputIsValid, input: field });
      },
      [dispatchFormState]
   );

   const onChangeMode = () => setIsLogin((prev) => !prev);

   return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
         <KeyboardAvoidingView behavior='padding' style={{ flex: 1, backgroundColor: "white" }}>
            <View style={styles.screen}>
               <View>
                  <InputField
                     id='username'
                     label='Username'
                     keyboardType='default'
                     minLength={7}
                     required
                     autoCapitalize='none'
                     errorText='Please enter a valid username'
                     onInputChange={inputChangeHandler}
                     initialValue=''
                     isFocus={props.isFocus}
                  />
                  <InputField
                     id='password'
                     label='Password'
                     keyboardType='default'
                     secureTextEntry
                     required
                     minLength={7}
                     autoCapitalize='none'
                     errorText='Please enter a valid password'
                     onInputChange={inputChangeHandler}
                     initialValue=''
                     isFocus={props.isFocus}
                  />
                  {!isLogin && (
                     <View>
                        <InputField
                           id='email'
                           label='E-mail'
                           keyboardType='email-address'
                           required
                           email
                           autoCapitalize='none'
                           errorText='Please enter a valid email address'
                           onInputChange={inputChangeHandler}
                           initialValue=''
                           isFocus={props.isFocus}
                        />
                        <InputField
                           id='phone'
                           label='Phone'
                           keyboardType='phone-pad'
                           required
                           minLength={8}
                           autoCapitalize='none'
                           errorText='Please enter a valid telephone number'
                           onInputChange={inputChangeHandler}
                           initialValue=''
                           isFocus={props.isFocus}
                        />
                     </View>
                  )}
               </View>
               <View style={styles.buttonContainer}>
                    <Button loading={loading} onPress={authHandler} >{isLogin ? "Login" : "Register"}</Button>
               </View>
               <View style={styles.buttonContainer}>
                  <Button onPress={onChangeMode}>{`Switch to ${isLogin ? "Register" : "Login"}`}</Button>
               </View>
            </View>
         </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
   );
}

const styles = StyleSheet.create({
   buttonContainer: {
      marginTop: 10,
   },
   screen: {
      width: "70%",
      alignSelf: "center",
      marginTop: 50
   },
});
