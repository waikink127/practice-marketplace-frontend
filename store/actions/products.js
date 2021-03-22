import axios from "axios";

export const editProduct = (routeParams, formStateValue, category, image, pickedImage) => {
   return async (dispatch) => {
      try {
         const method = routeParams ? "PUT" : "POST";
         const requestUrl = routeParams ? `/api/products/p/${routeParams.identifier}` : "/api/products";
         let form = new FormData();
         if (pickedImage) {
            const localUri = image;
            const filename = localUri.split("/").pop();
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : `image`;
            form.append("image", { uri: localUri, type, name: filename });
         } else form.append("image", null);
         form.append("name", formStateValue.name);
         form.append("description", formStateValue.description);
         form.append("price", parseInt(formStateValue.price));
         form.append("category", category);
         await axios({ method, url: requestUrl, data: form, headers: { "Content-Type": undefined } });
      } catch (e) {
         let message = e.response ? e.response.data.error : e.message;
         if(!message) message = "Something went wrong";
         throw new Error(message);
      }
   };
};
