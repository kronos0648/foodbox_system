import React from 'react';
import {View, StyleSheet,Text, TouchableOpacity, Image, Alert, Platform} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import CustomButton from '../components/CustomButton';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import * as FileSystem from 'expo-file-system';
import url from '../config/url';
import decryptString from '../config/decryption.js'
import colors from '../config/colors';
import {StatusBar} from 'expo-status-bar'
import Constants from 'expo-constants';

export default function OrderRequest({navigation, route}){
  const store = route.params.store;

  const handleRequest = async () => {
    let shouldRepeat = false;
    do{
        try {
          const jwt = await FileSystem.readAsStringAsync(
            url.atFileUri, 
            {encoding: FileSystem.EncodingType.UTF8}); 

          const response = await fetch(decryptString(url.addressEncrypt) + '/order',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'authorization': jwt
          },
          body: JSON.stringify({store_id : store.store_id}),
          });
          const json = response.status;
          if(json === 201){
            shouldRepeat = false;
            navigation.navigate("StoreList")
          }else if(json === 401){
            const rt = await FileSystem.readAsStringAsync(
              url.rtFileUri,
              {encoding: FileSystem.EncodingType.UTF8}); 
            const response = await fetch(decryptString(url.addressEncrypt) + '/reissue',{
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': rt
                        },});decryptString(url.addressEncrypt)
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
            shouldRepeat = false;
            console.log(json)
          }
          } catch (error) {
          console.error(error);
          }
      }while(shouldRepeat === true)          
  }

  const onOrderRequestPressed = () => {
    Alert.alert(
        '주문 접수',
        '주문 접수 완료되었습니다.',
        [
            { text: '확인', onPress: handleRequest},
        ],
        { cancelable: true }
      );
  }

return(
 <View style = {styles.container} >
    <StatusBar translucent = {true} hidden = {false} style = "dark"/>
    <View style = {styles.topBarContainer} >
        <Image  style = {styles.logo}
                source = {require('../assets/foodbox.png')}/>
        <TouchableOpacity style = {styles.logoutButton} onPress = {() => navigation.navigate("StoreList")}>
          <Ionicons name = "return-up-back" size = {35} color = {colors.black} />
        </TouchableOpacity>
    </View>
  <View style = {styles.topContainer}>
    <Text style = {styles.text} >아산시 탕정면 선문로 221번길 70, 기숙사</Text>
    <Text style = {styles.text}>010-xxxx-xxxx</Text>
    <View style = {styles.case} >
        <Text style={styles.title}>요청사항</Text>
        <View style = {styles.iconAndText}>
          <Ionicons name ="checkbox-outline" size = {25} color = "black"  />
          <Text style = {[styles.text, {marginLeft : 8}]}>푸드박스 옵션</Text>
        </View>
        <View style = {styles.iconAndText}>
          <Ionicons name ="checkbox-outline" size = {25} color = "black"  />
          <Text style = {[styles.text, {marginLeft : 8}]}>일회용 수저, 포크X</Text> 
        </View>
    </View>
    <View style = {styles.case} >
        <Text style={styles.title}>결제금액</Text>
        <View style = {styles.textWithPrice}>
          <Text style = {styles.text}>주문금액</Text>
          <Text style = {styles.text}>26,500원</Text>
        </View>
        <View style = {styles.textWithPrice}>
          <Text style = {styles.text}>배달팁</Text>  
          <Text style = {styles.text}>3,500원</Text>  
        </View>
    </View>   
    <View style = {styles.case} >
      <View style = {styles.textWithPrice}>
          <Text style={styles.title}>총 결제금액</Text>    
          <Text style={styles.title}>30,000원</Text>    
      </View>
    </View>
  </View>
  <View style = {styles.bottomContainer}>
    <CustomButton 
            style = {{alignSelf : 'center'}}
            text = '주문하기'
            color = '#8CBDEf'
            height = {60}
            width = "100%"
            onPress={onOrderRequestPressed}/>  
  </View>
</View>  
)}

const styles = StyleSheet.create({
  container : {
    paddingTop :  Platform.OS === 'ios' ? getStatusBarHeight(true) : Constants.statusBarHeight,
    backgroundColor : 'white',
    justifyContent : 'space-between',
  },
  topContainer : {
    width : "100%",
    height : "80%",
    paddingHorizontal : 20,
  },
  topBarContainer: {
    flexDirection : 'row',
    alignItems : 'center',
    justifyContent : 'space-between',
    width : "100%",
    height: "8%",
    paddingHorizontal : 20,
    paddingVertical :5,
    borderBottomWidth : 1,
    borderBottomColor : colors.lightgrey
  },
  logo: {
    height: 40,
    width : 40,
    resizeMode : "contain",
  },
  bottomContainer : {
    width : "100%",
    height : "13%",
    alignItems : "center",
    justifyContent: "center"
  },
  case: {
    paddingVertical : 10,
    borderTopWidth : 1,
    borderTopColor : "lightgrey"
  },

  iconAndText : {
    flexDirection : "row",
    alignItems : "center",
    justifyContent : "flex-start",
    marginBottom : 10,
  },
  
  textWithPrice : {
    flexDirection : "row",
    justifyContent : "space-between",
    alignItems : "center"
  },
  
  

  title : {
    fontSize : 20,
    fontWeight : 'bold',
    marginVertical :10
  },
  text : {
    fontSize : 14,
    fontWeight : '400',
    marginVertical :10
  },
  logoutButton : {
    alignItems : "center",
    justifyContent: "center",
  },


});