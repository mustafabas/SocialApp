import { IMAGE_DATA_FETCHED, DATA_LOADING, FETCH_MORE } from "../actions/fetch";
import { LOGIN_LOADING, GET_POSTS, GET_POSTS_LOADING, CREATE_POST, UPDATE_CONVERSATION_SEND_INFO, UPDATE_CONVERSATION_ACTION } from "../../constants/actionConstants";
import { Action } from "./LoginReducers";
import { IPOST } from "../actions/postActions";
import { IMessage } from "../../screens/AppScreens/Group/MessageScreen";
interface State {
  messages: IMessage[]

}

const intialState = {
  messages :[],

};

export default (state: State = intialState, action: Action) => {
  switch (action.type) {
    case UPDATE_CONVERSATION_ACTION:
      return {
        ...state,
        // posts : [...action.payload,...state.posts]
        messages : [...state.messages,action.payload]
        // loading : false
      };
    case UPDATE_CONVERSATION_SEND_INFO:

        return {
            ...state,
            messages : state.messages.map((message, i) => message.content === action.payload.content ? {...message, isSend: true}
            : message
)
        }
    case CREATE_POST :
      return {
        ...state,
        loadingCreatePost :action.payload
      }
    default:
    
      return state;
  }
};
