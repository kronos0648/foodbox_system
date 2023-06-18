import React, { useState } from 'react';
import {View, Image, TouchableOpacity,  StyleSheet, Text, FlatList, Platform} from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Constants from 'expo-constants';
import Ionicons from '@expo/vector-icons/Ionicons'
import * as FileSystem from 'expo-file-system';
import decryptString from '../config/decryption.js'
import colors from '../config/colors'
import OrderListItem from '../components/OrderListItem';
import url from '../config/url';
import {useFocusEffect} from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar';

export default function OrderHistoryList({navigation}){
  const [orderList, setOrderList] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

 
  useFocusEffect(
    React.useCallback(() => {
        let isActive = true;
        let shouldRepeat = false;

        const getStoreList = async () => {
            do{
                try {
                    const jwt = await FileSystem.readAsStringAsync(
                        url.atFileUri,
                        {encoding: FileSystem.EncodingType.UTF8}); 
                        const response = await fetch(decryptString(url.addressEncrypt) + '/order_list', {
                          method: 'GET',
                          headers: {
                              'Content-Type': 'application/json',
                              'authorization': jwt
                      },});
                      const data = await response.json();
                      if(typeof data === 'undefined') {
                        shouldRepeat = false;
                        setOrderList([]);
                      }
                      
                    else if('error' in data){// 토큰 만료됐다!
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
                      }else{
                        shouldRepeat = false
                        setOrderList(data.order_list);
                      }
                } catch (error) {
                    console.error(error);
                }
            }while(shouldRepeat==true)
        }
        getStoreList();
        return () => {
            isActive = false;
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
                      const response = await fetch(decryptString(url.addressEncrypt) + '/order_list', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'authorization': jwt
                    },});
                    const data = await response.json();
                    if(typeof data === 'undefined') {
                      shouldRepeat = false;
                      setOrderList([]);
                    }
                    
                  else if('error' in data){// 토큰 만료됐다!
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
                    }else{
                      shouldRepeat = false
                      setOrderList(data.order_list);
                    }
              } catch (error) {
                  console.error(error);
              }
          }while(shouldRepeat==true)
    setIsRefreshing(false);
  }

  return(
    <View style = {styles.mainContainer} >
      <StatusBar translucent = {true} hidden = {false} style = "dark"/>
      <View style = {styles.topBarContainer} >
        <Image  style = {styles.logo}
                  source = {require('../assets/foodbox.png')}/>
        <Text style = {styles.title}>주문 내역</Text>
        <TouchableOpacity style = {styles.logoutButton} onPress = {() => navigation.navigate("StoreList")}>
          <Ionicons name = "return-up-back" size = {30} color = {"black"} />
        </TouchableOpacity>
      </View>
      <View style = {styles.bottomContainer} > 
       <FlatList
                 data={orderList.sort((p1, p2) => (p1.order_id < p2.order_id) ? 1 : (p1.order_id > p2.order_id) ? -1 : 0)}
                 renderItem={({item}) => <OrderListItem item = {item} navigation = {navigation}/>}
                 keyExtractor={item => item.order_id}
                 onRefresh={onRefresh}
                 refreshing = {isRefreshing}
                 ListEmptyComponent={<Text style = {styles.emptyList}>주문 내역이 없습니다.</Text>}
                 />
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
    paddingTop : Platform.OS === 'ios' ? 10 + getStatusBarHeight(true) : Constants.statusBarHeight,
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
    justifyContent : 'flex-start',
    paddingTop : 15
  },
  title : {
    fontSize: 25,
    fontWeight: "600",
    alignItems : 'center',
    marginVertical : 10,
    marginHorizontal : 20
  },
  emptyList : {
    fontSize: 22,
    fontWeight: "500",
    alignSelf : 'center',
    marginVertical : 200,
    marginHorizontal : 20,
    color : "grey"
  },
})