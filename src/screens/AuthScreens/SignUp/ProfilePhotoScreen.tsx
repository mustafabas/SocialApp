import React, { Component, useState, useRef } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Image
} from "react-native";
import { NavigationScreenProp, NavigationState, SafeAreaView } from "react-navigation";
import { Formik } from "formik";
import * as Yup from "yup";
// import Icon from "react-native-vector-icons/SimpleLineIcons";
import { loginUserService } from "../../../redux/services/user";
import { Input, Button, ButtonSecondary } from "../../../components";
import styles from "../Login/styles";
import { strings } from "../../../constants/Localizations";
import { showMessage } from "react-native-flash-message";
import { fonts, colors, sizes } from "../../../constants";
import { TextInputMask } from 'react-native-masked-text'
import { Icon, Spinner, ActionSheet } from "native-base";
import PhoneInput from 'react-native-phone-input'

import CountryPicker from 'react-native-country-picker-modal'
import { connect } from "react-redux";
import { SignUp, UserSignUp, uploadProfilePhoto } from "../../../redux/actions/SignupAction";
import { AppState } from "../../../redux/store";
import { showSimpleMessage } from "../../../components/showMessage";
import { TouchableOpacity } from "react-native-gesture-handler";
// import ImagePicker from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
// import { TextInputPhone } from "../../../components/TextInputPhone";
import ImageResizer from 'react-native-image-resizer';


interface Props {
  navigation: NavigationScreenProp<NavigationState>;
  uploadProfilePhoto : (avatarSource : any,username:string,password:string) => void;
  loading : boolean;
}




interface State {
    profilFormData : any | null

}



const PHOTO_SIZE = 200
class ProfilePhotoScreen extends Component<Props, State> {


  constructor(props) {
    super(props);

    this.state = {
        profilFormData  : null

    }
  }








  renderInside() {
    if(this.state.loadingImage) {
      return (
        <Spinner color={colors.icon} size="small" />
      )
 
    }else if (this.state.avatarSource) {
       return(
         <Image source={this.state.avatarSource} style={{flex:1,width:PHOTO_SIZE,height:PHOTO_SIZE,borderRadius:PHOTO_SIZE/2}} width={PHOTO_SIZE} height={PHOTO_SIZE}  /> 
       )
    } else {
    return(
    <Icon name="ios-add" style={{fontSize:PHOTO_SIZE/3,color:colors.inputIcon,alignSelf:'center'}} />)}
   }
 
   renderActionSheet() {
    var BUTTONS = [strings.takePhoto, strings.chooseFromLibrary,strings.cancel];
var CANCEL_INDEX = 2;

      ActionSheet.show(
        {
          options: BUTTONS,
          cancelButtonIndex: CANCEL_INDEX,
          // destructiveButtonIndex: DESTRUCTIVE_INDEX,
          title: strings.selectPhoto
        },
        buttonIndex => {
         

          if(buttonIndex === 0) {
            this.setState({loadingImage : true});
             ImagePicker.openCamera({
              width: 300,
              height: 300,
              cropping: true,
            }).then(image => {

              ImageResizer.createResizedImage(image.path, 300, 300, 'JPEG',100)
  .then(response => {
    // response.uri is the URI of the new image that can now be displayed, uploaded...
    // response.path is the path of the new image
    // response.name is the name of the new image with the extension
    // response.size is the size of the new image

    const dataNew  = {
                         uri: response.uri ,//Your Image File Path
                        type: 'image/jpeg', 
                        name: response.name,
                      };


    this.setState({avatarSource :{uri: response.uri, width: 300, height: 300},loadingImage :false,profilFormData:dataNew},()=>console.log(image))
  })
  .catch(err => {
    // Oops, something went wrong. Check that the filename is correct and
    // inspect err to get more details.
  });
             
            }).catch(()=> {
                this.setState({loadingImage : false});
            });
          }else if (buttonIndex === 1) {
            this.setState({loadingImage : true});
              ImagePicker.openPicker({
              width: 300,
              height: 300,
              cropping: true
            }).then(image => {
              ImageResizer.createResizedImage(image.path, 300, 300, 'JPEG',100)
  .then(response => {
    // response.uri is the URI of the new image that can now be displayed, uploaded...
    // response.path is the path of the new image
    // response.name is the name of the new image with the extension
    // response.size is the size of the new image
  

        const data = {
                         uri: Platform.OS === 'android' ? response.uri : response.uri.replace('file://', '') ,//Your Image File Path
                        type: 'image/jpeg', 
                        name: response.name,
                      };
                      

    this.setState({avatarSource :{uri: response.uri, width: 300, height: 300},loadingImage :false,profilFormData:data},()=>console.log(image))
  })
  .catch(err => {
    // Oops, something went wrong. Check that the filename is correct and
    // inspect err to get more details.
  });
            }).catch(()=>{
                this.setState({loadingImage : false});
            });
          }
        }
      )}
      
uploadPhoto(){
    if(this.state.profilFormData) {
        let username = this.props.navigation.getParam('username');
        let password = this.props.navigation.getParam("password");
        this.props.uploadProfilePhoto(this.state.profilFormData,username,password)
    }
    else {
        
        showSimpleMessage(strings.ProfilPhotoNullErr,"danger");

    }

}
  render() {
      
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView bounces={false}>
            <View style={[styles.headStyle]}>
              <Text style={styles.headText}>{strings.ProfilePhoto}</Text>
              <TouchableOpacity  
    onPress={ ()=> this.renderActionSheet()}
    style={{width:PHOTO_SIZE,height:PHOTO_SIZE,backgroundColor:colors.borderColorWhiter,marginTop:20,borderRadius:PHOTO_SIZE/2,justifyContent:'center',alignSelf:'center',marginBottom:5,
    shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.12,
        shadowRadius: 2.46,
        elevation: 9,}} >
     
       {this.renderInside()}
    </TouchableOpacity>
   
  
            </View>
            <View style={[styles.inputContainer,{marginTop:10}]}>
    <Button loading={this.state.loadingImage || this.props.loading} text={strings.finish} onPress={()=> this.uploadPhoto()} />
    </View>

               
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  loading: state.signUp.loadingProfilePhoto
});

function bindToAction(dispatch: any) {
  return {
    uploadProfilePhoto : (avatarSource : any,username:string,password:string) => 
        dispatch(uploadProfilePhoto(avatarSource,username,password))
  };
}
export default connect(
  mapStateToProps,
  bindToAction
)(ProfilePhotoScreen);


