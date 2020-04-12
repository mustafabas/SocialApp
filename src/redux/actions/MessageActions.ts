
import { Dispatch } from "redux";
import { fetchImageService } from "../services/user";
import { LOGIN_LOADING, UPDATE_LOCATION, UPDATE_CONVERSATION_ACTION, UPDATE_CONVERSATION_SEND_INFO } from "../../constants/actionConstants";
import { showSimpleMessage } from "../../components/showMessage";
import  axios from "../services/axiosBase";
import { API_LOG_IN, API_LOCATION_UPDATE } from "../../constants/apiConstants";
import { strings, errorMessages } from "../../constants/Localizations";
import AsyncStorage from "@react-native-community/async-storage";
import NavigationService from "../services/NavigationService";
import { IMessage } from "../../screens/AppScreens/Group/MessageScreen";




export function UpdateMessages(message : IMessage) {
  return (dispatch: Dispatch) => {
      if(message.isSend === true) {
        dispatch(updateOnlySend(message))
      }else {
        dispatch(updateConversations(message))
      }
     
    

  };
}


  export const updateConversations = (message : IMessage) => ({
    type : UPDATE_CONVERSATION_ACTION,
    payload : message
  })

  export const updateOnlySend = (message : IMessage) => ({
    type : UPDATE_CONVERSATION_SEND_INFO,
    payload : message
  })
