import React from "react";
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import colors from "../config/colors";

export default function OvalButton ({textColor, title, color, onPress}){
    return(
        <TouchableOpacity onPress = {onPress} style = {[styles.container, {backgroundColor : color}]}>
            <Text style = {[styles.text, {color : textColor}]} >{title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor : "black",
        alignItems : "center",
        justifyContent : "center",
        height : 60,
        width: "40%",
        borderRadius : 30

    },
    text: {
        fontSize: 18,
        fontWeight : "500",
        color : "white"
    }
})