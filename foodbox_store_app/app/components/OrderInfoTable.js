import React from "react";
import {View, StyleSheet, Text} from 'react-native';
import colors from "../config/colors";
import MaterialComunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

export default function OrderInfoTable({order}){

    let delivery =""; 
    let deliveryIcon = "";
    let deliveryIconColor = "";

    if(order.state === "0"){
        delivery = "배달 준비"
        deliveryIcon = "truck-fast"
        deliveryIconColor = "red"
    }else if (order.state === "1"){
        delivery = "배달 중"
        deliveryIcon = "truck-delivery"
        deliveryIconColor = colors.orange
    }else{
        delivery = "배달 완료"
        deliveryIcon = "truck-check"
        deliveryIconColor = "green"
    }


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
                    <Text style = {styles.categoryText}>소비자의 아이디</Text>
                </View>
                <View style = {styles.rightBoxContainer}>
                    <Text style = {styles.orderInfoText}>{order.cons_id}</Text>
                </View>
            </View>

            <View style = {styles.rowContainer}>
                <View style = {styles.leftBoxContainer}>
                    <Text style = {styles.categoryText}>푸드박스 식별번호</Text>
                </View>
                <View style = {styles.rightBoxContainer}>
                    <Text style = {styles.orderInfoText}>{'dev_id' in order ? order.dev_id : "미할당"}</Text>
                </View>
            </View>

            <View style = {styles.rowContainer}>
                <View style = {styles.leftBoxContainer}>
                    <Text style = {styles.categoryText}>배송 주소</Text>
                </View>
                <View style = {styles.rightBoxContainer}>
                    <Text style = {styles.orderInfoText}>충청남도 아산시 탕정면 선문로 71번길 200, 기숙사</Text>
                </View>
            </View>

            <View style = {styles.rowContainer}>
                <View style = {styles.leftBoxContainer}>
                    <Text style = {styles.categoryText}> 주문 내용</Text>
                </View>
                <View style = {styles.rightBoxContainer}>
                    <Text style = {styles.orderInfoText}>차돌떡볶이 - 1개</Text>
                </View>
            </View>
            
            <View style = {styles.rowContainer}>
                <View style = {styles.leftBoxContainer}>
                    <Text style = {styles.categoryText}> 배달 상태</Text>
                </View>
                <View style = {styles.rightBoxContainer}>
                    <Text style = {[styles.orderInfoText, {marginRight : 20}]}>{delivery}</Text>
                    <MaterialComunityIcons name = {deliveryIcon} size = {35} color = {deliveryIconColor}/>
                </View>
            </View>
            
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer : {
        width : '95%',
        height : "70%",
        marginTop : 10,
        borderWidth : 1,
        borderColor : colors.lightgrey,
        backgroundColor : colors.white
    },
    rowContainer : {
        height: "16.7%",
        width : "100%",
        borderBottomWidth: 0.5,
        borderBottomColor : colors.grey,
        flexDirection : "row"
    },
    leftBoxContainer : {
        height : "100%",
        width: "40%",
        alignItems : 'flex-start',
        paddingLeft : 20,
        justifyContent : "center",
        borderRightColor : colors.grey,
        borderRightWidth : 0.5
    },
    rightBoxContainer : {
        height : "100%",
        width: "60%",
        flexDirection : "row",
        alignItems : 'center',
        justifyContent : "flex-start",
        paddingLeft : 20,
        borderRightWidth : 0.5,
        borderRightColor : colors.grey
    },
    orderNumText : {
        fontSize : 18,
        fontWeight : "600"
    },
    categoryText : {
        fontSize : 16,
        fontWeight : "600"
    },
    orderInfoText : {
        fontSize : 16,
        fontWeight : "600"
    },
    
})