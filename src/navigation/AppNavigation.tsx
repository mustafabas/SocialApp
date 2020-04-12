import React from "react";
import {
  
  createAppContainer,
  createSwitchNavigator,
} from "react-navigation";
import {createStackNavigator} from  'react-navigation-stack'
import { Dimensions } from "react-native";
import {createDrawerNavigator} from 'react-navigation-drawer'
const { width } = Dimensions.get("window");

import Home from "../screens/AppScreens/Home";
import Blank from "../screens/AppScreens/Blank";
import SideBar from "../screens/AppScreens/SideBar";
import Login from "../screens/AuthScreens/Login";
import AuthLoading from "../screens/AuthLoading";
import SignUpScreen from '../screens/AuthScreens/SignUp/SignUpScreen'
import {createBottomTabNavigator} from 'react-navigation-tabs'
import { Icon } from "native-base";
import MessageScreen from "../screens/AppScreens/Group/MessageScreen";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import navigationTopBar from "../screens/AppScreens/Group/navigationTopBar";
import GroupInfoScreen from "../screens/AppScreens/Group/GroupInfoScreen";
import NotificationScreen from "../screens/AppScreens/Notification/NotificationScreen";
import createPostScreen from "../screens/AppScreens/Home/createPostScreen";
import ProfilePhotoScreen from "../screens/AuthScreens/SignUp/ProfilePhotoScreen";


const MainStack = createStackNavigator(
  {
    Home: { screen: Home },
    Message: { screen: MessageScreen },
    createPost : createPostScreen
  },
  {
    initialRouteName: "Home",
    // headerMode: "none"
    navigationOptions : {
      tabBarLabel : 'Anasayfa'
    }
    
  }
);
const MessageStack = createStackNavigator(
  {
    Message: { screen: MessageScreen },
    GroupInfo : GroupInfoScreen
  },
  {
    initialRouteName: "Message",
    // headerMode: "none"
    navigationOptions : {
      tabBarLabel : 'Message'
    }
    
  }
);




const AuthStack = createStackNavigator(
  {
    Login: { screen: Login },
    SignUp : SignUpScreen,
    ProfilePhoto : ProfilePhotoScreen
  },
  {
    initialRouteName: "ProfilePhoto",
    headerMode: "none"
  }
);
const NotificationStack = createStackNavigator({
  Notification : NotificationScreen
})


const mainBottomTab = createBottomTabNavigator({
  MainStack : MainStack,
  // MainStack1 : MessageStack,
  navigationTopBar : navigationTopBar,
  Notification : NotificationStack

},
{
  keyboardHidesNavigationBar: false,
  defaultNavigationOptions: ({ navigation }) => ({

    tabBarIcon: ({ focused, horizontal, tintColor }) => {
      const { routeName } = navigation.state;
      let iconName="";
      if (routeName === 'MainStack') {

        iconName = `home${focused ? "" : "-outline"}`;
        // Sometimes we want to add badges to some icons.
        // You can check the implementation below.
      }
      else if (routeName === 'MainStack1') {

        iconName = `home${focused ? "" : "-outline"}`;
        // Sometimes we want to add badges to some icons.
        // You can check the implementation below.
      }
      // else if (routeName === 'UserInfo') {
      //   iconName = `account${focused ? '' : '-outline'}`;
      // }
      // else if (routeName === 'cart') {
      //   iconName = `cart${focused ? '' : '-outline'}`;

      // }
      // else if ( routeName === 'myCourse') {
      //   iconName = `heart${focused ? '' : '-outline'}`;
      // }

      // You can return any component that you like here!
      return <Icon name={iconName} type="Entypo" style={{color:tintColor}}  color={tintColor} />;
    },
  
    
  }),
  tabBarOptions: {
    style : { shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,borderTopWidth:0},
    activeTintColor: '#e83537',
    inactiveTintColor: '#000',
  },
}
);



export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoading,
      AuthStack: AuthStack,
      AppStack: MainStack,
      mainBottom : mainBottomTab
    },
    {
      initialRouteName: "AuthLoading",
     
    }
    
  ),
 
);
