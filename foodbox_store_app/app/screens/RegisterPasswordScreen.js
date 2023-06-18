import React, {useState} from "react";
import { View, TouchableOpacity, StyleSheet, Text, Keyboard, Dimensions, TouchableWithoutFeedback, Platform} from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height';
import colors from "../config/colors";
import Ionicons from '@expo/vector-icons/Ionicons';
import IconAndTextInput from '../components/IconAndTextInput'
import { StatusBar } from "expo-status-bar";
import Constants from 'expo-constants';

export default function RegisterPasswordScreen({navigation, route}){
    const [errorMessage, setErrorMessage] = useState("")
    const [pswd1, setPswd1] = useState("");
    const [pswd2, setPswd2] = useState("");
    const store_id = route.params.store_id;

    const onContinuePress = () => {
        if(pswd1 != pswd2){
            setErrorMessage("비밀번호가 서로 맞지 않습니다.")
        }else if(pswd1.length < 8){
            setErrorMessage("비밀번호가 8글자 이상이어야 됩니다.")
        }else {
            navigation.navigate('RegisterStore', {store_pw : pswd1, store_id : store_id})
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
                <Text style = {styles.descriptionText}>비밀번호를 설정해주세요.</Text>
            </View>
            <View style = {styles.bottomContainer}>
                    <View style = {styles.inputContainer} >
                        <IconAndTextInput   iconName={"key-variant"} 
                                            placeholder={"비밀번호"} 
                                            secureTextEntry = {true} 
                                            keyboardType = {"visible-password"} 
                                            returnKeyType = {"next"}
                                            input = {setPswd1}
                                            />
                        <IconAndTextInput   iconName={"key-variant"} 
                                            placeholder={"비밀번호 확인"} 
                                            secureTextEntry = {true} 
                                            keyboardType = {"visible-password"} 
                                            returnKeyType = {"done"}
                                            input = {setPswd2}
                                            onSubmitEditing = {onContinuePress}
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
        height :  Platform.OS === 'android' ? (Dimensions.get('window').height + Constants.statusBarHeight) : "100%", 
        justifyContent : "space-between",
    },
    topContainer : {
        paddingTop :  Platform.OS === 'ios' ? getStatusBarHeight(true) : 10 + Constants.statusBarHeight,
        flexDirection : 'row',
        width : "100%",
        height :  Platform.OS === 'android' ? (Dimensions.get('window').height + Constants.statusBarHeight) * 0.10 : "10%",
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
        height : Platform.OS === 'android' ? (Dimensions.get('window').height + Constants.statusBarHeight) * 0.80 : "80%",
        alignItems : 'center',
        backgroundColor : "white",
        borderTopLeftRadius : 30,
        borderTopRightRadius : 30,
        justifyContent : "space-between",
        paddingTop : 30
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