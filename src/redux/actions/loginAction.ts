
import { Dispatch } from "redux";
import { fetchImageService } from "../services/user";
import { LOGIN_LOADING, UPDATE_LOCATION } from "../../constants/actionConstants";
import { showSimpleMessage } from "../../components/showMessage";
import  axios from "../services/axiosBase";
import { API_LOG_IN, API_LOCATION_UPDATE } from "../../constants/apiConstants";
import { strings, errorMessages } from "../../constants/Localizations";
import AsyncStorage from "@react-native-community/async-storage";
import NavigationService from "../services/NavigationService";




export function locationUpdate(lat : number, long:number,userId: number) {
  return (dispatch: Dispatch) => {
  
    axios().put(API_LOCATION_UPDATE+ userId,{
      latitude: lat,
      longtitude: long
    }).then((res) => {
      console.log(res)
      dispatch(loading(false));

      if(res.data.isSuccess) {
      dispatch(updateLocationSucceed(lat,long));
      
        
        
      }else {
        
      

      }
    }
    ).catch(e => {
      

    })
    

  };
}







export function LoginWithPhone(username: string,password : string) {
    return (dispatch: Dispatch) => {
      dispatch(loading(true));
      console.log(username,password)
      axios().post(API_LOG_IN,{
        password: password,
        userName: username,
      }).then((res) => {
        console.log(res)
        dispatch(loading(false));

        if(res.data.isSuccess) {
          AsyncStorage.multiSet([["userToken",res.data.result.token],["userId",res.data.result.userId.toString()],["username",username]]).then(()=> {

          NavigationService.navigate('AuthLoading', {});
          console.log("girdii")
          })
        }else {
          
          let message = res.data.message
          let errorMessage = errorMessages.find(e => e.key === message)?.value 
          if(errorMessage){
            showSimpleMessage(errorMessage,"danger")
          }

        }
      }
      ).catch(e => {
        showSimpleMessage(strings.generalError,"danger")

      })
      

    };
  }




  export const updateLocationSucceed = (lat : number,long : number) => ({
    type : UPDATE_LOCATION,
    payload : [lat,long]
  })

  export const loading = (loader: boolean) => ({
    type: LOGIN_LOADING,
    payload: loader
  });
  