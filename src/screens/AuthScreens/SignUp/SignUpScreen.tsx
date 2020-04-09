import React, { Component, useState, useRef } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Platform
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
import { Icon } from "native-base";
import PhoneInput from 'react-native-phone-input'

import CountryPicker from 'react-native-country-picker-modal'
import { connect } from "react-redux";
import { SignUp, UserSignUp } from "../../../redux/actions/SignupAction";
import { AppState } from "../../../redux/store";
import { showSimpleMessage } from "../../../components/showMessage";
// import { TextInputPhone } from "../../../components/TextInputPhone";


interface Props {
  navigation: NavigationScreenProp<NavigationState>;
  SignUp: (user: UserSignUp) => void;
}
interface userData {
  username: string;
  firstName: string;
  lastName: string;
  password: string;
}

const loginSchema = Yup.object().shape({
  
  password: Yup.string()
    .min(6, strings.passwordErrorMin)
    .required(strings.passwordErrorNull),
  username: Yup.string()
    .min(6, strings.usernameErrorMin)
    .required(strings.usernameErrorNull),
  firstName: Yup.string()
    .required(strings.firstnameErrorNull),
  lastName: Yup.string()
    .required(strings.lastNameErrorNull)


});



interface State {
  international: string;
      countryModalOpen: boolean;
      isPhoneNumberWrong: boolean;
      cca2 : string;
}




class SignUpScreen extends Component<Props, State> {


  constructor(props) {
    super(props);

    this.state = {

      international: "",
      countryModalOpen: false,
      isPhoneNumberWrong: false,
      cca2 : "90"
    };

    this.renderFlag = this.renderFlag.bind(this);
  }

  handleSignUp(values: userData) {
    if(this.state.international.length != 16) {
      this.setState({isPhoneNumberWrong : true})
    }else {
      console.log(this.state.international)
      let phoneNumber = "+" + this.state.cca2  +this.state.international.replace(" - ", "").replace(" - " , "");
      const user : UserSignUp =  {
        userName : values.username,
        name : values.firstName + " " + values.lastName,
        email : "",
        phoneNumber : phoneNumber,
        password : values.password,
        photoPath : "",
      }

      this.props.SignUp(user);

    }
   
  }

  onPressFlag() {
    this.setState({ countryModalOpen: true })
  }

  componentDidMount() {
    this.phone.selectCountry("tr");
    this.setState({ cca2: "90" })
  }

  selectCountry(country) {

    console.log(country)
    this.phone.selectCountry(country.cca2.toLowerCase())
    this.setState({ cca2: country.callingCode, countryModalOpen: false })
  }

