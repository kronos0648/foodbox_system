import React, {useEffect} from 'react';
import { View, Image, StyleSheet, Text, Platform, BackHandler} from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import LogoTitle from '../components/LogoTitle';
import OvalButton from '../components/OvalButton';
import colors from '../config/colors'
import { StatusBar } from "expo-status-bar";
import Constants from 'expo-constants';

export default function WelcomeScreen({navigation}) {
    
    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
        return () => backHandler.remove()
      }, [])

    return(
    <View style = {styles.container}>
        <StatusBar translucent = {true} hidden = {false} style = "dark"/>
        <View style = {styles.topContainer}>
            <Image style = {styles.logo} source  = {require("../assets/logo.png")} />
            <LogoTitle size = {32}/>
        </View>
        <View style ={styles.bottomContainer} >
            <Text style = {styles.welcomeText}>환영합니다!</Text>
            <Text style = {styles.detailsText}>로그인 또는 회원가입을 선택해주세요.</Text>
            <View style ={styles.bottonsContainer} >
                <OvalButton onPress={() => navigation.navigate('Login')} title = "로그인" textColor = "white" color = "black"  />
                <OvalButton onPress={() => navigation.navigate('RegisterId')} title = "회원가입" textColor = "black" color = "white" />
            </View>
        </View>
        <StatusBar translucent = {true}/>
    </View>
    )
}

const styles = StyleSheet.create({
    container : {
        height: "100%", 
        width: "100%", 
        backgroundColor: "white", 
        paddingTop :  Platform.OS === 'ios' ? 10 + getStatusBarHeight(true) : Constants.statusBarHeight,
    },
    topContainer:{
        width : "100%",
        height:"65%",
        alignItems : "center", 
        justifyContent : "flex-start",
    },
    logo: {
        resizeMode: 'contain',
        height : "30%",
        width : "30%",
        marginTop : "20%"
    },
    bottomContainer: {
        backgroundColor : colors.orange,
        alignItems : "flex-start",
        justifyContent : "flex-start",
        width : "100%",
        height : "35%",
        borderTopEndRadius : 40,
        borderTopStartRadius : 40
    },
    welcomeText : {
        fontSize : 25,
        fontWeight : "bold",
        marginTop :30,
        marginLeft : 20
    },
    detailsText : {
        fontSize : 18,
        marginLeft : 20,
        marginTop : 10
    },
    bottonsContainer: {
        justifyContent: 'space-around',
        width : "100%",
        alignItems : "center",
        flexDirection : "row",
        marginTop : 40
    }
})