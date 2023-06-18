import React, {useState} from 'react';
import {View, Image, TouchableOpacity,  StyleSheet, Text, FlatList, Alert, Platform, BackHandler} from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Ionicons from '@expo/vector-icons/Ionicons'
import CustomButton from '../components/CustomButton';
import colors from '../config/colors'
import StoreListItem from '../components/StoreListItem';
import * as FileSystem from 'expo-file-system';
import url from '../config/url';
import {useFocusEffect} from '@react-navigation/native'
import decryptString from '../config/decryption.js'
import {StatusBar} from 'expo-status-bar';
import Constants from 'expo-constants';

export default function StoreList({navigation}){
  const [storeList, setStoreList] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
        let isActive = true;
        let shouldRepeat = false;
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)

        const getStoreList = async () => {
            do{
                try {                
                    const jwt = await FileSystem.readAsStringAsync(
                        url.atFileUri,
                        {encoding: FileSystem.EncodingType.UTF8}); 
                    const response = await fetch(decryptString(url.addressEncrypt) + '/store_list', {
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
                        setStoreList(data.store_list)
                    }
                } catch (error) {
                    console.error(error);
                }
            }while(shouldRepeat==true)
        }
        getStoreList();  
        return () => {
          isActive = false;
          backHandler.remove()
        }
      }, [])
      )

      const onRefresh = async () => {
        setIsRefreshing(true);
        let shouldRepeat = false;
            do{
                try {
                    
                    const jwt = await FileSystem.readAsStringAsync(
                        url.atFileUri,
                        {encoding: FileSystem.EncodingType.UTF8}); 
                    const response = await fetch(decryptString(url.addressEncrypt) + '/store_list', {
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
                        setStoreList(data.store_list)
                    }
                } catch (error) {
                    console.error(error);
                }
            }while(shouldRepeat==true)
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
            { text: '확인', onPress: handleLogout },
        ],
        { cancelable: true }
      );
  }

  return(
    <View style = {styles.mainContainer} >
      <StatusBar translucent = {true} hidden = {false} style = "dark"/>

      <View style = {styles.topBarContainer} >
        <Image  style = {styles.logo}
                source = {require('../assets/foodbox.png')}/>
        <Text style = {{fontSize : 25, fontWeight : '600'}}>가게 목록</Text>
        <TouchableOpacity style = {styles.logoutButton} onPress = {onLogoutPress}>
          <Ionicons name = "log-out-outline" size = {30} color = {"black"} />
          <Text style = {styles.logoutText} >로그아웃</Text>
        </TouchableOpacity>
      </View>
      <View style = {styles.bottomContainer} > 
        <CustomButton
            text = '주문 내역'
            color = {colors.blue}
            height = {40}
            width = {100}
            margin = {10}
            alignSelf = "flex-end"
            onPress={() =>navigation.navigate("OrderHistoryList")}
        />
        <FlatList
                    data={storeList}
                    renderItem={({item}) => <StoreListItem item = {item} navigation = {navigation}/>}
                    keyExtractor={item => item.store_id}
                    onRefresh={onRefresh}
                    refreshing = {isRefreshing}
                    bounces = {false}
                    ListEmptyComponent={<Text style = {{fontSize : 16, alignSelf : 'center'}}>등록된 가게가 없습니다.</Text>}/>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer : {
    alignItems : 'center',
    justifyContent : 'center',
    backgroundColor : 'white', 
    width : "100%",
    height : '100%',
    paddingTop : Platform.OS === 'ios' ? getStatusBarHeight(true) : Constants.statusBarHeight,
  },
  topBarContainer : {
    flexDirection : "row",
    justifyContent : 'space-between',
    alignItems : 'center',
    width: "100%",
    height: "10%",
  },
  logoutButton : {
    alignItems : "center",
    justifyContent: "center",
    height : "100%",
    width : "20%",
  },
  logoutText : {
    marginTop : 5,
    fontSize :12
  },
  logo: {
    height: 50,
    width : 50,
    resizeMode : "contain",
    marginLeft : 20
  },
  bottomContainer : {
    width: "100%",
    height : "90%",
    backgroundColor : colors.lightblue,
    justifyContent : 'flex-start'
  }
})