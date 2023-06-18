import React, {useState} from "react";
import { View, TouchableOpacity, StyleSheet, Image, Text, Platform} from 'react-native';
import colors from "../config/colors";
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Ionicons from '@expo/vector-icons/Ionicons';
import CodeInputIiew from "../components/CodeInputView";
import * as FileSystem from 'expo-file-system';
import url from "../config/url";
import decryptString from '../config/decryption.js'
import { StatusBar } from "expo-status-bar";
import Constants from 'expo-constants';

export default function FoodboxCodeScreen({navigation, route}){
    const order = route.params.order;
    const [result, setResult] = useState("")
    const [showErrorMessage, setShowErrorMessage] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    
    const onSubmitCodePress = async () => {
        if(result.length == 5){
            let shouldRepeat = false;
            const dev_id = parseInt(result);
            const obj = {
                order_id : order.order_id,
                dev_id : dev_id
            };
            do{
                try {
                    // insert request here 
                    const jwt = await FileSystem.readAsStringAsync(
                        url.atFileUri, 
                        {encoding: FileSystem.EncodingType.UTF8});
                    const response = await fetch(decryptString(url.addressEncrypt) + '/done',{
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': jwt
                        },
                        body: JSON.stringify(obj),
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
                        shouldRepeat = false;
                        navigation.navigate('FoodboxUnlockSuccess', {dev_id : dev_id, order : order});
                    }else {
                        shouldRepeat = false;
                        console.log(json);
                        setErrorMessage("식별번호가 알맞지 않습니다.")
                        setShowErrorMessage(true)
                    }
                } catch (error) {
                    console.error("Error : " + error);
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
                <Image style = {styles.logo} source = {require('../assets/foodbox.png')}/>                
                <TouchableOpacity style = {styles.logoutContainer} onPress={() => navigation.navigate('OrderDetails', {order_id : order.order_id} ) } >
                    <Ionicons name = "return-up-back" size = {32} color = "black"/>
                </TouchableOpacity>  
            </View>     
            <View style = {styles.bottomContainer}>
                <View style = {styles.bottomInnerContainer} >
                    <Text style = {styles.infoText}>푸드박스 기기의 식별변호를 입력해주세요.</Text>
                    <CodeInputIiew number = {setResult}/>
                    {showErrorMessage && <Text style = {styles.errorMessage}>{errorMessage}</Text>}
                    <TouchableOpacity onPress = {onSubmitCodePress} style = {styles.buttonContainer}>
                        <Text style = {styles.buttonText}>확인</Text>
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
        paddingTop :  Platform.OS === 'ios' ? getStatusBarHeight(true) : Constants.statusBarHeight
    },
    topBarContainer : {
        width : "100%",
        height : "10%",
        flexDirection : "row",
        alignItems : 'center',
        justifyContent : 'space-between',
    },
    logoutContainer: {
        alignItems : 'flex-end',
        paddingRight : 15,
        justifyContent : "center",
        width : "20%",
        height : '100%',
    },
    logo: {
        height : 50,
        width : 50,
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
    },
    Logo : {
        width : 30,
        height : 30,
    }
})