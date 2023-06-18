import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, Platform} from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height';
import colors from "../config/colors";
import Ionicons from '@expo/vector-icons/Ionicons'
import { StatusBar } from "expo-status-bar";
import Constants from 'expo-constants';

export default function FoodboxAllocationScreen({navigation, route}){
    const order = route.params.order;

    const onQrPress = () => {
        navigation.navigate("FoodboxQRScreen", {order : order});
    }
    const onCodePress = () => {
        navigation.navigate("FoodboxCodeScreen", {order: order});
    }

    return(
        <View style = {styles.mainContainer} >
            <StatusBar translucent = {true} hidden = {false} style = "dark"/>
            <TouchableOpacity style = {styles.topContainer} onPress = {onQrPress} >
                <Ionicons size = {100} name = {'qr-code'} color = {"black"}/>
                <Text style = {styles.text}>QR코드 스캔</Text>
            </TouchableOpacity>
            <TouchableOpacity style = {styles.bottomContainer} onPress = {onCodePress}>
                <Ionicons size = {100} name = {'ios-keypad'} color = {"black"}/>
                <Text style = {styles.text}>식별번호 직접 입력</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer : {
        backgroundColor : colors.blue,
        flex :1, 
        paddingTop : Platform.OS === 'ios' ? 10 + getStatusBarHeight(true) : Constants.statusBarHeight,
        paddingBottom : 40,
        alignItems : 'center',
        justifyContent :"space-between",
    },
    topContainer: {
        height : "50%",
        width : "90%",
        backgroundColor : colors.white,
        borderRadius : 10,
        alignItems : 'center',
        justifyContent : 'center'
    },
    bottomContainer : {
        height: "50%",
        width :"90%",
        backgroundColor : colors.white,
        borderRadius : 10,
        marginTop : 20,
        alignItems : 'center',
        justifyContent : 'center'
    },
    text : {
        fontSize : 25, 
        fontWeight : "500",
        marginTop :40
    }
})