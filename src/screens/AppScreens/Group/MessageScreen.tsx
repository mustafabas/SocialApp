import React, { Component ,useEffect} from "react";
import { View, FlatList, ActivityIndicator,Button,Text, Image, ImageBackground, KeyboardAvoidingView, TextInput, Platform,Keyboard, Animated} from "react-native";
import { NavigationScreenProp, NavigationState, SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
// import { Header } from "../../../components";
import styles from "../styles";
import { AvatarItem } from "../../../components";
import { logoutUserService } from "../../../redux/services/user";
import {Thumbnail,Icon, Input, Textarea, Spinner, ActionSheet} from 'native-base'

import { TouchableOpacity, ScrollView } from "react-native-gesture-handler";
import { showMessage } from "react-native-flash-message";
import { colors, fonts, sizes } from "../../../constants";
import { strings } from "../../../constants/Localizations";

import { Header } from 'react-navigation-stack';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { SocketServices } from "../../../redux/services/SocketServices";
import SockJsClient from "react-stomp";
import { UpdateMessages } from "../../../redux/actions/MessageActions";
import { AppState } from "../../../redux/store";

interface Props {
  navigation: NavigationScreenProp<NavigationState>;
  UpdateMessages : (message : IMessage) => void;
  imageData: any;
  loading: boolean;
  messages : IMessage[];
}


export interface IMessage {
content:string;
sender: string;
type: string;
isSenderMe : boolean;
isSend : boolean;
}


interface State {
  content : string;
  clientConnected : boolean;
}

class MessageScreen extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      content : "",
      clientConnected:false
      
    };
    this.keyboardHeight = new Animated.Value(0);

 
  }

  componentDidMount() {
  //  let socket =  new SocketServices(43,"Bilalmarifet2020")
  }

  onMessageReceive = (msg : IMessage, topic : string) => {
    if(msg.sender !== global.USERNAME){
      msg.isSenderMe = false;
      msg.isSend = false;
      console.log("received",msg)
      this.props.UpdateMessages(msg)
    }else {
      msg.isSenderMe = true;
      msg.isSend = true;
      //if is send true in dispatch update only is send info
      console.log("received",msg)
      this.props.UpdateMessages(msg)
    }
  }

  sendMessage = () => {
    if(this.state.content.length > 0) {
      var message : IMessage = ({ 
          content : this.state.content,
            isSend : false,
          isSenderMe : true,
          sender : global.USERNAME,
            type : 'CHAT'
      });
      

      this.props.UpdateMessages(message);
      var topic = `/chat-app/chat/43`
    var chatMessage = {
      sender: global.USERNAME,
      content: this.state.content,
      type: 'CHAT'
  };

  this.setState({content:""})
    try {
      this.clientRef.sendMessage(`${topic}/sendMessage`, JSON.stringify(chatMessage));
      console.log(true)
      return true;
    } catch(e) {
      console.log(e)
      return false;
    }
    }

  }





  static navigationOptions = ({navigation }) => {

   return {

  //   headerStyle: {
  //     borderBottomWidth: 0,
  //     shadowColor: "#000",
  //     shadowOffset: {
  //       width: 0,
  //       height: 2,
  //     },
  //     shadowOpacity: 0.12,
  //     shadowRadius: 2.46,
  //     elevation: 9,
  // },
  // headerTitleStyle: {
  //   fontWeight: 'bold',
  // },
  header: null, 
  // headerLeft : <TouchableOpacity onPress={()=>navigation.goBack()}><Icon name="ios-arrow-back" style={{color:colors.icon,marginLeft:10}}/></TouchableOpacity>,
  // headerTitle : <View style={{position:'absolute',left:-30,flexDirection:'row'}}>
  //    <View style={{width:35,height:35,backgroundColor:colors.borderColorWhiter,justifyContent:'center',alignItems:'center',borderRadius:17.5}}>
  //   <Image
  //       style={{width:30,height:30,borderRadius:15}}
  //         source={{uri: 'https://eksiup.com/images/11/61/a8z9lfcBHWt06YDOVP.jpg'}}
  //       />
  //   </View>
  //   <View style={{width:35,height:35,backgroundColor:colors.borderColorWhiter,justifyContent:'center',alignItems:'center',borderRadius:17.5,marginLeft:-15}}>
  //   <Image
  //       style={{width:30,height:30,borderRadius:15}}
  //         source={{uri: 'https://eksiup.com/images/11/61/a8z9lfcBHWt06YDOVP.jpg'}}
  //       />
  //   </View>
  //   <View style={{width:35,height:35,backgroundColor:colors.borderColorWhiter,justifyContent:'center',alignItems:'center',borderRadius:17.5,marginLeft:-15}}>
  //   <Image
  //       style={{width:30,height:30,borderRadius:15}}
  //         source={{uri: 'https://eksiup.com/images/11/61/a8z9lfcBHWt06YDOVP.jpg'}}
  //       />
  //   </View>
  //   <View style={{marginLeft:5}}>
  //     <Text style={{fontFamily:fonts.primary,color:colors.textColorInnder}}>Easter Party</Text>
  //     <Text style={{fontFamily:fonts.primary,color:colors.textColorLigther,fontSize:sizes.small}}>You,Median,Micheal</Text>
  //   </View>
  // </View>
//   headerRight: 
//   <TouchableOpacity
//   style={{marginRight:10}}>
//     <Icon name="add-circle-outline" style={{color:colors.icon}} type="MaterialIcons" />
 
//   </TouchableOpacity>

   }
   
   

  };

  componentWillMount () {
    this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
    this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
  }
  componentWillUnmount() {
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
  }


  keyboardWillShow = (event) => {

      Animated.spring(this.keyboardHeight, {
        // duration: event.duration,
        toValue: event.endCoordinates.height,

      }).start();
     

  };

  keyboardWillHide = (event) => {

      Animated.spring(this.keyboardHeight, {
        // duration: event.duration,
        toValue: 0,
      }).start()
   
  };


  renderItems(item : IMessage){
    if(item.isSenderMe) {
    return(
      <View style={{width:'80%',alignSelf:'flex-end',backgroundColor:colors.secondary,padding:10,borderRadius:5,marginTop:0,marginRight:5,borderBottomRightRadius:0,marginBottom:10}}>
      <Text style={{color:'white'}}>{item.content}</Text>
    <Text style={{position:'absolute',right:0,bottom:0,padding:5,fontFamily:fonts.primary,color:'white',opacity:.95,fontSize:sizes.small}}>{item.isSend ? "Gönderildi"  : ""}</Text>

      </View>
   
    )
    }
else {
return (
<View style={{width:'80%',backgroundColor:colors.primary,padding:10,borderRadius:5,marginTop:0,marginLeft:5,borderBottomLeftRadius:0,marginBottom:10}}>
<Text style={{color:'white',fontFamily:fonts.primary,fontWeight:"600",fontSize:sizes.medium}}>{item.sender}</Text>
            <Text style={{color:'white'}}>{item.content}</Text>
            <Text style={{position:'absolute',right:0,bottom:0,padding:5,fontFamily:fonts.primary,color:'white',opacity:.95,fontSize:sizes.small}}>19.35</Text>
            </View>
)
}
      
   
  }

  renderHeader(){
    return(
      <View style={{flexDirection:'row',height:44,paddingTop:5,shadowColor: "#000",backgroundColor:'white',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.12,
      shadowRadius: 2.46,
      elevation: 9,}}>
            <TouchableOpacity onPress={()=>this.props.navigation.goBack()}><Icon name="ios-arrow-back" style={{color:colors.icon,marginLeft:10,marginRight:10}}/></TouchableOpacity>
     <TouchableOpacity onPress={()=> this.props.navigation.navigate('GroupInfo')} style={{flexDirection:'row'}}>
     <View style={{width:35,height:35,backgroundColor:colors.borderColorWhiter,justifyContent:'center',alignItems:'center',borderRadius:17.5}}>
    <Image
        style={{width:30,height:30,borderRadius:15}}
          source={{uri: 'https://eksiup.com/images/11/61/a8z9lfcBHWt06YDOVP.jpg'}}
        />
    </View>
    <View style={{width:35,height:35,backgroundColor:colors.borderColorWhiter,justifyContent:'center',alignItems:'center',borderRadius:17.5,marginLeft:-15}}>
    <Image
        style={{width:30,height:30,borderRadius:15}}
          source={{uri: 'https://eksiup.com/images/11/61/a8z9lfcBHWt06YDOVP.jpg'}}
        />
    </View>
    <View style={{width:35,height:35,backgroundColor:colors.borderColorWhiter,justifyContent:'center',alignItems:'center',borderRadius:17.5,marginLeft:-15}}>
    <Image
        style={{width:30,height:30,borderRadius:15}}
          source={{uri: 'https://eksiup.com/images/11/61/a8z9lfcBHWt06YDOVP.jpg'}}
        />
    </View>
    <View style={{marginLeft:5}}>
      <Text style={{fontFamily:fonts.primary,color:colors.textColorInnder}}>Easter Party</Text>
      <Text style={{fontFamily:fonts.primary,color:colors.textColorLigther,fontSize:sizes.small}}>You,Median,Micheal</Text>
    </View>
     </TouchableOpacity>
  </View>

    )
  }
  renderActionSheet() {
    var BUTTONS = ["Option 0", "Option 1", "Option 2", "Delete", "Cancel"];
var DESTRUCTIVE_INDEX = 3;
var CANCEL_INDEX = 4;

      ActionSheet.show(
        {
          options: BUTTONS,
          cancelButtonIndex: CANCEL_INDEX,
          destructiveButtonIndex: DESTRUCTIVE_INDEX,
          title: "Testing ActionSheet"
        },
        buttonIndex => {
          this.setState({ clicked: BUTTONS[buttonIndex] });
        }
      )}

  renderInput(){
    return(
      <View>
        <View style={{height:30,backgroundColor:"green",opacity:.1,position:'absolute',left:0,right:0,bottom:60}}></View>
        <View style={{backgroundColor:colors.inputBg,padding:10,paddingLeft:5,flexDirection:'row',alignItems:'center'}}>
        <TouchableOpacity onPress={()=> this.renderActionSheet()} style={{marginRight:5}}>
          <Icon  name="ios-add-circle" style={{color:colors.inputIcon}} />
        </TouchableOpacity>
        <Input  autoCorrect={false} multiline
         onChangeText={(value) => this.setState({content: value})}
         value={this.state.content}
         placeholder="Write a comment" placeholderTextColor={colors.borderColorWhiter} 
         style={{backgroundColor:colors.inputInnerBg,color:'white',borderRadius:20,fontFamily:fonts.primary,fontSize:sizes.medium,paddingLeft:15,alignSelf:'center',minHeight:40,paddingTop:10,paddingBottom:10}} 
         onFocus={this.props.messages && this.props.messages.length > 0 ? ()=>this.scrollView.scrollToEnd({duration: 5000, animated: true}) : null}
         />
        <TouchableOpacity disabled={!this.state.clientConnected} onPress={()=> this.sendMessage()}
         style={{backgroundColor:colors.inputIcon,height:35,width:35,justifyContent:'center',alignItems:'center',borderRadius:17.5,marginLeft:5}}>
        {this.state.clientConnected ? <Icon name="send" type="Feather" style={{fontSize:sizes.big,color:'white',marginLeft:-4,marginTop:2}} /> : <Spinner size="small" color="white" />}
      </TouchableOpacity>
      </View>
      </View>
      
    )
  }
  renderSendIcon() {
    return (
      <TouchableOpacity>
        <Icon name="send" type="Feather" />
      </TouchableOpacity>
    )
  }
  render() {

    return (
      <SafeAreaView style={styles.container} forceInset={{bottom:'never'}}>
   
   <SockJsClient url={ "http://sapi.fillsoftware.com/socialapp/sock" } topics={[`/chat-room/43`]}
          onMessage={ this.onMessageReceive} ref={ (client) => { this.clientRef = client }}
          onConnect={ (e) => { this.setState({ clientConnected: true }) } }
          onDisconnect={ () => { this.setState({ clientConnected: false }) } }
          debug={ true }/>
       
        {this.renderHeader()}
       

        {/* <KeyboardAvoidingView 
         style={{flex:1}} behavior={Platform.OS === 'ios' ? "height" : "padding"}>
  */}

 <Animated.View style={ { flex:1,paddingBottom: this.keyboardHeight }}>
<ScrollView

onContentSizeChange={()=>this.scrollView.scrollToEnd({duration: 5000, animated: true})}
ref={(ref) => { this.scrollView = ref; }}
keyboardDismissMode = "on-drag"
 contentContainerStyle={{paddingTop:20}} showsVerticalScrollIndicator={false}>

<FlatList
        // initialNumToRender={5}
        // inverted
        data={this.props.messages}
        renderItem={({ item }) => (
            this.renderItems(item)
        )}
        // keyExtractor={item => item.id}
        // extraData={selected}
      />


</ScrollView>

{/* 

<View style={{backgroundColor:colors.accent,height:50,position:'absolute',bottom:60,left:0,right:0}}>
<View style={{height:50,opacity:.2,backgroundColor:'white',borderRadius:20}}> */}

{/* </View>
</View> */}

{this.renderInput()}
</Animated.View>



       




{/* </KeyboardAvoidingView> */}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  messages : state.message.messages
});

function bindToAction(dispatch: any) {
  return {
    UpdateMessages : (message : IMessage) => 
      dispatch(UpdateMessages(message))
  };
}

export default connect(
  mapStateToProps,
  bindToAction
)(MessageScreen);
