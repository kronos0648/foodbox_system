import { View, Image, StyleSheet, BackHandler} from 'react-native';
import React, {useEffect} from 'react';
import LogoTitle from '../components/LogoTitle';
import * as FileSystem from 'expo-file-system';
import url from '../data/url';
import { StatusBar } from "expo-status-bar";
import Constants from 'expo-constants';
import { getStatusBarHeight } from 'react-native-status-bar-height';

export default function StartScreen({navigation}) {
    useEffect( () => {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
      const initialRoute = async () => {
        try {
          const at = await FileSystem.getInfoAsync(url.atFileUri); 
          if(at.exists === true){
            setTimeout(() => {
                navigation.navigate('OrderList')
            }, 1000);
          }
          else{
            const rt = await FileSystem.getInfoAsync(url.rtFileUri); 
            if(rt.exists === true){
                const rtDelet = await FileSystem.deleteAsync(url.rtFileUri, {encoding: FileSystem.EncodingType.UTF8});
            }
            setTimeout(() => {
                navigation.navigate('Welcome')
            }, 1000);
          }
      } catch (error) {
          console.error(error);
      }
    }
    initialRoute();
    return () => backHandler.remove();
  }, []);

    return(
    <View style = {styles.container}>
        <StatusBar translucent = {true} hidden = {false} style = "dark"/>
        <Image style = {styles.orangeOval} source  = {require("../assets/orangeOval.png")}  />
        <View style = {{alignItems : "center", justifyContent : "center"}}>
            <Image style = {styles.logo} source  = {require("../assets/logo.png")} />
            <LogoTitle size = {35}/>
        </View>
        <Image style = {styles.blueOval} source  = {require("../assets/blueOval.png")}  />
        <StatusBar translucent = {true}/>
    </View>
    )
}
const styles = StyleSheet.create({
    container : {
        flex : 1, 
        alignItems : "center", 
        justifyContent :"space-between",
        paddingTop : Platform.OS === 'ios' ? 10 + getStatusBarHeight(true) : Constants.statusBarHeight,

    },
    logo: {
        height : 100,
        width : 100,
        resizeMode : 'contain',
    },
    orangeOval : {
        height : 200,
        width : 200,
        resizeMode : 'contain',
        alignSelf : "flex-end",
    }, 
    blueOval : {
        height : 250,
        width : 250,
        resizeMode : 'contain',
        alignSelf : "flex-start",
    },
   
})