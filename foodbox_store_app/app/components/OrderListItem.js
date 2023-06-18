import React from "react";
import {View, StyleSheet, Text, TouchableOpacity, Dimensions} from 'react-native';
import colors from "../config/colors";

export default function OrderListItem({item, navigation}){
    const onItemPresss = () => {
        navigation.navigate('OrderInfo', {order: item})
    }

    return(
        <TouchableOpacity style = {styles.mainContainer} onPress = {onItemPresss} >
            <Text style = {styles.orderNumText}>주문번호 : {item.order_id} </Text>
            <View style = {styles.bottomContainer} >
                <Text style = {styles.foodboxAllocText}>푸드박스 기기 할당 여부 : {'dev_id' in item ? "할당" : "미할당" }</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    mainContainer : {
        backgroundColor : colors.white,
        padding : 15,
        alignSelf : 'center',
        borderRadius : 10,
        justifyContent : 'space-between',
        alignItems : 'flex-start',
        height : 100,
        marginBottom : 10,
        width :Dimensions.get('window').width *0.95,
    },
    orderNumText : {
        fontSize : 18,
        fontWeight : "700"
    },
    foodboxAllocText : {
        fontSize : 14,
        fontWeight : "500",
        color : colors.darkgrey
    },
    timeText : {
        fontSize : 14,
        fontWeight : "500",
        color : colors.grey
    },
    bottomContainer : {
        height : 30,
        width : "100%",
        flexDirection : 'row',
        alignItems : 'center',
        justifyContent : 'space-between',
    }
})