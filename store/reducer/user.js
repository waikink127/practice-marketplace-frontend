import { LOGIN, LOGOUT, SAVEUSER } from "../actions/actionTypes";

const init = {
   username: null,
};

export default (state = init, action) => {
   switch (action.type) {
      case LOGIN: 
         return { ...state, username: action.username };
      case LOGOUT: return { ...state, username: null };
      case SAVEUSER: return {...state, username: action.username};
      default:
         return state;
   }
};
