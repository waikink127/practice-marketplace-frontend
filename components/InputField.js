import React, { useReducer, useEffect } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

const INPUT_CHANGE = "INPUT_CHANGE";
const INPUT_BLUR = "INPUT_BLUR";
const RESET = 'RESET';

const inputReducer = (state, action) => {
   switch (action.type) {
      case INPUT_CHANGE:
         return {
            ...state,
            value: action.value,
            isValid: action.isValid,
         };
      case INPUT_BLUR:
         return {
            ...state,
            touched: true,
         };
      case RESET:
         return {...state, touched: false}

      default:
         return state;
   }
};

export default function InputField(props) {
   const {isFocus} = props;
   const [inputState, formDispatch] = useReducer(inputReducer, {
      value: props.initialValue ? props.initialValue : "",
      isValid: props.initialIsValid,
      touched: props.initialValue ? true : false,
   });

   const { onInputChange, id } = props;

   useEffect(() => {
      if (inputState.touched) {
         onInputChange(id, inputState.value, inputState.isValid);
      }
   }, [inputState, onInputChange, id]);

   useEffect(() => {
      formDispatch({type: RESET})
   },[isFocus])


   const textChangeHandler = (text) => {
      const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      let isValid = true;
      if (props.required && text.trim().length === 0) {
         isValid = false;
      }
      if (props.email && !emailRegex.test(text.toLowerCase())) {
         isValid = false;
      }
      if (props.min != null && +text < props.min) {
         isValid = false;
      }
      if (props.max != null && +text > props.max) {
         isValid = false;
      }
      if (props.minLength != null && text.length < props.minLength) {
         isValid = false;
      }
      formDispatch({ type: INPUT_CHANGE, value: text, isValid: isValid });
   };

   const lostFocusHandler = () => {
      formDispatch({ type: INPUT_BLUR });
      
   };

   return (
      <View style={styles.formControl}>
         <Text style={{...styles.label, ...props.labelStyle}}>{props.label}</Text>
         <TextInput
            {...props}
            style={styles.input}
            value={inputState.value}
            onChangeText={(text) => textChangeHandler(text)}
            onBlur={() => lostFocusHandler()}
             onFocus={() =>lostFocusHandler()}
         />
         {!inputState.isValid && inputState.touched && (
            <View style={styles.errorContainer}>
               <Text style={styles.errorText}>{props.errorText}</Text>
            </View>
         )}
      </View>
   );
}

const styles = StyleSheet.create({
   formControl: {
      width: "100%",
   },
   label: {
      marginVertical: 8,
   },
   input: {
      paddingVertical: 5,
      paddingHorizontal: 2,
      borderBottomColor: "#ccc",
      borderBottomWidth: 1,
   },
   errorContainer: {
      marginVertical: 5,
   },
   errorText: {
      color: "red",
      fontSize: 13,
   },
});
