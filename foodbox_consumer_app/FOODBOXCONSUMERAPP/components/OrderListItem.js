import React from "react";
import {StyleSheet, View, Text, Dimensions, Image} from 'react-native';
import colors from "../config/colors";
import MaterialComunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

export default function OrderListItem({item, navigation}){
    const onItemPresss = () => {
        navigation.navigate('OrderDetails', {order_id : item.order_id})
    }
    let delivery =""; 
    let deliveryIcon = "";
    let deliveryIconColor = "red";

    if(item.state === "0"){
        delivery = "배달 준비"
        deliveryIcon = "truck-fast"
        deliveryIconColor = "red"
    }else if (item.state === "1"){
        delivery = "배달 중"
        deliveryIcon = "truck-delivery"
        deliveryIconColor = colors.orange
    }else{
        delivery = "배달 완료"
        deliveryIcon = "truck-check"
        deliveryIconColor = "green"
    }

    return(
        <TouchableWithoutFeedback style = {styles.mainContainer} onPress = {onItemPresss} >
            <View style = {{width : "83%",height : "100%", alignItems:"center", justifyContent : 'flex-start',flexDirection : 'row'}}>
                <Image style = {styles.image} source = { require('../assets/store.png')}/>
                <View style = {styles.textContainer}>
                    <Text style = {styles.storeNameText}>가게명: {item.store_name} </Text>
                    <Text style = {styles.orderNumText}>주문 번호: {item.order_id} </Text>
                </View>
            </View>
            <View style = {styles.deliveryContainer}>
                <MaterialComunityIcons name = {deliveryIcon} size = {35} color = {deliveryIconColor}/>
                <Text style = {styles.deliveryText}>{delivery} </Text>
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    mainContainer : {
        backgroundColor : colors.white,
        padding : 15,
        flexDirection : 'row',
        justifyContent : 'flex-start',
        alignItems : 'center',
        height : 100,
        borderRadius : 10,
        alignSelf : 'center',
        marginBottom : 10,
        borderColor : colors.lightgrey,
        width :Dimensions.get('window').width * 0.95,
    },
    textContainer : {
        justifyContent : 'flex-start',
        alignItems : 'flex-start',
    },
    deliveryContainer : {
        justifyContent : 'center',
        alignItems : 'center',
    },
    storeNameText : {
        fontSize : 16,
        fontWeight : "600",
        alignSelf : 'flex-start'
    },
    orderNumText : {
        fontSize : 14,
        fontWeight : "500",
        alignSelf : 'flex-start',
        color : colors.darkgrey,
        marginTop : 10
    },
    deliveryText : {
        fontSize : 14,
        fontWeight : "400",
        color : colors.darkgrey,
        marginTop : 5
    },
    image : {
        height : 80,
        width : 80,
        marginRight : 15,
        borderRadius : 5,
        resizeMode : 'contain'
    }
})