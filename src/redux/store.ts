import { compose, applyMiddleware, createStore, combineReducers } from "redux";
import thunk from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";

import reducer from "./reducers";
import AsyncStorage from '@react-native-community/async-storage';
import LoginReducers from "./reducers/LoginReducers";
import SignUpReducers from "./reducers/SignUpReducers";
import locationReducers from "./reducers/locationReducers";
import postReducers from "./reducers/postReducers";
import messageReducers from "./reducers/messageReducers";
const persistConfig = {
  key: "root",
  storage: AsyncStorage
};

const middlewares = [thunk];

if (process.env.NODE_ENV === `development`) {
  const { logger } = require(`redux-logger`);

  middlewares.push(logger);
}

const rootReducer = combineReducers({
 login : LoginReducers,
 signUp : SignUpReducers,
 location : locationReducers,
 posts : postReducers,
 message : messageReducers
})


export type AppState = ReturnType<typeof rootReducer>




export default function configureStore() {
  const enhancer = compose(applyMiddleware(...middlewares));
  const persistedReducer = persistReducer(persistConfig, rootReducer);
  const store = createStore(persistedReducer, enhancer);
  const persistor = persistStore(store);
  return { store, persistor };
}
