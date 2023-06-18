import React, {useEffect} from 'react';
import {
  View,
  StyleSheet,
  Image,
  BackHandler } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import * as FileSystem from 'expo-file-system';
import url from '../config/url';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';

export default function Welcome({navigation}){

    useEffect( () => {
      // 뒤로 가기 방지
      const backHandler = BackHandler.addEventListener("hardwareBackPress",() => true);
      const initialRoute = async () => {
        try {
          const jwt = await FileSystem.getInfoAsync(url.atFileUri); 
          const rt = await FileSystem.getInfoAsync(url.rtFileUri); 
         
            if(jwt.exists === true){
              setTimeout(() => {
                  navigation.navigate('StoreList')
                }, 500);
            }
            else{
              if(rt.exists === true){
                const rtDelete = await FileSystem.deleteAsync(url.rtFileUri, {encoding: FileSystem.EncodingType.UTF8});
              }
              setTimeout(() => {
                navigation.navigate('Start')
              }, 2000);
                }
      } catch (error) {
          console.error(error);
      }
    }
    initialRoute();
    return () => backHandler.remove();
  }, []);

  
  return(
  <View style = {styles.mainView} >
      <StatusBar translucent = {true} hidden = {false} style = "dark"/>
      <Image style = {styles.Logo}
      source = {require('../assets/foodbox.png')}/>
  </View>
)}

const styles = StyleSheet.create({
   //전체 배경 화면
  mainView : {
    backgroundColor : 'white',
    flex : 1,
    alignItems : "center",
    justifyContent : 'center',
    paddingTop : Platform.OS === 'ios' ? 10 + getStatusBarHeight(true) : Constants.statusBarHeight,
  },
  
  //로고 설정
  Logo : {
    width : 200,
    height : 200,
},


})