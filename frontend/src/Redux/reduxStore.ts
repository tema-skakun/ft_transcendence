import {combineReducers, createStore} from "redux";
import chatReducer from "./chatReducer";
import profileReducer from "./profileReducer";
import gameReducer from "./gameReducer";

let reducers:any = combineReducers({
    profilePage: profileReducer,
    chatPage: chatReducer,
    gamePage: gameReducer
});

let store : any = createStore(reducers);

export default store;