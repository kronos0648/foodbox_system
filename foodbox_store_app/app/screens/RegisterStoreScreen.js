import React, {useState} from "react";
import { View, TouchableOpacity, StyleSheet, Text, Dimensions, Keyboard, TouchableWithoutFeedback, Platform} from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height';
import colors from "../config/colors";
import Ionicons from '@expo/vector-icons/Ionicons';
import IconAndTextInput from '../components/IconAndTextInput'
import url from "../data/url"
import decryptString from '../hooks/decryption.js'
import { StatusBar } from "expo-status-bar";
import Constants from 'expo-constants';

export default function RegisterStoreScreen({navigation, route}){
    const [errorMessage, setErrorMessage] = useState("")
    const [storeName, setStoreName] = useState("");
    const store_id = route.params.store_id;
    const store_pw = route.params.store_pw;
    
    const onContinuePress = async () => {
        if(storeName == ""){
            setErrorMessage("가게명을 입력해주세요.")
        }
        else {
            let userData = {    store_id : store_id,
                                store_name : storeName,
                                store_pw : store_pw }
            try {
                const response = await fetch(decryptString(url.addressEncrypt) + '/register',{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userData),
                    });
                const json = response.status;
                if(json === 201){
                    navigation.navigate("RegisterSuccess")
                }
                console.log(json)
                } catch (error) {
                console.error(error);
                }             
        }
    }

    return(
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style = {styles.mainContainer}>
            <StatusBar translucent = {true} hidden = {false} style = "dark"/>
            <View style = {styles.topContainer}>
                <Text style = {styles.registerText}>회원가입</Text>
                <TouchableOpacity onPress = {()=> navigation.goBack()} >
                    <Ionicons name = "return-up-back" size = {32} color = "black"/>
                </TouchableOpacity>
            </View>
            <View style = {styles.middleContainer}>
                <Text style = {styles.descriptionText}>가게명을 입력해주세요.</Text>
            </View>
            <View style = {styles.bottomContainer}>
                    <View style = {styles.inputContainer} >
                        <IconAndTextInput   iconName={"store"} 
                                            placeholder={"가게명"} 
                                            secureTextEntry = {false} 
                                            keyboardType = {"default"} 
                                            returnKeyType = {"done"}
                                            input = {setStoreName}
                                            onSubmitEditing={onContinuePress}
                                            />
                        <Text style = {styles.errorMessage}>{errorMessage}</Text>
                    </View>
                <TouchableOpacity onPress={onContinuePress}  style = {styles.continueButtonContainer} >
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
        height :  Platform.OS === 'android' ? (Dimensions.get('window').height + Constants.statusBarHeight)  : "100%", 
        justifyContent : "space-between",
    },
    topContainer : {
        paddingTop :  Platform.OS === 'ios' ? 10 + getStatusBarHeight(true) : 10 + Constants.statusBarHeight,
        flexDirection : 'row',
        width : "100%",
        height : Platform.OS === 'android' ? (Dimensions.get('window').height + Constants.statusBarHeight) * 0.10 : "10%",
        paddingHorizontal : 20,
        justifyContent : "space-between",
    },
    registerText : {
        fontSize : 30,
        fontWeight : "700"
    },
    descriptionText : {
        fontSize : Platform.OS === 'ios' ? 20 : 18,
        marginTop: 10
    },
    middleContainer : {
        width : "100%",
        height : Platform.OS === 'android' ? (Dimensions.get('window').height + Constants.statusBarHeight) * 0.10 : "10%",
        justifyContent : "flex-start",
        paddingHorizontal : 20,
    },
    bottomContainer : {
        width : "100%",
        height : Platform.OS === 'android' ? (Dimensions.get('window').height + Constants.statusBarHeight) * 0.80: "80%",
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
    inputContainer : {
        width : "100%",
        height : "23%",
        alignItems : 'center',
        justifyContent : "space-between",
    },

})