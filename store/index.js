import { combineReducers, applyMiddleware,createStore } from "redux";
import thunk from "redux-thunk";
import userReducer from './reducer/user';

const rootReducer = combineReducers({
    users: userReducer,
});

export default store = createStore(rootReducer, applyMiddleware(thunk));
