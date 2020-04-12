import React, { Component } from "react";
import { SafeAreaView } from "react-navigation";
import { Provider } from "react-redux";
import {View} from 'react-native'
import AppContainer from "./src/navigation/AppNavigation";
import configureStore from "./src/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import FlashMessage from "react-native-flash-message";
import NavigationService from "./src/redux/services/NavigationService";
import { Root } from "native-base";

export default class App extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Provider store={configureStore().store}>
          <PersistGate loading={null} persistor={configureStore().persistor}>
          <Root>
  
            <AppContainer ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}
        />

  </Root>
          </PersistGate>
        </Provider>
        <FlashMessage style={{marginBottom:30,marginHorizontal:20,borderRadius:5,opacity:.8}} position="bottom" animated={true} />
      </View>
    );
  }
}
