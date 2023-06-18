import { useEffect } from "react";
import { 
  View,
  StyleSheet,
  Image,
  Platform,
  BackHandler,
} from "react-native";
import { getStatusBarHeight } from 'react-native-status-bar-height';
import CustomButton from "../components/CustomButton";
import {StatusBar} from 'expo-status-bar';
import Constants from 'expo-constants';

export default function Start  (props){

 // 뒤로 가기 방지
  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => true);
      return () => backHandler.remove();
 }, [])

  return (
   <View style = {styles.mainView}>
    <StatusBar translucent = {true} hidden = {false} style = "dark"/>
    <Image style = {styles.Logo}
    source = {require('../assets/foodbox.png')}/>

    <View style = {styles.ButtonView}>
      {/*버튼 설정*/}
     
       <CustomButton
      text = '회원가입'
      color = '#8CBDEf'
      height = {40}
      width = {100}
      //로그인 성공시 주문목록 창으로 이동
      onPress={() => {
        props.navigation.navigate("SignUp")
      }}/>

       <CustomButton
      text = '로그인'
      color = '#8CBDEf'
      height = {40}
      width = {100}
      //로그인 성공시 주문목록 창으로 이동
      onPress={() => {
        props.navigation.navigate("Login")
      }}/>
    </View>
  </View>
    );
}
const styles = StyleSheet.create({
  //전체 배경 화면
  mainView : {
    backgroundColor : 'white',
    flex : 1,
    alignItems : "center",
    justifyContent : 'center',
    PaddingTop :  Platform.OS === 'ios' ? 10 + getStatusBarHeight(true) : Constants.statusBarHeight,
  },

  //버튼 위치 설정
  ButtonView : {
    flexDirection: 'row',
    justifyContent : 'space-between',
    width : '70%',
    marginTop : 50
    },
    
  //로고 사진 설정
  Logo : {
      width : 200,
      height : 200,
  }
});