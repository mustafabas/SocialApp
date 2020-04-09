import React, { Component } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps
} from "react-native";
import { colors, fonts } from "../constants";
import { Spinner } from "native-base";

interface Props extends TouchableOpacityProps {
  text: string;
  loading: boolean;
}

export class Button extends Component<Props, {}> {
  render() {
    const { text,loading,style,textStyle} = this.props;
    return (
      <TouchableOpacity disabled={loading} {...this.props} style={[styles.buttonStyle,style]}>
       {loading ? <Spinner size="small" color={colors.containerBg} /> :  <Text style={[styles.buttonTextStyle,textStyle]}>{text}</Text> }
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: colors.primary,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 16,
    borderRadius:5
  },
  buttonTextStyle: {
    color: colors.containerBg,
    fontWeight: "700",
    fontSize: 16,
    fontFamily:fonts.primary
  }
});
