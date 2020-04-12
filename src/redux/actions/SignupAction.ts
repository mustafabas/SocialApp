
import { Dispatch } from "redux";
import { fetchImageService } from "../services/user";
import { LOGIN_LOADING, SIGNUP_LOADING, PROFIL_PHOTO_LOADING } from "../../constants/actionConstants";
import { showSimpleMessage } from "../../components/showMessage";
// import  axios from "../services/axiosBase";
import { API_SIGN_UP, API_UPLOAD_PROFILE_PHOTO } from "../../constants/apiConstants";
import { LoginWithPhone } from "./loginAction";
import { strings, errorMessages } from "../../constants/Localizations";
import NavigationService from "../services/NavigationService";
import axios from 'axios'


export interface UserSignUp  {
    email: string;
    name: string;
    password: string;
    phoneNumber: string;
    photoPath: string;
    userName: string;
}


export function uploadProfilePhoto (avatarSource : any,username:string,password:string) {
  return (dispatch: any) => {
    dispatch(loadingProfilPhoto(true));

//     const formData = new FormData();
// formData.append('Note', {
//                      uri: "file://" //Your Image File Path
//                     type: 'image/jpeg', 
//                     name: "imagename.jpg",
//                   });
let formDataPayload = new FormData();
//IMPORTANT !!!!! this picture element form needs 3 parameters !!!!! : URL, NAME and TYPE
formDataPayload.append('file', {
  uri: avatarSource.uri,
  name: avatarSource.name,
  type: 'image/jpeg',
});
formDataPayload.append('userId',1)

    axios.post("http://sapi.fillsoftware.com/socialapp" + API_UPLOAD_PROFILE_PHOTO ,{
      file : formDataPayload,
    },{
      headers: {
        // 'Accept':'text/plain',
        'Content-Type': 'multipart/form-data',
    }
    }).then(res=> {
      console.log(res)
      dispatch(loadingProfilPhoto(false));
            if(res.data.isSuccess) {
              console.log(res,"photores")
              // NavigationService.navigate('ProfilePhoto',{username :})
              // dispatch(LoginWithPhone(user.userName,user.password));
              
            }else {
                 
        let message = res.data.message
        let errorMessage = errorMessages.find(e => e.key === message)?.value 
        if(errorMessage){
          showSimpleMessage(errorMessage,"danger")
        }
            }
    }).catch(e => {
      console.log(e)
      // console.log(x)
      dispatch(loadingProfilPhoto(false));
      showSimpleMessage(strings.generalError,"danger")

    })

  };
}

export function SignUp(user : UserSignUp) {
    return (dispatch: any) => {
      dispatch(loading(true));
      axios().post(API_SIGN_UP,{
        email: user.email,
        name: user.name,
        password: user.password,
        phoneNumber: user.phoneNumber,
        photoPath: user.photoPath,
        userName: user.userName
      }).then(res=> {
        dispatch(loading(false));
              if(res.data.isSuccess) {
                NavigationService.navigate('ProfilePhoto',{username:user.userName,password:user.password})
                // dispatch(LoginWithPhone(user.userName,user.password));
                
              }else {
                   
          let message = res.data.message
          let errorMessage = errorMessages.find(e => e.key === message)?.value 
          if(errorMessage){
            showSimpleMessage(errorMessage,"danger")
          }
              }
      }).catch(e => {
        dispatch(loading(false));
        showSimpleMessage(strings.generalError,"danger")

      })

    };
  }




  export const loading = (loader: boolean) => ({
    type: SIGNUP_LOADING,
    payload: loader
  });

  export const loadingProfilPhoto = (loader: boolean) => ({
    type: PROFIL_PHOTO_LOADING,
    payload: loader
  });
  
  