import React, {useState} from "react";
import { StyleSheet, View, Text, Dimensions, BackHandler, TouchableOpacity, Platform, KeyboardAvoidingView} from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height';
import colors from "../config/colors";
import Ionicons from '@expo/vector-icons/Ionicons';
import IconAndTextInput from "../components/IconAndTextInput";
import * as FileSystem from 'expo-file-system';
import url from "../data/url";
import decryptString from '../hooks/decryption.js'
import { StatusBar } from "expo-status-bar";
import Constants from 'expo-constants';

export default function LoginScreen({navigation}){
    const [errorMessage, setErrorMessage] = useState("")
    const [store_id, setStoreId] = useState("");
    const [store_pw, setStorePw] = useState("");
    
    
    const loginRequest =  async (loginInfo) => {
        try {
            const response = await fetch(decryptString(url.addressEncrypt) + '/login?' + new URLSearchParams(loginInfo), {
                method: 'GET',
                headers: {'Content-Type': 'application/json',},});
            const status = response.status;
            if(status === 401){
                setErrorMessage("입력하신 정보와 알맞은 계정이 없습니다.")
                return null;   
            }else {
                const data = await response.json();
                return data
            }
        } catch (error) {
            setErrorMessage("입력하신 정보와 알맞은 계정이 없습니다.")
            console.error("error: " + error);
        }
    };

    const onLoginPress = async () => {
        const loginInfo = {
            store_id : store_id,
            store_pw : store_pw
        }
        const jwt = await loginRequest(loginInfo);
        if(jwt != null){
            const access_token = jwt.access_token;
            const refresh_token = jwt.refresh_token;
            await FileSystem.writeAsStringAsync(
                url.atFileUri, 
                access_token, 
                {encoding: FileSystem.EncodingType.UTF8});     
            await FileSystem.writeAsStringAsync(
                url.rtFileUri, 
                refresh_token, 
                {encoding: FileSystem.EncodingType.UTF8});
            navigation.navigate('OrderList')
        }
    }
     
    return(
            <KeyboardAvoidingView behavior={'height'} enabled style = {styles.mainContainer} >
                <StatusBar translucent = {true} hidden = {false} style = "dark"/>
                <View style = {styles.topContainer}>
                    <TouchableOpacity onPress = {()=> navigation.navigate('Welcome')} >
                        <Ionicons name = "return-up-back" size = {32} color = "black"/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress = {() => navigation.navigate('RegisterId')} style = {styles.registerContainer}>
                        <Text style = {styles.registerText}>회원가입</Text>
                    </TouchableOpacity>
                </View>
                <View style = {styles.infoContainer}>
                    <Text style = {styles.loginText}>로그인</Text>
                    <Text style = {styles.loginInfoText}>아이디와 비밀번호를 입력하여 로그인해 주세요.</Text>
                </View>
                    <View style = {styles.bottomContainer}> 
                        <IconAndTextInput   iconName={"account-circle"} 
                                            placeholder={"아이디"}  
                                            secureTextEntry = {false}  
                                            keyboardType = {"default"} 
                                            returnKeyType = {"next"}
                                            input = {setStoreId}
                                            />
                        <IconAndTextInput   iconName={"key-variant"} 
                                            placeholder={"비밀번호"} 
                                            secureTextEntry = {true} 
                                            keyboardType = {"default"} 
                                            returnKeyType = {"done"} 
                                            input = {setStorePw}
                                            />
                        <Text style = {styles.errorMessage}>{errorMessage}</Text>
                    </View>

                    <TouchableOpacity onPress={onLoginPress}  style = {styles.loginButtonContainer} >
                        <Text style = {styles.loginButtonText}>로그인</Text>
                    </TouchableOpacity>
            </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    mainContainer : {
        backgroundColor : colors.orange,
        height : Platform.OS !== 'android' ? Dimensions.get('window').height + Constants.statusBarHeight : "100%",
        justifyContent : "flex-start",
    },
    topContainer : {
        paddingTop :  Platform.OS === 'ios' ? 10 + getStatusBarHeight(true) : 10 + Constants.statusBarHeight,
        width :"100%",
        height : (Dimensions.get('window').height + Constants.statusBarHeight) * 0.15,
        flexDirection : "row",
        paddingHorizontal : 30,
        justifyContent : "space-between",
        alignItems : "flex-start",
    },
    registerText : {
        fontSize : 20
    },
    infoContainer : {
        paddingHorizontal : 20,
        paddingTop: 20,
        width :"100%",
        height : (Dimensions.get('window').height + Constants.statusBarHeight) * 0.15,
        justifyContent : 'flex-start',
    },
    loginText : {
        fontSize : 40,
        fontWeight : "bold",
        marginBottom : 5
    },
    loginInfoText : {
        fontSize : Platform.OS === 'ios' ? 18 : 16,
        fontWeight : "400"
    },
    bottomContainer : {
        backgroundColor : "white",
        width : "100%",
        height : (Dimensions.get('window').height + Constants.statusBarHeight) * 0.58 ,
        borderTopLeftRadius: 30,
        borderTopRightRadius : 30,
        justifyContent : "flex-start",
        alignItems : 'center',
        paddingTop : 20
    },
    errorMessage : {
        color : "red",
        fontSize : 15,
        alignSelf : "flex-end",
        marginRight : "5%",
        marginTop : 15
    },
    loginButtonContainer : {
        width : "100%",
        height: (Dimensions.get('window').height + Constants.statusBarHeight) * 0.12,
        backgroundColor : "black",
        alignItems : "center",
        justifyContent : 'center'
    },
    loginButtonText : {
        fontSize : 20,
        fontWeight : "400",
        color  : "#fff"
    }
})