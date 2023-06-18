import React, {useState} from "react";
import { View, TouchableOpacity, StyleSheet, Image, Text, Platform} from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import * as FileSystem from 'expo-file-system';
import colors from "../config/colors";
import Ionicons from '@expo/vector-icons/Ionicons';
import LogoTitle from "../components/LogoTitle";
import CodeInputIiew from "../components/CodeInputView";
import url from "../data/url"
import decryptString from '../hooks/decryption.js'
import { StatusBar } from "expo-status-bar";
import Constants from 'expo-constants';

export default function FoodboxCodeScreen({navigation, route}){
    const order = route.params.order;
    const [result, setResult] = useState("")
    const [showErrorMessage, setShowErrorMessage] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const onSubmitCodePress = async () => {
        if(result.length == 5){
            const dev_id = parseInt(result);
            let shouldRepeat = false;
            const device_id_data = {
                order_id : order.order_id,
                dev_id : dev_id
            }
            do{
                try {
                    // insert request here 
                    const jwt = await FileSystem.readAsStringAsync(
                        url.atFileUri, 
                        {encoding: FileSystem.EncodingType.UTF8});
                    const response = await fetch(decryptString(url.addressEncrypt) + '/allocation',{
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': jwt
                        },
                        body: JSON.stringify(device_id_data),
                        });
                    const json = response.status;
                    //const data = await response.json();
                    if(json == 401){// 토큰 만료됐다!
                        const rt = await FileSystem.readAsStringAsync(
                            url.rtFileUri,
                            {encoding: FileSystem.EncodingType.UTF8}); 
                        const response = await fetch(decryptString(url.addressEncrypt) + '/reissue',{
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': rt
                                    },});
                        const json = response.status;
                        if(json === 200){
                            shouldRepeat = true;
                            const atDelet = await FileSystem.deleteAsync(url.atFileUri, {encoding: FileSystem.EncodingType.UTF8});
                            const at = response.headers.map.authorization;
                            await FileSystem.writeAsStringAsync(
                                url.atFileUri, 
                                at, 
                                {encoding: FileSystem.EncodingType.UTF8});
                        }else{
                            console.log(JSON.stringify(response))
                        }
                    }else if(json === 201){
                        order.dev_id = dev_id;
                        navigation.navigate('FoodboxManager', {dev_id : dev_id, order : order});
                    }else if (json === 400){
                        console.log(response)
                        setErrorMessage("입력하신 식별번호로 등록된 기기가 없습니다.")
                        setShowErrorMessage(true)
                    }
                } catch (error) {
                    console.error(error);
                }
            }while(shouldRepeat==true)
        }else{
            setErrorMessage("식별 번호는 5숫자이어야 됩니다.")
            setShowErrorMessage(true) 
        }
    }

    return(
        <View style = {styles.mainContainer} >
            <StatusBar translucent = {true} hidden = {false} style = "dark"/>
            <View style = {styles.topBarContainer}>
                <View style = {styles.topBarLogoContainer}>
                    <Image style = {styles.logo} source  = {require("../assets/logo.png")} />
                    <LogoTitle size = {22}/>
                </View>   
                <TouchableOpacity style = {styles.logoutContainer} onPress={() => navigation.navigate('OrderInfo', {order: order}) } >
                    <Ionicons name = "return-up-back" size = {32} color = "black"/>
                </TouchableOpacity>  
            </View>     
            <View style = {styles.bottomContainer}>
                <View style = {styles.bottomInnerContainer} >
                    <Text style = {styles.infoText} >푸드박스 기기의 식별변호를 입력해주세요.</Text>
                    <CodeInputIiew number = {setResult}/>
                    {showErrorMessage == true ? <Text style = {styles.errorMessage}>{errorMessage}</Text> : undefined}
                    <TouchableOpacity onPress = {onSubmitCodePress} style = {styles.buttonContainer}>
                        <Text style = {styles.buttonText} >확인</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer : {
        justifyContent :"flex-start",
        alignItems : 'center',
        backgroundColor : "#fff",
        paddingTop : Platform.OS === 'ios' ? getStatusBarHeight(true) : Constants.statusBarHeight,
    },
    topBarContainer : {
        width : "100%",
        height : "10%",
        flexDirection : "row",
        alignItems : 'center'
    },
    topBarLogoContainer : {
        width : "80%",
        height : "100%",
        flexDirection : "row",
        alignItems : 'center'
    },
    logoutContainer: {
        alignItems : 'center',
        justifyContent : "center",
        width : "20%",
        height : '100%',
    },
    logo: {
        height : 40,
        width : 40,
        resizeMode : 'contain',
        marginHorizontal : 15
    },
    bottomContainer : {
        width :"100%",
        height : '90%',
        alignItems : "center",
        justifyContent : "center",
        backgroundColor : colors.blue
    },
    bottomInnerContainer : {
        width : "92%",
        height : "95%",
        backgroundColor : "white",
        borderRadius : 10,
        alignItems : 'center',
        justifyContent : "flex-start"
    },
    infoText : {
        fontWeight : "500",
        fontSize :18,
        marginTop : 20
    },
    buttonContainer : {
        height : 60,
        width : 150,
        alignItems : 'center',
        justifyContent : 'center',
        backgroundColor : "grey",
        marginTop : 50,
        borderRadius :10
    },
    buttonText : {
        color : colors.white,
        fontWeight : "bold",
        fontSize :25
    },
    errorMessage : {
        fontSize : 14,
        color : 'red',
        alignSelf : 'flex-end',
        marginRight: 30,
        marginTop: 10

    }
})