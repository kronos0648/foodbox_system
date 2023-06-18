import React, {useState} from "react";
import { View, Alert, StyleSheet, Text, TouchableOpacity, Platform } from 'react-native'
import colors from "../config/colors";
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useFocusEffect } from "@react-navigation/native";
import Ionicons from '@expo/vector-icons/Ionicons'
import * as FileSystem from 'expo-file-system';
import url from "../data/url"
import decryptString from '../hooks/decryption.js'
import { StatusBar } from "expo-status-bar";
import Constants from 'expo-constants';

export default function FoodboxQRScreen({route, navigation}){
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const order = route.params.order;
    
    useFocusEffect(
      React.useCallback(() => {
          let isActive = true;
          setScanned(false);
          const getBarCodeScannerPermissions = async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
          };
          getBarCodeScannerPermissions();
          return () => {
            isActive = false;
        }
  }, [])
  )
  
    const handleBarCodeScanned = async ({ data }) => {
      setScanned(true);
      let shouldRepeat = false;
      const dev_id = parseInt(data)
        const device_id_data = {
        order_id : order.order_id,
        dev_id : dev_id 
      }
      do {
        try {
          const jwt = await FileSystem.readAsStringAsync(
            url.atFileUri, 
            {encoding: FileSystem.EncodingType.UTF8});
            
          const response = await fetch(decryptString(url.addressEncrypt) + '/allocation',{
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'authorization': jwt
              },
              body: JSON.stringify(device_id_data),
              });
          const json = response.status;
          if(json === 201){
              shouldRepeat = false
              order.dev_id = dev_id;
              navigation.navigate('FoodboxManager', {dev_id : dev_id, order : order});
          }else if(json === 401){
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
          }
          else{
            shouldRepeat = false;
            Alert.alert(
              '에러',
              '오류가 발생하였습니다.',
              [
                  { text: '다시 시도', onPress: () => setScanned(false) },
              ],
              { cancelable: true }
            );
            console.log("Error : " + json);
          }
        } catch (error) {
          console.error(error)
        }
      } while (shouldRepeat === true);
    };
  
    if (hasPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
      return <Text>No access to camera</Text>;
    }
  
    return (
      <View style={styles.mainContainer}>
        <StatusBar translucent = {true} hidden = {false} style = "dark"/>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style = {StyleSheet.absoluteFillObject}
        />
        <Text style = {styles.infoText}>푸드박스 기기의 QR코드를 스캔해주세요.</Text>
        <View style = {{backgroundColor: 'rgba(52, 52, 52, 0)', borderWidth : 10, borderColor : colors.white, width : 250, height : 250 }}>

        </View>
        <View style = {styles.buttonsContainer} >
            <View style = {styles.iconAndTextContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('FoodboxCode', {order : order})} style = {styles.iconContainer}>
                    <Ionicons name = {'ios-keypad'} color={"black"} size = {25} />
                </TouchableOpacity>
                <Text style = {styles.buttonText} >코드 직접 입력</Text>
            </View>
            <View style = {styles.iconAndTextContainer}>
              <TouchableOpacity onPress={() => navigation.navigate('OrderInfo', {order: order})} style = {styles.closeIconContainer}>
                  <Ionicons name = {'close'} color={"black"} size = {25} />
              </TouchableOpacity>
              <Text style = {styles.buttonText} >닫기</Text>
            </View>
        </View>
      </View>
    );
  }

const styles = StyleSheet.create({
    mainContainer : {
        backgroundColor : colors.orange,
        flex : 1,
        alignItems : 'center',
        justifyContent : 'center',
    },
    infoText : {
        color : colors.white,
        fontSize : 20,
        fontWeight : "bold",
        marginBottom: 20
    },
    buttonsContainer : {
        flexDirection : 'row',
        alignItems : 'flex-start',
        justifyContent : 'space-between',
        height : 80,
        width : "60%",
        marginTop : 70,
    },
    iconAndTextContainer : {
        alignItems : 'center',
        justifyContent : 'center',
    },
    iconContainer : {
        backgroundColor : "white",
        height : 60,
        width :60,
        borderRadius :30,
        alignItems : 'center',
        justifyContent : 'center',
        marginBottom : 15
    },
    closeIconContainer : {
        backgroundColor : "white",
        height : 60,
        width :60,
        borderRadius :30,
        alignItems : 'center',
        justifyContent : 'center',
        marginBottom : 15
    },
    buttonText : {
        color : colors.white,
        fontSize : 16,
        fontWeight : "600"
    }
})