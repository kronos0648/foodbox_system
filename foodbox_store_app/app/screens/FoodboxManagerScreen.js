import React, {useState, useEffect} from "react";
import { View, Image, StyleSheet, Text, TouchableOpacity, Alert, Platform, BackHandler} from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height';
import colors from "../config/colors";
import LogoTitle from "../components/LogoTitle";
import Ionicons from '@expo/vector-icons/Ionicons'
import OrderInfoFoodboxManager from "../components/OrderInfoFoodboxManager";
import Button from "../components/Button";
import url from "../data/url"
import * as FileSystem from 'expo-file-system';
import decryptString from '../hooks/decryption.js'
import { StatusBar } from "expo-status-bar";
import Constants from 'expo-constants';

export default function FoodboxManagerScreen({navigation, route}){
    const dev_id = route.params.dev_id;
    const order = route.params.order;
    
    const [deliveryStatus, setDeliveryStatus] = useState(order.state);
    const [isLocked, setIsLocked] = useState(false);

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
        statusInfo()

        return () => backHandler.remove()
    }, [deliveryStatus, isLocked])

    const basicRequest = async (path) => {
        try {
            //jwt 파일에서 읽어오기
            const jwt = await FileSystem.readAsStringAsync(
                url.atFileUri, 
                {encoding: FileSystem.EncodingType.UTF8});
            //잠금 요청
            const response = await fetch(decryptString(url.addressEncrypt) + path,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': jwt
                },
                body: JSON.stringify({order_id : order.order_id}),
                });
            const status = response.status;
            return status;
        } catch (error) {
            console.error(error);
        }
    }
    
    const refreshRequest = async () =>{
        try {
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
                await FileSystem.writeAsStringAsync(
                    url.atFileUri, 
                    at, 
                    {encoding: FileSystem.EncodingType.UTF8});
            }else{
                console.log(JSON.stringify(response))
            }
            return json;
        } catch (error) {
            console.error(error)
        }
        
    }

    const onLockUnlockPress = async (path) =>{
        let shouldRepeat = false;
        try {
            do {
                const requestStatus = await basicRequest(path);
                if(requestStatus ===201){
                    shouldRepeat = false;
                    setIsLocked(!isLocked);
                }else if(requestStatus === 401){
                    const refreshStatus = await refreshRequest();
                    if(refreshStatus === 200){
                        shouldRepeat = true;
                    }else{
                        console.log(refreshStatus);
                    }
                }else{
                    shouldRepeat = false;
                    console.log("Main request error.")
                }
            } while (shouldRepeat === true);
        } catch (error) {
            console.log("error")
        }
    }

    const onDeliveryStartPress = async () =>{
        let shouldRepeat = false;
        try {
            do {
                const requestStatus = await basicRequest('/start');
                if(requestStatus ===201){
                    shouldRepeat = false;
                    setDeliveryStatus("1");
                    order.state = '1';
                }else if(requestStatus === 401){
                    const refreshStatus = await refreshRequest();
                    console.log(refreshStatus);
                    if(refreshStatus === 200){
                        shouldRepeat = true;
                    }else{
                        console.log(refreshStatus);
                    }
                }else{
                    shouldRepeat = false;
                    console.log("Main request error.")
                }
            } while (shouldRepeat === true);
        } catch (error) {
            console.log("error")
        }
    }

    const handleDelocate = async () => {
        let shouldRepeat = false;
        try {
            do {
                const requestStatus = await basicRequest('/dismission');
                if(requestStatus ===201){
                    shouldRepeat = false;
                    delete order.dev_id;
                    navigation.navigate("OrderInfo", {order: order})
                }else if(requestStatus === 401){
                    const refreshStatus = await refreshRequest();
                    if(refreshStatus === 200){
                        shouldRepeat = true;
                    }else{
                        console.log(refreshStatus);
                    }
                }else{
                    shouldRepeat = false;
                    console.log("Delocation error.")
                }
            } while (shouldRepeat === true);
        } catch (error) {
            console.log("error")
        }
    }

    const onDelocatePress = async() =>{
        Alert.alert(
            '할당 해제하기',
            '푸드박스 기기 할당을 해제하시겠습니까?',
            [
                { text: '취소'},
                { text: '확인', onPress: () => handleDelocate()},
            ],
            { cancelable: true, }
          );
    }
    
    lockButton =    <Button 
                    onPress = {() => onLockUnlockPress('/lock')}
                    color = {"white"} 
                    icon = {"lock-closed"}
                    iconSize = {30}
                    height = {150}
                    width={250}
                    title = {"기기잠금"}/>

    unlockButton = <Button 
                    onPress = {() => onLockUnlockPress('/unlock')}
                    color = {"white"} 
                    icon = {"lock-open"}
                    iconSize = {30}
                    height = {150}
                    width={250}
                    title = {"기기 잠금해제"}/>

    delocButton =   <Button 
                    onPress= {onDelocatePress}
                    color = {"white"} 
                    textColor={"red"}
                    height = {50}
                    width={150}
                    title = {"할당 해제하기"}
                    textSize={20}/>

    startDelivery = <Button     
                    onPress= {onDeliveryStartPress}
                    color = {"lightgreen"} 
                    textColor={"white"}
                    height = {150}
                    width={250}
                    title = {"배달 시작"}
                    textSize={20}/>
        
    statusInfo = () => {
        if(deliveryStatus == "0") {
            if(isLocked){
                return(
                    <Text style = {styles.statusInfo}>상태 : 잠금 | 배달 준비</Text>
                )
            }else {
                return(
                    <Text style = {styles.statusInfo}>상태 : 잠금 해제 | 배달 준비</Text>
                )
            }
        }
        else if(deliveryStatus == "1"){
            return(
                <Text style = {styles.statusInfo}>상태 : 잠금 | 배달 중</Text>
            )
        }else if(deliveryStatus == "2"){
            if(isLocked){
                return(
                    <Text style = {styles.statusInfo}>상태 : 잠금 | 배달 완료 </Text>
                )
            }else {
                return(
                    <Text style = {styles.statusInfo}>상태 : 잠금 해제 | 배달 완료</Text>
                )
            }
        }
    }

    displayButton1 = () => {
        if(deliveryStatus == "0") {
            if(isLocked){
                return startDelivery
            }else {
                return lockButton
            }
        }
        else if(deliveryStatus == "1"){
            if(isLocked){
                return unlockButton
            }else {
                return lockButton
            }
        }else if(deliveryStatus == "2"){
            return delocButton
        }
    }
    displayButton2 = () => {
        if(deliveryStatus == "0") {
            if(isLocked){
                return unlockButton
            }else {
                return delocButton
            }
        }else if(deliveryStatus == "1" && !isLocked){
            return delocButton
        }
    }

    return(
        <View style = {styles.mainContainer}>
            <StatusBar translucent = {true} hidden = {false} style = "dark"/>
            <View style = {styles.topBarContainer}>
                <View style = {styles.topBarLogoContainer}>
                    <Image style = {styles.logo} source  = {require("../assets/logo.png")} />
                    <LogoTitle size = {22}/>
                </View>   
                <TouchableOpacity style = {styles.logoutContainer} onPress={() => navigation.navigate("OrderInfo", {order: order, dev_id : order.dev_id}) } >
                    <Ionicons name = "return-up-back" size = {32} color = "black"/>
                </TouchableOpacity>  
            </View>     
            <View style = {styles.bottomContainer}>
                <OrderInfoFoodboxManager dev_id={dev_id} order = {order}/>
                {statusInfo()}
                <View style = {styles.buttonsContainer}>
                    {displayButton1()}
                    {displayButton2()}
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
  mainContainer : {
    alignItems : 'center',
    justifyContent : 'flex-start',
    height : "100%",
    backgroundColor : "white",
    paddingTop :  Platform.OS === 'ios' ?  10+ getStatusBarHeight(true) : Constants.statusBarHeight,
  },
  topBarContainer : {
    width : "100%",
    height : "8%",
    flexDirection : "row",
    alignItems : 'flex-start',
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
    backgroundColor : colors.blue,
    alignItems : 'center',
    justifyContent : 'flex-start',
    width : '100%',
    height : "92%",
},
statusInfo : {
    color : "white",
    fontSize : 20,
    fontWeight : 'bold',
    alignSelf : "flex-start",
    marginLeft :20
},
buttonsContainer : {
    alignItems : "center",
    justifyContent : "center",
    flex : 1
}
})