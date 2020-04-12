import React, { Component } from "react";
import { View, FlatList, ActivityIndicator,Button,Text, Image} from "react-native";
import { NavigationScreenProp, NavigationState, SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import { Header } from "../../../components";
import styles from "../styles";
import { AvatarItem } from "../../../components";
import { logoutUserService } from "../../../redux/services/user";
import {Thumbnail,Icon, Spinner} from 'native-base'
import {
  fetchImageData,
  fetchMoreImageData
} from "../../../redux/actions/fetch";
import { TouchableOpacity, ScrollView } from "react-native-gesture-handler";
import { showMessage } from "react-native-flash-message";
import { colors, fonts, sizes } from "../../../constants";
import { strings } from "../../../constants/Localizations";
import { IPOST, getPostByLocations } from "../../../redux/actions/postActions";
import { AppState } from "../../../redux/store";
import moment from 'moment'
interface Props {
  navigation: NavigationScreenProp<NavigationState>;
  getPostByLocations : (lat : number, long:number) => void;
  loading: boolean;
  posts : IPOST[];
  lat : number;
  long : number;
}



interface State {

}

class Home extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {
    this.props.getPostByLocations(this.props.lat,this.props.long)
  }



  static navigationOptions = ({navigation }) => {

   return {
    title: strings.homeScreen,
    headerStyle: {
      borderBottomWidth: 0,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.12,
      shadowRadius: 2.46,
      elevation: 9,
  },
  headerBackTitleVisible:false,
  headerRight: 
  <TouchableOpacity onPress={()=> navigation.navigate('createPost')}
  style={{marginRight:10}}>
    <Icon name="add-circle-outline" style={{color:colors.icon}} type="MaterialIcons" />
 
  </TouchableOpacity>

   }
   
   

  };
  convertToDate(ts){
      return moment(ts).fromNow();

  }

  renderItems(item : IPOST){
    return (
      <View style={{margin:10,marginLeft:20,borderColor:"#E5E5E5",padding:10,borderRadius:5,
      backgroundColor:colors.containerBg,
    shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.32,
      shadowRadius: 2.46,
      elevation: 9,
      }}>
        <View style={{flexDirection:'row',justifyContent:'space-between'}}>

        <View style={{flexDirection:'row'}}>
        <Image
        style={{width:40,height:40,borderRadius:20,marginLeft:-25,marginTop:-10}}
          source={{uri: 'https://eksiup.com/images/11/61/a8z9lfcBHWt06YDOVP.jpg'}}
        />
        <View style={{marginLeft:10,marginTop:-5}}>
          <Text style={{fontFamily:fonts.primary,fontWeight:'700'}}>{item.user_name}</Text>
    <Text style={{fontFamily:fonts.primary,color:colors.textColorLigther,fontSize:sizes.small}}>{this.convertToDate(item.created_date)}</Text>
        </View>
        </View>
        <TouchableOpacity onPress={()=> this.props.navigation.navigate('Message')} style={{marginTop:-5,opacity:.2}}>
          <Icon style={{color:colors.textColorLigther}} name="ios-chatbubbles" />
        </TouchableOpacity>

        </View>
        <View>
        <Text style={{marginTop:20 ,color:colors.textColorInnder,fontFamily:fonts.primary}}>
         {item.title}
        </Text>
        </View>
        
      </View>
    )
  }
  renderContent(){
    if(this.props.loading){
      return(
        <Spinner />
      )
    }else {
      return (
        <View>
          <FlatList
        data={this.props.posts}
        renderItem={({ item }) => (
            this.renderItems(item)
        )}
        keyExtractor={item => item.id}
        // extraData={selected}
      />
        </View>
      )
    }
  }

  render() {
    return (
      <View style={styles.container}>
         <ScrollView  >
        {this.renderContent()}

         </ScrollView>


      </View>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
 loading : state.posts.loading,
 posts : state.posts.posts,
 lat : state.location.lat,
 long : state.location.long
});

function bindToAction(dispatch: any) {
  return {
    getPostByLocations : (lat : number, long:number) =>
      dispatch(getPostByLocations(lat,long))

  };
}

export default connect(
  mapStateToProps,
  bindToAction
)(Home);
