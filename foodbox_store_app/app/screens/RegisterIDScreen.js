import React, { useState} from "react";
import { View, TouchableOpacity, Dimensions, StyleSheet, Text, Keyboard, TouchableWithoutFeedback, TextInput, Platform} from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height';
import colors from "../config/colors";
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import url from "../data/url"
import decryptString from '../hooks/decryption.js'
import { StatusBar } from "expo-status-bar";
import Constants from 'expo-constants';

export default function RegisterIDScreen({navigation}){
    const [store_id, setStoreId] = useState('');
    const [idExists, setIdExists] = useState(true);
    const [errorColor,setErrorColor] = useState("red")
    const [errorMessage, setErrorMessage] = useState("")

    const idCheckRequest =  async (store_dic) => {
            try {
                const response = await fetch(decryptString(url.addressEncrypt) + '/idcheck?' + new URLSearchParams(store_dic), {
                    method: 'GET',
                    headers: {'Content-Type': 'application/json',},});
                const json = await response.json();
                console.log("response")
                return json;
            } catch (error) {
                console.error(error);
            }
    };

    const onIdCheckPress = async() => {
        if (store_id == ''){
            setErrorColor("red")
            setErrorMessage("아이디를 입력해주세요.")
        }
        else{
            if (store_id == ''){
                setErrorColor("red")
                setErrorMessage("아이디를 입력해주세요.")
            }
            else{
                const response = await idCheckRequest({store_id : store_id});
                console.log(response)
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

    }        
    
    const onContinuePress = () => {
        if(!idExists){
            navigation.navigate('RegisterPassword', {store_id : store_id});
        }
        else {
            setErrorColor("red")
            setErrorMessage("아이디 중북 확인을 해주세요.")
        }
    }
    
    return(
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style = {styles.mainContainer}>
            <StatusBar translucent = {true} hidden = {false} style = "dark"/>
                <View style = {styles.topContainer}>
                    <Text style = {styles.registerText}>회원가입</Text>
                    <TouchableOpacity style = {{marginTop : 15}} onPress = {()=> navigation.navigate("Login")} >
                        <Ionicons name = "return-up-back" size = {32} color = "black"/>
                    </TouchableOpacity>
                </View>
                <View style = {styles.middleContainer}>
                    <Text style = {styles.descriptionText}>아이디를 입력해주세요.</Text>
                </View>
                <View style = {styles.bottomContainer}>
                    <View style = {styles.inputContainer}>
                        <View style = {styles.textInputBoxContainer}>
                            <MaterialCommunityIcons name = {"account-circle"} size={40} color = {colors.orange} />
                            <TextInput  value={store_id}
                                        onChangeText={(input) => {setStoreId(input); setIdExists(true);}}
                                        onSubmitEditing={onContinuePress}
                                        placeholder = {"아이디"}
                                        numberOfLines={1}
                                        maxLength = {20}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        style={styles.input}/>
                            <TouchableOpacity onPress={onIdCheckPress} style = {styles.idCheckButtonContainer} >
                                <Text style = {styles.idCheckButtonText}>중북확인</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style = {[styles.errorMessage, {color : errorColor}]}>{errorMessage}</Text>
                    </View>
                    <TouchableOpacity onPress={onContinuePress} style = {styles.continueButtonContainer} >
                        <Text style = {styles.continueButtonText}>다음</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({  
    mainContainer : {
        backgroundColor : colors.orange, 
        width : "100%", 
        justifyContent : 'flex-start',
        height : Platform.OS === 'android' ? (Dimensions.get('window').height + Constants.statusBarHeight) : "100%", 
    },
    topContainer : {
        paddingTop :  Platform.OS === 'ios' ? 10 + getStatusBarHeight(true) : 10 + Constants.statusBarHeight,   
        flexDirection : 'row',
        width : "100%",
        height : Platform.OS === 'android' ? (Dimensions.get('window').height + Constants.statusBarHeight) * 0.20 : "20%", 
        paddingHorizontal : 20,
        justifyContent : "space-between",
    },
    registerText : {
        fontSize : 30,
        fontWeight : "700",
        marginTop : 10,
    },
    descriptionText : {
        fontSize : Platform.OS === 'ios' ? 20 : 16,
        marginTop: 5
    },
    middleContainer : {
        height :  Platform.OS === 'android' ? (Dimensions.get('window').height + Constants.statusBarHeight) * 0.10 : "10%",
        justifyContent : "flex-start",
        paddingHorizontal : 20,
    },
    bottomContainer : {
        width : "100%",
        height : Platform.OS === 'android' ? (Dimensions.get('window').height + Constants.statusBarHeight) * 0.70 : "70%", 
        alignItems : 'center',
        backgroundColor : "white",
        borderTopLeftRadius : 30,
        borderTopRightRadius : 30,
        justifyContent : "space-between",
        paddingTop : 30
    },
    
    idCheckButtonContainer : {
        width : "30%",
        height: "10%",
        backgroundColor : colors.lightblue,
        alignItems : "center",
        justifyContent : 'center',
        borderRadius : 10
    },
    errorMessage : {
        color : "red",
        fontSize : 15,
        alignSelf : "flex-end",
        marginRight : "5%",
        marginTop : 15
    },
    continueButtonContainer : {
        width : "100%",
        height: "15%",
        backgroundColor : "black",
        alignItems : "center",
        justifyContent : 'center'
    },
    continueButtonText : {
        fontSize : 20,
        fontWeight : "400",
        color  : "#fff"
    },
    textInputBoxContainer: {
        flexDirection : "row",
        height : 60,
        width : "90%",
        alignItems : 'center',
        justifyContent : "flex-start",
        backgroundColor : "#ECECEC",
        borderRadius : 20,
        paddingLeft : 10,
        marginTop : 15,
        
    },
    input: {
        width: "60%",
        height: 40,
        padding: 10,

      },
      idCheckButtonContainer : {
        width : "25%",
        height: 40,
        backgroundColor : colors.orange,
        alignItems : "center",
        justifyContent : 'center',
        borderRadius : 10
    },
    errorMessage : {
        fontSize : 15,
        alignSelf : "flex-end",
        marginRight : "5%",
        marginTop : 15
    },
    idCheckButtonText : {
        fontSize : 15,
        fontWeight : "400",
        color  : "#000"
    },
    inputContainer : {
        width : "100%",
        height : "23%",
        alignItems : 'center',
        justifyContent : "flex-start",
    },

})