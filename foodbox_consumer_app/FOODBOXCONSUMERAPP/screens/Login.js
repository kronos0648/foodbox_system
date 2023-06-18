import { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Platform,
  TouchableOpacity,
} from "react-native";
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomButton from "../components/CustomButton";
import * as FileSystem from 'expo-file-system';
import colors from "../config/colors";
import url from "../config/url";
import decryptString from '../config/decryption.js'
import { StatusBar } from "expo-status-bar";
import Constants from 'expo-constants';

export default function Login({navigation}){
  // 사용자가 입력한 아이디, 비밀번호, 비밀번호 확인 정보가 저장되는 useState
  const [cons_id, setCons_id] = useState('');
  const [cons_pw, setCons_pw] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [idTextInputBorderColor, setIdTextInputBorderColor] = useState('grey');
  const [pwTextInputBorderColor, setPwTextInputBorderColor] = useState('grey');

  const loginRequest =  async (loginInfo) => {
    try {
        const response = await fetch(decryptString(url.addressEncrypt) + '/login?' + new URLSearchParams(loginInfo), {
            method: 'GET',
            headers: {'Content-Type': 'application/json',},});
        if(response.status === 401) {
          setErrorMessage("아이디 또는 비밀번호를 다시 확인해 주세요.")
          return null
        } else {
          const data = await response.json();
          return data;
      }
    } catch (error) {
      console.error("error: " + error);
    }
};

const onLoginPress = async () => {
    const loginInfo = {
        cons_id : cons_id,
        cons_pw : cons_pw
    }
    const response = await loginRequest(loginInfo);
    
    if(response != null){
      const access_token = response.access_token;
      const refresh_token = response.refresh_token;
      await FileSystem.writeAsStringAsync(
          url.atFileUri, 
          access_token, 
          {encoding: FileSystem.EncodingType.UTF8});     
      await FileSystem.writeAsStringAsync(
          url.rtFileUri, 
          refresh_token, 
          {encoding: FileSystem.EncodingType.UTF8});     

      navigation.navigate("StoreList");
    }
}
  
  return (
    <KeyboardAwareScrollView style = {styles.mainView}>
      <StatusBar translucent = {true} hidden = {false} style = "dark"/>
      <View style = {styles.topContainer}>
        <Text style = {styles.titleText}>로그인</Text>
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")} style = {styles.loginButton}>
            <Text style = {styles.loginText}>회원가입</Text>
        </TouchableOpacity>
      </View>
        {/* UI 들어갈 뷰*/}
      <View style = {styles.SubView}>
          
          {/* 아이디 고정 텍스트*/}
          <Text style = {styles.Text}>아이디</Text>

          {/* 아이디 텍스트 input*/}
          <TextInput
            style = {[styles.textInput, {borderColor : idTextInputBorderColor}]}
            value = {cons_id}
            onChangeText={setCons_id}
            placeholderTextcolor={'#999'}
            autoCapitalize="none"
            maxLength={20}
            onBlur={() => {setIdTextInputBorderColor("grey");}}
            onFocus={() => {setIdTextInputBorderColor("limegreen");}}
            placeholder="아이디를 입력하세요"> 
          </TextInput>
          
          {/* 비밀번호 고정 텍스트*/}
          <Text style = {styles.Text}>비밀번호</Text>

          {/* 비밀번호 텍스트 input*/}
          <TextInput
            style = {[styles.textInput, {borderColor : pwTextInputBorderColor}]}
            value = {cons_pw}
            onChangeText={setCons_pw}
            placeholderTextColor={'#999'}
            autoCapitalize="none"
            maxLength={30}
            secureTextEntry = {true}
            onBlur={() => {setPwTextInputBorderColor("grey");}}
            onFocus={() => {setPwTextInputBorderColor("limegreen");}}
            placeholder="비밀번호를 입력하세요"> 
          </TextInput>

          <Text style = {styles.error}>{errorMessage}</Text>
            <CustomButton
            text = '로그인'
            color = '#8CBDEf'
            height = {50}
            width = {"100%"}
            alignSelf={"center"}
            marginBottom ={30}
            //로그인 성공시 주문목록 창으로 이동
            onPress={onLoginPress}/>
      </View>
    </KeyboardAwareScrollView>
  );
  
}

const styles = StyleSheet.create({// 전체 배경 화면
  mainView : {
    backgroundColor: '#87cefa',
    padding: 30,
    height: "100%",
    width: "100%",
    paddingTop : Platform.OS === 'ios' ? 10 + getStatusBarHeight(true) : Constants.statusBarHeight,
  },
  topContainer: {
    width : '100%', 
    height: "13%",
    flexDirection : "row",
    justifyContent :"space-between"
  },
  //각종 UI 들어가는 화면
  SubView : {
    backgroundColor: "#f5f5f5",
    padding: 20,
    marginVertical: 50,
    height : "100%",
    width : "100%",
    borderRadius : 20,
  },

  ButtonView : {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginButton : {
    backgroundColor : colors.black,
    width : 80,
    height : 40,
    borderRadius : 5,
    alignItems : "center",
    justifyContent : 'center',
  },
  loginText : {
    fontSize : 15,
    color : 'white'
  },

  //제목
  titleText : {
    fontSize: 40,
    fontWeight: "bold",
    alignItems : 'center',
    justifyContent : 'center',
  },

  //고정 텍스트
  Text:{
    fontSize: 20,
    marginVertical : 10,
    color : colors.darkgrey
  },

  //텍스트 입력
  textInput: {
    marginBottom: 10,
    paddingHorizontal: 10,
    height: 50,
    width : '100%',
    borderRadius: 8,
    borderColor: 'grey',
    fontWeight: "500",
    borderWidth: 1
  },
  error : {
    color : "red",
    alignSelf : 'flex-end',
    fontSize : 14,
    marginBottom :20
  }
});