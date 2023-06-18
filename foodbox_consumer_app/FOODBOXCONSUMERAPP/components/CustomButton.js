import React from "react";
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

export default function CustomButton({text, textSize, onPress, height, width, color, margin, alignSelf, style}){
  return(
    <TouchableOpacity onPress = {onPress} style = {[styles.mainView, style, {
      height : height, 
      width : width, 
      backgroundColor : color,
      margin : margin,
      alignSelf : alignSelf
      }]} >
      <Text style = {[styles.text, {fontSize : textSize}]}>{text}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  mainView : {
    alignItems : 'center',
    justifyContent : 'center',
    borderRadius : 5
  },
  text : {
    fontSize : 14,
    color : 'black',
    fontWeight : "bold"
  }
})