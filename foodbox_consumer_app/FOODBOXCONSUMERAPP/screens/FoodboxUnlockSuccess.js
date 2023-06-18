import React from 'react';
import { useEffect } from "react";
import {View, StyleSheet, Text, BackHandler} from 'react-native';
import CustomButton from '../components/CustomButton';
import colors from '../config/colors';
import Ionicons from '@expo/vector-icons/Ionicons'
import {StatusBar} from 'expo-status-bar'
import Constants from 'expo-constants';

export default function FoodboxUnlockSuccess({navigation}){

    // 뒤로 가기 방지
    useEffect(() => {
      const backHandler = BackHandler.addEventListener("hardwareBackPress", () => true)
      return () => backHandler.remove();
    }, [])

  return(
    <View style = {styles.mainContainer} >
      <StatusBar translucent = {true} hidden = {false} style = "dark"/>
      <View style = {styles.topContainer}>
        <Ionicons name = {'checkmark-circle'} size = {200} color = {"lightgreen"}/>
        <Text style = {styles.text}>푸드박스가 잠금 해제되었습니다. </Text>
      </View>
      <CustomButton text = "확인" 
                    textSize = {18}
                    onPress = {()=> navigation.navigate("OrderHistoryList") }
                    height = {50}
                    width = {"80%"}
                    color = {colors.blue}
                    style />
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer : {
    width : "100%",
    height : "100%",
    alignItems : 'center',
    justifyContent : "space-between",
    paddingVertical : 30,
    paddingTop : Platform.OS === 'ios' ? 10 + getStatusBarHeight(true) : Constants.statusBarHeight,
  },
  topContainer: {
    width : "100%",
    height : "80%",
    alignItems : 'center',
    justifyContent : "center"
  },
  text : {
    fontSize : 20,
    fontWeight : "700",
    marginTop : 20
  }
})