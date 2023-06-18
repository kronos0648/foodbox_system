import React, {useState} from 'react';
import {View, StyleSheet, Text, Image, Platform, TouchableOpacity} from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { useFocusEffect } from '@react-navigation/native';
import CustomButton from '../components/CustomButton';
import * as FileSystem from 'expo-file-system';
import url from '../config/url';
import decryptString from '../config/decryption.js'
import Ionicons from '@expo/vector-icons/Ionicons'
import MaterialComunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import colors from '../config/colors'
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';

export default function OrderDetails({navigation, route}){
const order_id = route.params.order_id;
const [order, setOrder] = useState(null);
const [deliveryStatus, setDeliveryStatus] = useState("");
const [deliveryIcon, setDeliveryIcon] = useState("");
const [deliveryIconColor, setDeliveryIconColor] = useState("red");

useFocusEffect(
  React.useCallback(() => {
      let isActive = true;
      let shouldRepeat = false;

      const getOrderSpec = async () => {
          do{
              try {
                const jwt = await FileSystem.readAsStringAsync(
                  url.atFileUri, 
                  {encoding: FileSystem.EncodingType.UTF8}); 
  
                const response = await fetch(decryptString(url.addressEncrypt) + '/order_spec?order_id=' + order_id.toString(), {
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
                      const responseRefresh = await fetch(decryptString(url.addressEncrypt) + '/reissue',{
                                  method: 'POST',
                                  headers: {
                                      'Content-Type': 'application/json',
                                      'Authorization': rt
                                  },});
                      const json = responseRefresh.status;
                      if(json === 200){
                          shouldRepeat = true;
                          const atDelet = await FileSystem.deleteAsync(url.atFileUri, {encoding: FileSystem.EncodingType.UTF8});
                          const at = responseRefresh.headers.map.authorization;
                          await FileSystem.writeAsStringAsync(
                              url.atFileUri, 
                              at, 
                              {encoding: FileSystem.EncodingType.UTF8});
                      }else{
                          console.log(JSON.stringify(responseRefresh))
                      }
                    }else{
                      shouldRepeat = false
                      setOrder(data);
                      if(data.state === "0"){
                        setDeliveryStatus("배달 준비")
                        setDeliveryIcon("truck-fast") 
                        setDeliveryIconColor("red")
                      }else if (data.state === "1"){
                        setDeliveryStatus("배달 중")
                        setDeliveryIcon("truck-delivery") 
                        setDeliveryIconColor(colors.orange)
                      }else{
                        setDeliveryStatus("배달 완료")
                        setDeliveryIcon("truck-check") 
                        setDeliveryIconColor("green")
                      }
                    }
              } catch (error) {
                  console.error(error);
              }
          }while(shouldRepeat==true)
      }
      getOrderSpec();
      return () => {
          isActive = false;
      }
}, [])
)

return(
 <View style = {styles.container} >
  <StatusBar translucent = {true} hidden = {false} style = "dark"/>
  <View style = {styles.topContainer} >
      <Image  style = {styles.logo}
              source = {require('../assets/foodbox.png')}/>
      <TouchableOpacity style = {styles.logoutButton} onPress = {() => navigation.navigate("OrderHistoryList")}>
        <Ionicons name = "return-up-back" size = {35} color = {colors.black} />
      </TouchableOpacity>
  </View>
  <View style = {styles.mainContainer}>
    <Text style = {styles.textOrder}>주문번호: {order_id} </Text>
    <View style = {styles.deliveryContainer} >
      <Text style = {[styles.text, {fontSize : 18}]}>배달 상태: </Text>
      <View style = {styles.devlieryIconContainer}>
        <MaterialComunityIcons name = {deliveryIcon} size = {35} color = {deliveryIconColor}/>
        <Text style = {{color : colors.darkgrey, fontSize : 12}} >{deliveryStatus}</Text>
      </View>
    </View>
    <View style = {[styles.case, {paddingVertical : deliveryStatus === "배달 중" ? 7 :15 }]} >
        <Text style={styles.smallText}>(중)차돌떡볶이 1개</Text>
        <Text style={styles.smallText}>- 기본: 17,000원</Text>
        <Text style={styles.smallText}>-사이즈 선택: 대(3~4인)(3,000원)</Text>
        <Text style={styles.smallText}>-맵기: 기본맛</Text>
        <Text style={styles.smallText}>-추가 선택 : 부산어묵 추가(1,000원)</Text>
        <Text style={styles.smallText}></Text>
        <Text style={styles.smallText}>버터갈릭감자튀김 1개</Text>
        <Text style={styles.smallText}>-기본: 5,500원</Text>
        <Text style={[styles.text, {fontWeight : "bold"}]}>26,500원</Text>
    </View>
    <View style = {[styles.case, {paddingVertical : deliveryStatus === "배달 중" ?7 :15 }]} >
        <Text style={styles.title}>결제금액</Text>
        <View style = {styles.textWithPrice}>
          <Text style = {styles.text}>주문금액</Text>
          <Text style = {styles.text}>26,500원</Text>
        </View>
        <View style = {styles.textWithPrice}>
          <Text style = {styles.text}>푸드박스 옵션 추가</Text>  
          <Text style = {styles.text}>3,500원</Text>  
        </View>
    </View>   
    <View style = {[styles.case, {paddingVertical : deliveryStatus === "배달 중" ?7 :15 }]} >
      <View style = {styles.textWithPrice}>
          <Text style={styles.title}>총 결제금액</Text>    
          <Text style={styles.title}>30,000원</Text>    
      </View>
    </View>
    <View style = {[styles.case, {paddingVertical : deliveryStatus === "배달 중" ? 7 : 15}]} >
      <Text style={styles.smallText}>배달주소: 충청남도 아산시 탕정면 선문로 71번길 200, 기숙사</Text>
      <Text style={styles.smallText}>가게 사장님께</Text>
      <Text style={styles.smallText}>(푸드박스 옵션O) (수저,포크X)</Text>
      <Text style={styles.smallText}></Text>
    </View>
  </View>
  <View style = {styles.bottomContainer}>
    {deliveryStatus === "배달 중" && 
      <CustomButton 
                text = '푸드박스 잠금 해제'
                color = "lightgreen"
                height = "60%"
                width = "80%"
                marginBottom = {10}
                onPress={() => {
                  navigation.navigate("FoodboxAllocationScreen", {order : order})// 푸드박스 잠금해제 화면으로 이동
      }}/>}
  </View>    
</View>  
)}


const styles = StyleSheet.create({
  container : {
    width : "100%",
    height : "100%",
     paddingTop :  Platform.OS === 'ios' ? getStatusBarHeight(true) : Constants.statusBarHeight,
     backgroundColor : 'white',
     justifyContent : 'flex-start'
  },
  mainContainer : {
    alignItems : "flex-start",
    justifyContent : "space-between",
    width : "100%",
    height : "75%",
    paddingHorizontal : 25,
    paddingTop : 10
  },
  logo: {
    height: 40,
    width : 40,
    resizeMode : "contain",
  },
  logoutButton : {
    alignItems : "center",
    justifyContent: "center",
  },
  topContainer : {
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
  deliveryContainer : {
    flexDirection : 'row',
    alignItems : 'center',
    justifyContent : 'space-between',
    width : "100%",
  },
  devlieryIconContainer : {
    alignItems : 'center',
    justifyContent : 'center',
    width : "20%"
  },
  bottomContainer : {
    alignItems : "center",
    justifyContent : "flex-start",
    width : "100%",
    height : "18%",
  },
  case: {
    paddingVertical : 7,
    borderTopWidth : 1,
    borderTopColor : "lightgrey",
    width : "100%",
  },  
  textWithPrice : {
    flexDirection : "row",
    justifyContent : "space-between",
    alignItems : "center",
    width : "100%"
  },
  smallText: {
    fontSize : 12
  },
  title : {
    fontSize : 18,
    fontWeight : 'bold',
    marginBottom :5
  },
  text : {
    fontSize : 14,
    fontWeight : '400',
  },
  textOrder : {
    fontSize : 18,
    fontWeight : '500',
    color : colors.darkgrey
  },
});