  renderFlag() {
    return (
      <View style={{ flexDirection: 'row' }}>
        <Text style={{ marginRight: 5 }}>
          {this.state.cca2 ? "+" : null}{this.state.cca2}
        </Text>
        <TextInputMask
          style={{ flex: 1}}
          ref={(ref) => this.cpfField = ref}
          keyboardType="number-pad"
          placeholder="555 - 555 - 5555"
          type={'custom'}
          options={{
            /**
            * mask: (String | required | default '')
            * the mask pattern
            * 9 - accept digit.
            * A - accept alpha.
            * S - accept alphanumeric.
            * * - accept all, EXCEPT white space.
            */
            mask: '999 - 999 - 9999'
          }}
          onBlur={() => this.state.international.length < 16 ? this.setState({ isPhoneNumberWrong: true }) : this.setState({ isPhoneNumberWrong: false })}
          value={this.state.international}
          onChangeText={text => {
            this.setState({
              international: text
            })
            if (text.length > 15 && this.state.isPhoneNumberWrong) {
              this.setState({ isPhoneNumberWrong: false })
            }
          }}
        />
      </View>
    )
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView bounces={false}>
            <View style={styles.headStyle}>
              <Text style={styles.headText}>{strings.SignUp}</Text>

            </View>
            <Formik

              initialValues={{ username: "", firstName: "", lastName: "", phoneNumber: "",password:""}}
              validationSchema={loginSchema}
              onSubmit={values => this.handleSignUp(values)}
            >
              {props => {
                console.log(this.cpfField ? this.cpfField.getRawValue() : "")
                console.log(this.cpfField ? this.cpfField._inputElement._onBlur : null)
                return (
                  <View >

                    <View style={[styles.inputContainer, { padding: 20 }]}>
                      <Input
                        placeholder={strings.username}
                        value={props.values.username}
                        onChangeText={e => {
                          props.setFieldValue('username',e.replace(/\W+/g, '_')); 
                        }}
                        onBlur={props.handleBlur("username")}
                        error={props.touched.username && props.errors.username}
                      />
                      {props.touched.username && props.errors.username &&
                        <View style={{ flexDirection: 'row' }}>
                          <Icon name="info" type="MaterialIcons" style={{ color: colors.accent, fontSize: sizes.iconSmall }} />
                          <Text style={{ fontFamily: fonts.primary, color: colors.accent, marginLeft: 5, fontSize: sizes.small }}>
                            {props.errors.username}</Text>
                        </View>
                      }
                      <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between' }}>
                        <View style={{ flex: .49 }}>
                          <Input
                            // style={{flex:.45}}
                            placeholder={strings.firstName}
                            value={props.values.firstName}
                            onChangeText={props.handleChange("firstName")}
                            onBlur={props.handleBlur("firstName")}
                            error={props.touched.firstName && props.errors.firstName}
                          />
                          {props.touched.firstName && props.errors.firstName &&
                            <View style={{ flexDirection: 'row' }}>

                              <Text style={{ fontFamily: fonts.primary, color: colors.accent, fontSize: 11 }}>
                                {props.errors.firstName}</Text>
                            </View>
                          }
                        </View>
                        <View style={{ flex: .49 }}>
                          <Input


                            placeholder={strings.lastName}
                            value={props.values.lastName}
                            onChangeText={props.handleChange("lastName")}
                            onBlur={props.handleBlur("lastName")}

                            error={props.touched.lastName && props.errors.lastName}
                          />
                          {props.touched.lastName && props.errors.lastName &&
                            <View style={{ flexDirection: 'row' }}>

                              <Text style={{ fontFamily: fonts.primary, color: colors.accent, fontSize: 11 }}>
                                {props.errors.lastName}</Text>
                            </View>
                          }
                        </View>
                      </View>



                      {/* <TextInputPhone /> */}

                      <View style={{ borderBottomWidth: 1, paddingBottom: 10, marginTop: 10, borderBottomColor: this.state.isPhoneNumberWrong ? colors.accent : colors.borderColor }}>
                        <PhoneInput

                          textComponent={this.renderFlag}
                          ref={(ref) => { this.phone = ref; }}
                          onPressFlag={() => this.onPressFlag()}
                        />

                        <CountryPicker

                          countryCode="TR"
                          withFilter
                          withFlag
                          withCountryNameButton
                          withAlphaFilter
                          withCallingCode
                          withEmoji
                          onSelect

                          renderFlagButton={() => null}
                          onChange={(value) => this.selectCountry(value)}
                          onOpen={() => this.setState({ countryModalOpen: true })}
                          onClose={() => this.setState({ countryModalOpen: false })}
                          onSelect={(value) =>
                            this.selectCountry(value)}
                          translation='eng'
                          cca2={this.state.cca2}
                          modalProps={{
                            visible: this.state.countryModalOpen,

                          }}
                        >
                          <View></View>
                        </CountryPicker>


                      </View>
                      {this.state.isPhoneNumberWrong && <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <Icon name="info" type="MaterialIcons" style={{ color: colors.accent, fontSize: sizes.iconSmall }} />
                        <Text style={{ fontFamily: fonts.primary, color: colors.accent, marginLeft: 5, fontSize: sizes.small }}>
                          {strings.phoneNumberErrorMin}</Text>
                      </View>}


                      <Input
                        secureTextEntry
                        placeholder={strings.Password}
                        value={props.values.password}
                        onChangeText={props.handleChange("password")}
                        onBlur={props.handleBlur("password")}
                        error={props.touched.password && props.errors.password}
                      />
                      {props.touched.password && props.errors.password &&
                        <View style={{ flexDirection: 'row' }}>
                          <Icon name="info" type="MaterialIcons" style={{ color: colors.accent, fontSize: sizes.iconSmall }} />
                          <Text style={{ fontFamily: fonts.primary, color: colors.accent, marginLeft: 5, fontSize: sizes.small }}>
                            {props.errors.password}</Text>
                        </View>
                      }


                      <Button text={strings.finish} onPress={props.handleSubmit} />

                    </View>
                  </View>
                );
              }}
            </Formik>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  loading: state.signUp.loading
});

function bindToAction(dispatch: any) {
  return {
    SignUp: (user: UserSignUp) =>
      dispatch(SignUp(user))
  };
}
export default connect(
  mapStateToProps,
  bindToAction
)(SignUpScreen);


