import { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Alert,
  TouchableOpacity,
  Platform,
} from "react-native";
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomButton from "../components/CustomButton";
import colors from '../config/colors';
import decryptString from '../config/decryption.js'
import url from '../config/url'
import { StatusBar } from "expo-status-bar";
import Constants from 'expo-constants';

export default function SignUp({navigation}) {

  // 사용자가 입력한 아이디, 비밀번호, 비밀번호 확인 정보가 저장되는 useState
  const [cons_id, setConsId] = useState('');
  const [cons_pw, setConsPw] = useState('');
  const [pwCheck, setPwCheck] = useState('');
  const [errorColor,setErrorColor] = useState("red")
  const [errorMessage, setErrorMessage] = useState("")
  const [errorMessage2, setErrorMessage2] = useState("")
  const [idExists, setIdExists] = useState(true);
  

  const idCheckRequest =  async (obj_id) => {
      try {
        const response = await fetch(decryptString(url.addressEncrypt)+ 'idcheck?' + new URLSearchParams(obj_id), {
          method: 'GET',
          headers: {'Content-Type': 'application/json',},});
          const json = await response.json();
          return json;
        } catch (error) {
          console.error(error);
        }
      };
      
      const onIdCheckPress = async() => {
        if (cons_id == ''){
          setErrorColor("red")
          setErrorMessage("아이디를 입력해주세요.")
        }
        else{
          const response = await idCheckRequest({cons_id : cons_id});
          
          if(response.isIdExist){
              setIdExists(true);
              setErrorColor("red")
              setErrorMessage("아이디가 이미 존재합니다. 다른 아이디를 입력해주세요.");
            }
            else{
              setIdExists(false);
              setErrorColor("green")
              setErrorMessage("사용 가능한 아이디입니다.")
          }
        }
    } 
    const handleRegister = async () => {
      if(cons_pw != pwCheck){
        setErrorMessage2("비밀번호 불일치")
      }else if(cons_pw.length < 8) {
        setErrorMessage2("비밀번호가 8글자 이상이어야 합니다.")
      }else{
        if(!idExists){
          // 에러처리
          
          let userData = {
            cons_id : cons_id,
            cons_pw : cons_pw }

          try {
            const response = await fetch(decryptString(url.addressEncrypt) + '/register?',{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
            });
            const json = response.status;
            if(json === 201){
              Alert.alert(
                '회원가입 완료되었습니다.',
                '',
                [
                  { text: '확인', onPress: () => navigation.navigate('Login') },
                ],
                { cancelable: false }
              );
            }
          } catch (error) {
            console.error(error);
          }          
        }else {
          setErrorMessage2("아이디 중북 확인 해주세요.")
        }
      }
    }
    
    return ( 
    <KeyboardAwareScrollView style = {styles.mainView}>
      <StatusBar translucent = {true} hidden = {false} style = "dark"/>
      <View style = {styles.topContainer}>
        <Text style = {styles.titleText}>회원가입</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")} style = {styles.loginButton}>
          <Text style = {styles.loginText}>로그인</Text>
        </TouchableOpacity>
      </View>

    {/* UI 들어갈 뷰*/}
    <View style = {styles.SubView}>
        
        {/* 아이디 고정 텍스트*/}
        <Text style = {styles.Text}>아이디</Text>

      {/* 아이디 텍스트 input*/}
      <View style = {styles.idInputView}>
        <TextInput
          style = {styles.idInput}
          value = {cons_id}
          onChangeText={(input) => {setConsId(input); setIdExists(true);}}
          placeholderTextColor={'#999'}
          autoCapitalize="none"
          placeholder="아이디를 입력하세요">   
        </TextInput>
        <CustomButton text="중복 확인"
                      color={colors.blue} 
                      height = {"100%"}
                      width = {80}
                      onPress = {onIdCheckPress}/>
      </View>
      {errorMessage === '' ?
      undefined
      :
      <Text style = {[styles.errorMessage, {color : errorColor}]}>{errorMessage}</Text>
      }
      
      {/* 비밀번호 고정 텍스트*/}
      <Text style = {styles.Text}>비밀번호</Text>

      {/* 비밀번호 텍스트 input*/}
      <TextInput
        style = {styles.textInput}
        value = {cons_pw}
        onChangeText={(pw) => {setConsPw(pw); setErrorMessage2("") }}
        placeholderTextColor={'#999'}
        placeholder="비밀번호를 입력하세요"
        autoCapitalize="none"
        secureTextEntry = {true}> 
      </TextInput>
      

      {/* 비밀번호 확인 텍스트*/}
      <Text style = {styles.Text}>비밀번호 확인</Text>

      {/* 비밀번호 확인 텍스트 input*/}
      <TextInput
        style = {styles.textInput}
        value = {pwCheck}
        onChangeText={(pw) => {setPwCheck(pw); setErrorMessage2("") }}
        placeholderTextColor={'#999'}
        placeholder="비밀번호를 다시 한 번 입력하세요"
        autoCapitalize="none"
        secureTextEntry = {true}> 
      </TextInput>
      {errorMessage2 === "" ? 
      undefined
      : 
      <Text style = {[styles.errorMessage, {marginBottom : 20}]}>{errorMessage2}</Text>
      }
      <View style = {styles.ButtonView}>
        <CustomButton text = '확인'
                      color={colors.blue} 
                      height = {50}
                      width = {100}
                      alignSelf ={"center"}
                      marginBottom ={30}
                      onPress = {handleRegister}/>
      </View>
    </View>
    </KeyboardAwareScrollView>
      );
    }

    const styles = StyleSheet.create({
      // 전체 배경 화면
      mainView : {
        backgroundColor: '#87cefa',
        padding: 30,
        height: "100%",
        width: "100%",
        paddingTop :  Platform.OS === 'ios' ? 10 + getStatusBarHeight(true) :  Constants.statusBarHeight,
      },

      //각종 UI 들어가는 화면
      SubView : {
        backgroundColor: "#f5f5f5",
        padding: 20,
        marginVertical: 50,
        height : "100%",
        width : "100%",
        borderRadius : 20
      },
      topContainer: {
        width : '100%', 
        height: "10%",
        flexDirection : "row",
        justifyContent :"space-between"
      },
      ButtonView : {
        flexDirection: 'row',
        justifyContent: 'center',
      },

      //제목
      titleText : {
        fontSize: 40,
        fontWeight: "bold",
        alignItems : 'center',
        justifyContent : 'center'
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
      //고정 텍스트
      Text:{
        fontSize: 20,
        color : colors.darkgrey,
        marginBottom : 10
      },

      //텍스트 입력
      textInput: {
        marginBottom: 10,
        paddingHorizontal: 10,
        height: 40,
        width : '100%',
        borderRadius: 5,
        borderColor: 'grey',
        fontWeight: "600",
        borderWidth: 1,
        marginBottom : 20
      },

      idInput: {
        paddingHorizontal: 10,
        height: 40,
        width : '65%',
        borderRadius: 5,
        borderColor: 'gray',
        fontWeight: "600",
        borderWidth: 1,
        marginRight : 5,
      },

      idInputView : {
        flexDirection : "row",
        width : '100%',
        height : 40,
        alignItems : 'center',
        justifyContent : 'space-between',
        marginBottom : 20
      },
      errorMessage : {
        color : "red",
        fontSize : 14,
        alignSelf : "flex-end",
    },
  });
