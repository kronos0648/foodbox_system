import React, {useState} from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Alert, Platform, BackHandler} from 'react-native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import colors from "../config/colors";
import LogoTitle from "../components/LogoTitle"; 
import OrderListItem from "../components/OrderListItem";
import * as FileSystem from 'expo-file-system';
import url from "../data/url"
import {useFocusEffect} from '@react-navigation/native'
import decryptString from '../hooks/decryption'
import { StatusBar } from "expo-status-bar";
import Constants from 'expo-constants';

export default function OrederListScreen({navigation, params}){

    const [cat1Color, setCat1Color] = useState(colors.white);
    const [cat2Color, setCat2Color] = useState(colors.lightgrey);
    const [cat3Color, setCat3Color] = useState(colors.lightgrey);
    const [category, setCategory] =useState("0")
    const [isRefreshing, setIsRefreshing] = useState(false);

    const [orderList, setOrderList] = useState([]);
    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;
            let shouldRepeat = false;
            const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)

            const getOrderList = async () => {
                do{
                    try {
                        const jwt = await FileSystem.readAsStringAsync(
                            url.atFileUri,
                            {encoding: FileSystem.EncodingType.UTF8}); 
                        const response = await fetch(decryptString(url.addressEncrypt) + '/order_list', {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': jwt
                        },});
                        const data = await response.json();
                        if('error' in data){// 토큰 만료됐다!
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
                        }else{//토큰 만료되지 않았다. 
                            shouldRepeat = false;
                            setOrderList(data.order_list)
                        }
                    } catch (error) {
                        console.error(error);
                    }
                }while(shouldRepeat==true)
            }
            getOrderList();         
            return () => {
                backHandler.remove();
                isActive = false;
            }
    }, [])
)

    const onRefresh = async () => {
        setIsRefreshing(true);
        let shouldRepeat = false;

            const getOrderList = async () => {
                do{
                    try {
                        
                        const jwt = await FileSystem.readAsStringAsync(
                            url.atFileUri,
                            {encoding: FileSystem.EncodingType.UTF8}); 
                        const response = await fetch(decryptString(url.addressEncrypt) + '/order_list', {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': jwt
                        },});
                        const data = await response.json();
                        if('error' in data){// 토큰 만료됐다!
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
                        }else{//토큰 만료되지 않았다. 
                            shouldRepeat = false;
                            setOrderList(data.order_list)
                        }
                    } catch (error) {
                        console.error(error);
                    }
                }while(shouldRepeat==true)
            }
            getOrderList(); 
        setIsRefreshing(false);
  }
    const handleLogout = async () => {
            try {
                const jwt = await FileSystem.readAsStringAsync(
                    url.atFileUri, 
                    {encoding: FileSystem.EncodingType.UTF8}); 
                const response = await fetch(decryptString(url.addressEncrypt) + '/logout',{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': jwt
                    },
                });
                const status = response.status;
                
                if(status === 201){//토큰 만료되지 않았다. 
                    shouldRepeat = false;
                    // insert action here 
                        const atDelet = await FileSystem.deleteAsync(url.atFileUri, {encoding: FileSystem.EncodingType.UTF8});
                        const rtDelet = await FileSystem.deleteAsync(url.rtFileUri, {encoding: FileSystem.EncodingType.UTF8});
                        navigation.navigate("Login")
                }
            } catch (error) {
                console.error(error);
            }
    }

    const onLogoutPress = () => {
        Alert.alert(
            '로그아웃',
            '로그아웃 하시겠습니까?',
            [
                { text: '취소'},
                { text: '확인', onPress: handleLogout},
            ],
            { cancelable: true }
          );
   }
   const deliveryStandbyPressed = () => {
    setTimeout(function() {
        setCat1Color(colors.white);
        setCat2Color(colors.lightgrey);
        setCat3Color(colors.lightgrey);
        setCategory("0")
    }, 300);
    
   }
   const deliveryInProgressPressed = () => {
    setTimeout(function() {
        setCat1Color(colors.lightgrey);
        setCat2Color(colors.white);
        setCat3Color(colors.lightgrey);
        setCategory("1");
    }, 300);
   }
   const deliveryCompletePressed = () => {
    setTimeout(function() {
        setCat2Color(colors.lightgrey);
        setCat3Color(colors.white)
        setCat1Color(colors.lightgrey);
        setCategory("2")
    }, 300);
   }
    return(
        <View style = {styles.mainContainer} >
            <StatusBar translucent = {true} hidden = {false} style = "dark"/>
            <View style = {styles.topBarContainer}>
                <View style = {styles.topBarLogoContainer}>
                    <Image style = {styles.logo} source  = {require("../assets/logo.png")} />
                    <LogoTitle size = {22}/>
                </View>
                <TouchableOpacity style = {styles.logoutContainer} onPress={onLogoutPress} >
                    <MaterialCommunityIcons size = {25} color = {"black"} name = {"logout"} />
                    <Text style = {styles.logoutText} >로그아웃</Text>
                </TouchableOpacity>  
            </View>     
            <View style = {styles.orderListContainer} >
                <View style = {styles.categoryContainer} >
                    <TouchableOpacity
                                        style = {[styles.categoryButton, {backgroundColor : cat1Color}]} 
                                        onPress = {deliveryStandbyPressed} >
                        <Text style = {styles.categoryText} >배달 준비</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                                        style = {[styles.categoryButton, {backgroundColor : cat2Color}]} 
                                        onPress = {deliveryInProgressPressed}> 
                        <Text style = {styles.categoryText}>배달 중</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                                        style = {[styles.categoryButton, {backgroundColor : cat3Color}]} 
                                        onPress = {deliveryCompletePressed}>
                        <Text style = {styles.categoryText}>배달 완료</Text>
                    </TouchableOpacity>
                </View>
                <View style ={styles.flatlist} >
                    <FlatList
                        data={orderList.filter((item) => item.state == category).sort((p1, p2) => (p1.order_id < p2.order_id) ? 1 : (p1.order_id > p2.order_id) ? -1 : 0)}
                        renderItem={({item}) => <OrderListItem item = {item} navigation = {navigation}/>}
                        keyExtractor={item => item.order_id}
                        onRefresh={onRefresh}
                        refreshing = {isRefreshing}
                        ListEmptyComponent={<Text style = {{fontSize : 20, color : "grey", alignSelf : "center", marginTop : 150}}>주문 내역이 없습니다.</Text>}
                    />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer : {
        justifyContent :"flex-start",
        alignItems : 'center',
        backgroundColor : "white",
        paddingTop :  Platform.OS === 'ios' ?  getStatusBarHeight(true) : Constants.statusBarHeight,
    },
    topBarContainer : {
        width : "100%",
        height : "10%",
        flexDirection : "row",
        alignItems : 'center',
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
    categoryContainer : {
        width : "95%",
        height : "10%",
        backgroundColor : colors.grey,
        flexDirection : "row",
        borderRadius : 5,
        marginVertical : 20,
        alignItems : 'center',
        justifyContent : "space-around"
    },
    orderListContainer : {
        width : "100%",
        height : "90%",
        backgroundColor : colors.blue,
        alignItems : 'center',
        justifyContent : "flex-start"
    },
    flatlist : {
        justifyContent: "center"
    },
    logo: {
        height : 40,
        width : 40,
        resizeMode : 'contain',
        marginHorizontal : 15
    },
    logoutText : {
        fontSize : 12,
        marginTop :5
    },
    categoryButton : {
        width: "31%",
        height : "85%", 
        borderRadius : 5,
        alignItems : "center",
        justifyContent : "center",

    },
    categoryText : {
        fontSize : 16
    }

})