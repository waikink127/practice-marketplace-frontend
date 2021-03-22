import axios from "axios";
import jwt_decode from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LOGIN, LOGOUT, SAVEUSER } from "./actionTypes";

//Used
export const userLogin = (username, password) => {
   return async (dispatch) => {
      try {
         const res = await axios.post("/login", { username, password: password });
         const rawToken = res.headers.authorization;
         const token = rawToken.replace("Bearer ", "");
         const decoded = jwt_decode(token);
         // const expDate = new Date(decoded.exp * 1000 - 86400000);
         await AsyncStorage.setItem("authToken", rawToken);
         axios.defaults.headers.common["Authorization"] = rawToken;
         dispatch({ type: LOGIN, username: decoded.sub });
      } catch (e) {
         let message = e.response ? e.response.data.error : e.message;
         if(!message) message = "Something went wrong";
         throw new Error(message);
      }
   };
};

//Used
export const userLogout = () => {
   return async (dispatch) => {
      await AsyncStorage.removeItem("authToken");
      dispatch({ type: LOGOUT });
   };
};

//Used
export const userRegister = (username, password, email, phone) => {
   return async (dispatch) => {
      try {
         await axios.post(`/api/users`, { username, rawPassword: password, email, phone });
         dispatch(userLogin(username, password));
      } catch (e) {
         console.log(e);
         let message = e.response ? e.response.data.error : e.message;
         if(!message) message = "Something went wrong";
         throw new Error(message);
      }
   };
};

//Used
export const userEdit = (email, phone) => {
   return async (dispatch) => {
      try {
         await axios.put("/api/users", { email, phone });
      } catch (e) {
         let message = e.response ? e.response.data.error : e.message;
         if(!message) message = "Something went wrong";
         throw new Error(message);
      }
   };
};

//Used
export const editProfilePic = (img, username) => {
   return async (dispatch) => {
      try {
         const localUri = img;
         let filename = localUri.split("/").pop();
         let match = /\.(\w+)$/.exec(filename);
         let type = match ? `image/${match[1]}` : `image`;
         const form = new FormData();
         form.append("image", {
            uri: localUri,
            type,
            name: filename,
         });
         await axios({ method: "PATCH", url: `/api/users/${username}`, data: form, headers: { "Content-Type": "multipart/form-data" } });
      } catch (e) {
          let message = e.response ? e.response.data.error : e.message;
          if(!message) message = "Something went wrong";
         throw new Error("error");
      }
   };
};

export const deleteProduct = (id) => {
   return async (dispatch) => {
      try {
         await axios.delete(`/api/products/p/${id}`);
      } catch (e) {
         let message = e.response ? e.response.data.error : e.message;
         if(!message) message = "Something went wrong";
         throw new Error(message);
      }
   };
};

//Used
export const saveUser = (username) => ({ type: SAVEUSER, username });
