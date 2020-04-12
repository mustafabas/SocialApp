import React from "react";
import {
  ActivityIndicator,

  StatusBar,
  StyleSheet,
  View,
  Alert,
  Linking
} from "react-native";
import { NavigationScreenProp, NavigationState } from "react-navigation";
import AsyncStorage from "@react-native-community/async-storage";
import Geolocation from '@react-native-community/geolocation';
import { openSettings } from 'react-native-permissions';
import { connect } from "react-redux";
import { locationUpdate, LoginWithPhone } from "../../redux/actions/loginAction";
import { AppState } from "../../redux/store";
import axios from '../../redux/services/axiosBase'
interface Props {
  navigation: NavigationScreenProp<NavigationState>;
  locationUpdate : (lat : number, long:number,userId: number) => void;
  lat : string;
  long : string;
}

class AuthLoading extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
    this._bootstrapAsync();


  }

  _bootstrapAsync = async () => {
   
    console.log("bootstrap")
    const { navigation } = this.props;
    const userToken = await AsyncStorage.getItem("userToken");
    const userId = await AsyncStorage.getItem("userId");
    const username = await AsyncStorage.getItem("username");
    global.AUTH_TOKEN = userToken;
    global.USER_ID = userId;
    global.USERNAME = username;
    console.log("global token ")
    console.log(global.AUTH_TOKEN,"GLOBAL TOKEN")
    // axios.defaults.headers['Authorization'] = `Bearer ${global.AUTH_TOKEN}`;

    if(userToken) {
      this.getCurrentLocation();
      navigation.navigate("mainBottom");
    }else {
      navigation.navigate("AuthStack");
    }
  };

  getCurrentLocation() {
    Geolocation.getCurrentPosition(
      position => {
        let lat = position.coords.latitude
        let userId = global.USER_ID;

        this.props.locationUpdate(position.coords.latitude,position.coords.longitude,userId);

      },
      error => Alert.alert(
        'Alert Title',
        'My Alert Msg',
        [
          {text: 'Ask me later', onPress: () => { 
          // openSettings();
          error
      }}
        ],
        { cancelable: false }
      ),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
    this.watchID = Geolocation.watchPosition(position => {
      this.props.locationUpdate(position.coords.latitude,position.coords.longitude,global.USER_ID);

    });
  }

  render() {

    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }
}





const mapStateToProps = (state: AppState) => ({
  lat : state.location.lat,
  long : state.location.long
 });
 
 function bindToAction(dispatch: any) {
   return {
    locationUpdate : (lat : number, long:number,userId: number) =>
     dispatch( locationUpdate(lat,long,userId))
   };
 }
 
 export default connect(
   mapStateToProps,
   bindToAction
 )(AuthLoading);
 

 


