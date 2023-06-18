import React, {useEffect} from "react";
import { View, TouchableOpacity, StyleSheet, Text, BackHandler} from 'react-native'
import colors from "../config/colors";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StatusBar } from "expo-status-bar";
import Constants from 'expo-constants';
import { getStatusBarHeight } from 'react-native-status-bar-height';


export default function RegisterSuccessScreen({navigation}){
    
    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
        return () => backHandler.remove()
      }, [])
  
    const onContinuePress = () => {   
            navigation.navigate('Login')
    }

    return(
        <View style = {{backgroundColor : colors.orange, width : "100%", height : "100%", justifyContent : "space-between"}}>
            <StatusBar translucent = {true} hidden = {false} style = "dark"/>
            <View style = {styles.topContainer}>
                <Text style = {styles.registerText}>회원가입</Text>
            </View>
            <View style = {styles.bottomContainer}>
                <Text style = {styles.infoText}>성공적으로 회원가입하였습니다!</Text>
                <MaterialCommunityIcons name = {"check-circle"} size={150} color = {"#2ecc71"} />
                <TouchableOpacity onPress={onContinuePress}  style = {styles.continueButtonContainer} >
                    <Text style = {styles.continueButtonText}>완료</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({  
    mainContainer : {
        backgroundColor : colors.orange, 
        width : "100%", 
        height : "100%", 
    },
    topContainer : {
        paddingTop : Platform.OS === 'ios' ? 10 + getStatusBarHeight(true) : 5 + Constants.statusBarHeight,
        flexDirection : 'row',
        width : "100%",
        height : "15%",
        paddingHorizontal : 20,
        justifyContent : "space-between",
    },
    registerText : {
        fontSize : 30,
        fontWeight : "700"
    },
    idText : {
        fontSize : 20,
        marginLeft : 16
    },
    middleContainer : {
        width : "100%",
        height : "7%",
        justifyContent : "flex-start",
    },
    bottomContainer : {
        width : "100%",
        height : "79%",
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
    infoText : {
        fontSize : 23,
        alignSelf : "center",
        marginHorizontal : "5%",
        marginTop : 10
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