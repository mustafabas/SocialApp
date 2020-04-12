import {  SIGNUP_LOADING, PROFIL_PHOTO_LOADING } from "../../constants/actionConstants";
import { Action } from "./LoginReducers";

interface State {
  loading: boolean
  loadingProfilePhoto:boolean;
}

const intialState = {
  loading:false,
  loadingProfilePhoto : false
};

export default (state: State = intialState, action: Action) => {
  switch (action.type) {
    case SIGNUP_LOADING:
      return {
        ...state,
        loading:action.payload
      };
      case PROFIL_PHOTO_LOADING:
        return {
          ...state,
          loadingProfilePhoto: action.payload
        }
    default:
      return state;
  }
};
