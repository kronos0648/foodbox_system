import React from "react";
import {View, StyleSheet, Text} from 'react-native';
import colors from "../config/colors";

export default function OrderInfoFoodboxManager({order, dev_id}){
    return(
        <View style = {styles.mainContainer}>
            <View style = {styles.rowContainer}>
                <View style = {styles.leftBoxContainer}>
                    <Text style = {styles.orderNumText}>주문 번호</Text>
                </View>
                <View style = {styles.rightBoxContainer}>
                    <Text style = {styles.orderNumText}>{order.order_id}</Text>
                </View>
            </View>

            <View style = {styles.rowContainer}>
                <View style = {styles.leftBoxContainer}>
                    <Text style = {styles.categoryText}>푸드박스 식별번호</Text>
                </View>
                <View style = {styles.rightBoxContainer}>
                    <Text style = {styles.orderInfoText}>{dev_id}</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer : {
        width : '100%',
        height : "20%",
        borderWidth : 1,
        borderColor : colors.lightgrey,
        backgroundColor : colors.white,
        marginBottom : 20
    },
    rowContainer : {
        height: "50%",
        width : "100%",
        borderBottomWidth: 0.5,
        borderBottomColor : colors.grey,
        flexDirection : "row"
    },
    leftBoxContainer : {
        height : "100%",
        width: "50%",
        alignItems : 'flex-start',
        paddingLeft : 20,
        justifyContent : "center",
        borderRightColor : colors.grey,
        borderRightWidth : 0.5
    },
    rightBoxContainer : {
        height : "100%",
        width: "50%",
        alignItems : 'flex-start',
        paddingLeft : 20,
        justifyContent : "center",
        borderRightWidth : 0.5,
        borderRightColor : colors.grey
    },
    orderNumText : {
        fontSize : 20,
        fontWeight : "700"
    },
    categoryText : {
        fontSize : 16,
        fontWeight : "500"
    },
    orderInfoText : {
        fontSize : 16,
        fontWeight : "bold"
    },
    
})