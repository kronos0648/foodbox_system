import React, { useState } from "react";
import { View, StyleSheet, Image, TouchableOpacity, Text, Platform} from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height';
import colors from "../config/colors";
import Ionicons from '@expo/vector-icons/Ionicons'
import LogoTitle from "../components/LogoTitle";
import OrderInfoTable from "../components/OrderInfoTable";
import url from "../data/url";
import * as FileSystem from 'expo-file-system';
import { useFocusEffect } from "@react-navigation/native";
import decryptString from '../hooks/decryption.js'
import { StatusBar } from "expo-status-bar";
import Constants from 'expo-constants';

export default function OrderInfoScreen({route, navigation}){
    const orderInfo = route.params.order;
    const [order, setOrder] = useState(orderInfo);

    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;
            let shouldRepeat = false;

            const getOrderSpec = async () => {
                do{
                    try {
                        console.log("orderRequestStart")
                        // insert request here 
                        const jwt = await FileSystem.readAsStringAsync(
                            url.atFileUri,
                            {encoding: FileSystem.EncodingType.UTF8}); 
                        const response = await fetch(decryptString(url.addressEncrypt) + '/order_spec?' + new URLSearchParams({order_id : orderInfo.order_id}), {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': jwt
                        },
                        });
                        const data = await response.json();
                        console.log(data);
                        console.log("orderRequestFinish")
                        if('error' in data){// 토큰 만료됐다!
                            shouldRepeat = true;
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
                                const atDelet = await FileSystem.deleteAsync(url.atFileUri, {encoding: FileSystem.EncodingType.UTF8});
                                const at = response.headers.map.authorization;
                                console.log(at)
                                console.log(shouldRepeat)
                                await FileSystem.writeAsStringAsync(
                                    url.atFileUri, 
                                    at, 
                                    {encoding: FileSystem.EncodingType.UTF8});
                            }else{
                                console.log(JSON.stringify(response))
                            }
                        }else{//토큰 만료되지 않았다. 
                            shouldRepeat = false;
                            setOrder(data)
                        }
                    } catch (error) {
                        console.error(error);
                    }
                }while(shouldRepeat==true)
              };
              getOrderSpec();
              return () => {
                isActive = false;
              }
        }, [])
    )



    const onFoodboxAllocPress = () => {
        navigation.navigate('FoodboxAllocation', {order : order} )
    }
    const onFoodboxManagePress = () => {
        navigation.navigate('FoodboxManager', {dev_id : order.dev_id, order : order} )
    }
    const onFoodboxDelocPress = async() => {
        let shouldRepeat = false;
        do {
            try {
                const at = await FileSystem.readAsStringAsync(url.atFileUri, {encoding : FileSystem.EncodingType.UTF8}) 
                const response = await fetch(decryptString(url.addressEncrypt) + '/dismission', {
                    method : 'POST',
                    headers : {
                        'Content-Type' : 'application/json',
                        'Authorization' : at
                    },
                    body: JSON.stringify({order_id : order.order_id}),
                })
                const status = response.status;
                if(status === 201){
                    shouldRepeat = false;
                    delete order.dev_id;
                    navigation.navigate('OrderList');
                }else if(status === 401){
                    const rt = await FileSystem.readAsStringAsync(url.rtFileUri, {encoding : FileSystem.EncodingType.UTF8})
                    const refreshResponse = await fetch(decryptString(url.addressEncrypt) + '/reissue', {
                        method : 'POST',
                        headers : {
                            'Content-Type' : 'application/json',
                            'Authorization' : rt
                        }
                    })
                    const refreshStatus = refreshResponse.status;
                    if(refreshStatus === 200){
                        shouldRepeat = true;
                        const at = response.headers.map.authorization;
                        console.log(at);
                        const deleteAt = await FileSystem.deleteAsync(url.atFileUri);
                        await FileSystem.writeAsStringAsync(
                            url.atFileUri,
                            at,
                            {encoding : FileSystem.EncodingType.UTF8}
                        )
                    }else{
                        console.log("REFRESH ERROR");
                    }
                }else{
                    shouldRepeat = false;
                    console.log(status)
                }
            } catch (error) {
                console.error(error);  
            }
            
        } while (shouldRepeat === true);
    }

    return(
        <View style = {styles.mainContainer} >
            <StatusBar translucent = {true} hidden = {false} style = "dark"/>
            <View style = {styles.topBarContainer}>
                <View style = {styles.topBarLogoContainer}>
                    <Image style = {styles.logo} source  = {require("../assets/logo.png")} />
                    <LogoTitle size = {22}/>
                </View>   
                <TouchableOpacity style = {styles.logoutContainer} onPress={() => navigation.goBack() } >
                    <Ionicons name = "return-up-back" size = {32} color = "black"/>
                </TouchableOpacity>  
            </View>     
            <View style = {styles.bottomContainer}>
                <OrderInfoTable order = {order}/>
                <View style = {styles.buttonContainer}>
                    {'dev_id' in order && order.state != "2" &&
                    <TouchableOpacity style = {styles.foodboxAllocButton} onPress = {onFoodboxManagePress} >
                        <Text style = {styles.foodboxAllocButtonText} >푸드박스 기기 관리</Text>
                    </TouchableOpacity>
                    }
                    {!('dev_id' in order) && order.state != "2" &&
                    <TouchableOpacity style = {styles.foodboxAllocButton} onPress = {onFoodboxAllocPress} >
                        <Text style = {styles.foodboxAllocButtonText} >푸드박스 할당하기</Text>
                    </TouchableOpacity>
                    }
                    {order.state === "2" && 'dev_id' in order &&
                    <TouchableOpacity style = {styles.foodboxAllocButton} onPress = {onFoodboxDelocPress} >
                        <Text style = {styles.foodboxAllocButtonText} >푸드박스 할당 헤제하기</Text>
                    </TouchableOpacity>}
                    
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer : {
        justifyContent :"flex-start",
        alignItems : 'center',
        paddingTop : Platform.OS === 'ios' ? getStatusBarHeight(true) : Constants.statusBarHeight,
        backgroundColor : "#fff",
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
        justifyContent : "flex-start",
        backgroundColor : colors.blue
    },
    buttonContainer : {
        width : '100%',
        height : '30%',
        alignItems : "center",
        justifyContent : "center",
    },
    foodboxAllocButton : {
        height : 100,
        width : 250,
        alignItems : 'center',
        justifyContent : 'center',
        backgroundColor :colors.orange,
        borderRadius :10
    },
    foodboxAllocButtonText : {
        color : colors.white,
        fontWeight : "800",
        fontSize :16
    }
})